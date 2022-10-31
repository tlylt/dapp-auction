import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import * as React from "react";
import NFTListingBidModal from "./NFTListingBidModal";

function handleOpenBidModal(setIsBidModalOpen) {
  setIsBidModalOpen(true);
}

function handleCloseBidModal(setIsBidModalOpen) {
  setIsBidModalOpen(false);
}

function AuctionListing(props) {
  const { auctionContract, pinataMetadata, auctionInfo } = props.auction;
  const [isBidModalOpen, setIsBidModalOpen] = React.useState(false);
  return (
    <div>
      <ImageListItem>
        <img
          src={pinataMetadata.image}
          alt={pinataMetadata.name}
          loading="lazy"
        />
        <ImageListItemBar
          title={pinataMetadata.name}
          subtitle={pinataMetadata.description}
          actionIcon={
            <IconButton
              onClick={() => handleOpenBidModal(setIsBidModalOpen)}
              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      </ImageListItem>
      {isBidModalOpen && (
        <NFTListingBidModal
          open={isBidModalOpen}
          onClose={handleCloseBidModal}
          auctionContract={auctionContract}
          auctionInfo={auctionInfo}
          pinataMetadata={pinataMetadata}
        />
      )}
    </div>
  );
}

export default AuctionListing;
