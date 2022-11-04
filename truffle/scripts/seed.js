const AuctionFactory = artifacts.require("AuctionFactory");
const MintNFT = artifacts.require("MintNFT");
const Auction = artifacts.require("Auction");

const ether = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};

module.exports = async function (callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts();

    // Fetch the deployed auction factory
    const auctionFactory = await AuctionFactory.deployed();
    console.log("AuctionFactory fetched", auctionFactory.address);

    // Fetch the deployed MintNFT
    const mintNFT = await MintNFT.deployed();
    console.log("MintNFT fetched", mintNFT.address);
    // Set up 7 demo users in an array in a loop
    const demoUsers = [];
    for (let i = 0; i < 7; i++) {
      demoUsers.push({
        account: accounts[i],
      });
    }

    // Read URL from allDemoNFTs.json
    const allDemoNFTs = require("./allDemoNFTs.json");
    for (let i = 0; i < demoUsers.length; i++) {
      const user = demoUsers[i];
      const nft = allDemoNFTs[i];
      const res = await mintNFT.mint(nft.ipfsHash, { from: user.account });
      const tokenId = res.receipt.logs[0].args.tokenId.words[0];
      demoUsers[i].tokenId = tokenId;
    }

    // Construct auction
    for (let i = 0; i < demoUsers.length; i++) {
      const user = demoUsers[i];
      // if it is the first user, set hour to 1 minute
      const hour = i === 0 ? 60 : Math.floor(Math.random() * 1440) + 1;
      const auction = await auctionFactory.createNewAuction(
        mintNFT.address,
        user.tokenId,
        ether(0.01), // random starting price
        ether(Math.floor(Math.random() * 100) / 10000), // random increment
        hour, // set a random duration between 1 minute and 24 hours
        { from: user.account }
      );
      user.auctionAddress = auction.logs[0].args.newContractAddress;
    }

    // Each user approves the auction factory to spend their NFT
    for (let i = 0; i < demoUsers.length; i++) {
      const user = demoUsers[i];
      await mintNFT.approve(user.auctionAddress, user.tokenId, {
        from: user.account,
      });
    }

    // Start half of the auctions
    for (let i = 0; i < demoUsers.length; i++) {
      const user = demoUsers[i];
      if (i % 2 === 0) {
        // fetch auction
        const auction = await Auction.at(user.auctionAddress);
        // start auction
        await auction.start({ from: user.account });
      }
    }

    // Print out the demo users
    console.log("These are the demo users:\n");
    console.log(demoUsers);
  } catch (error) {
    console.log(error);
  }
  callback();
};
