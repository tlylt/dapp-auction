import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ListSubheader from "@mui/material/ListSubheader";
import React, { useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import AuctionListing from "./AuctionListing";

function getAuctionFactoryContract(web3, networkID) {
  if (web3 === null || networkID === null) {
    return;
  }

  const auctionJson = require("../../contracts/AuctionFactory.json");
  const auctionAddress = auctionJson.networks[networkID].address;
  const auctionFactoryContract = new web3.eth.Contract(
    auctionJson.abi,
    auctionAddress
  );
  return auctionFactoryContract;
}

async function getPinataConnection() {
  const pinataSDK = require("@pinata/sdk");
  const pinata = new pinataSDK(
    process.env.REACT_APP_PINATA_API_KEY,
    process.env.REACT_APP_PINATA_API_SECRET
  );
  console.log("Testing Pinata authentication...");
  const { authenticated } = await pinata.testAuthentication();

  if (authenticated) {
    console.log("Pinata authentication succeeded");
    return pinata;
  }

  console.error(
    "Pinata authentication failed. Check your API key and secret API key."
  );
}

async function getURIMetadataMap() {
  const pinata = await getPinataConnection();
  const metadataFilter = {
    name: "metadata.json",
  };
  const filters = {
    status: "pinned",
    pageLimit: 100,
    pageOffset: 0,
    metadata: metadataFilter,
  };
  const { rows } = await pinata.pinList(filters);
  const imageUriMetadataMap = new Map();

  for (let row of rows) {
    imageUriMetadataMap[row.metadata.keyvalues.image] = row.metadata.keyvalues;
  }

  return imageUriMetadataMap;
}

async function populateAuctionListings(
  web3,
  auctionFactoryContract,
  imageUriMetadataMap,
  setAuctionListings
) {
  const auctionListings = [];
  const auctionContractAddresses = await auctionFactoryContract.methods
    .getAuctions()
    .call();
  const auctionContractJson = require("../../contracts/Auction.json");
  const mintNftContractJson = require("../../contracts/MintNFT.json");

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
    const info = await auctionContract.methods.info().call();
    console.log(info);
    // debugger;

    const mintNftContractAddress = await auctionContract.methods.nft().call();
    const mintNftContract = new web3.eth.Contract(
      mintNftContractJson.abi,
      mintNftContractAddress
    );
    const pinataImageUri = await mintNftContract.methods
      .tokenURI(nftId)
      .call();
    const pinataMetadata = imageUriMetadataMap[pinataImageUri];
    // console.log(pinataImageUri, imageUriMetadataMap)
    const auction = {
      pinataImageUri: pinataImageUri,
      pinataMetadata: pinataMetadata,
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
      auctionContract: auctionContract
    };
    auctionListings.push(auction);
  }
  setAuctionListings(auctionListings);
}

function AuctionListings() {
  const {
    state: { web3, networkID },
  } = useEth();
  const [auctionListings, setAuctionListings] = React.useState([]);
  const [auctionFactoryContract, setAuctionFactoryContract] =
    React.useState(null);
  const [imageUriMetadataMap, setImageUriMetadataMap] = React.useState(null);

  // useEth() hook is async and `web3` and `networkID` may be undefined
  // at the time we call getAuctionFactoryContract(web3, networkID)
  useEffect(() => {
    setAuctionFactoryContract(getAuctionFactoryContract(web3, networkID));
  }, [web3, networkID]);

  // Load our metadata from Pinata immediately
  useEffect(() => {
    getURIMetadataMap().then((map) => {
      setImageUriMetadataMap(map);
    });
  }, []);

  if (
    web3 == null ||
    auctionFactoryContract == null ||
    imageUriMetadataMap == null
  ) {
    return <CircularProgress />;
  }

  if (auctionListings.length === 0) {
    return (
      <Button
        variant="contained"
        onClick={() =>
          populateAuctionListings(
            web3,
            auctionFactoryContract,
            imageUriMetadataMap,
            setAuctionListings
          )
        }
      >
        Get Auctions
      </Button>
    );
  }

  return (
    <ImageList sx={{ width: 500, height: 450 }}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">NFT Listings</ListSubheader>
      </ImageListItem>
      {auctionListings.map((auction, _index) => (
        <AuctionListing key={auction.pinataImageUri} auction={auction} />
      ))}
    </ImageList>
  );
}

export default AuctionListings;
