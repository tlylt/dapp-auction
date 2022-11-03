export function getAuctionFactoryContract(web3, networkID) {
  if (web3 === null || networkID === null) {
    console.log(
      "Unable to get AuctionFactory contract. web3 or networkID is null."
    );
    return;
  }

  const auctionFactoryJson = require("./contracts/AuctionFactory.json");
  if (
    auctionFactoryJson &&
    auctionFactoryJson.networks[networkID] === undefined
  ) {
    console.log("Unable to get AuctionFactory contract. networkID is invalid.");
    return;
  }
  const auctionFactoryAddress = auctionFactoryJson.networks[networkID].address;
  const auctionFactoryContract = new web3.eth.Contract(
    auctionFactoryJson.abi,
    auctionFactoryAddress
  );
  return auctionFactoryContract;
}

export async function getAuctions(web3, auctionFactoryContract, accounts) {
  if (
    web3 === null ||
    auctionFactoryContract === null ||
    accounts == null ||
    auctionFactoryContract === undefined
  ) {
    console.log(
      "Unable to get auctions. web3 or auctionFactoryContract is null."
    );
    return [];
  }
  const auctionContractAddresses = await auctionFactoryContract.methods
    .getAuctions()
    .call();
  const auctionContractJson = require("./contracts/Auction.json");
  const mintNftContractJson = require("./contracts/MintNFT.json");
  const auctions = [];
  for (let auctionContractAddress of auctionContractAddresses) {
    const auctionContract = new web3.eth.Contract(
      auctionContractJson.abi,
      auctionContractAddress
    );
    const nftId = parseInt(await auctionContract.methods.nftId().call());
    // TODO - Enforce min bid increment - highestBid, increment
    // TODO - Update highest bid by listening for emitted Bid events
    // TODO - Submit bid via payable Auction.bid()
    // TODO - NFT Listing has different image sizes - standardize via css
    const info = await auctionContract.methods
      .info()
      .call({ from: accounts[0] });
    // const info = await auctionContract.methods
    //   .info({ from: accounts[0] })
    //   .call();

    console.log("Auction info", info);
    try {
      const mintNftContractAddress = await auctionContract.methods.nft().call();
      const mintNftContract = new web3.eth.Contract(
        mintNftContractJson.abi,
        mintNftContractAddress
      );
      const nftMetadataUri = await mintNftContract.methods
        .tokenURI(nftId)
        .call();
      const nftMetadata = await fetch(nftMetadataUri);
      // console.log(nftMetadata, nftMetadataUri);
      const nftMetadataJson = await nftMetadata.json();
      // console.log("NFT Metadata", nftMetadataJson);
      const auction = {
        pinataImageUri: nftMetadataJson.image,
        pinataMetadata: nftMetadataJson,
        seller: info[0],
        highestBidder: info[1],
        startAt: parseInt(info[2]),
        duration: parseInt(info[3]),
        endAt: parseInt(info[4]),
        increment: parseInt(info[5]),
        highestBid: parseInt(info[6]),
        nftId: parseInt(info[7]),
        userBidAmount: parseInt(info[8]),
        started: info[9],
        ended: info[10],
        auctionContract: auctionContract,
      };
      console.log("auction object", auction);
      auctions.push(auction);
    } catch (e) {
      console.log("Unable to get NFT for auction: " + auctionContractAddress);
      console.log(e);
      continue;
    }
  }
  return auctions;
}

export function displayInGwei(wei) {
  return wei / 1000000000;
}

export function displayInHours(seconds) {
  return seconds / 3600;
}
