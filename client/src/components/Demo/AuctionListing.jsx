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
  const { pinataMetadata } = props.auction;
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
          pinataMetadata={pinataMetadata}
        />
      )}
    </div>
  );
}

export default AuctionListing;
