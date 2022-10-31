import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function calculateTimeTillExpiry(auctionInfo) {
  const expiryTime = auctionInfo.endAt;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeTillExpiryInSeconds = expiryTime - currentTime;

  return {
    timeTillExpiryMinutes: Math.floor(timeTillExpiryInSeconds / 60),
    timeTillExpirySeconds: timeTillExpiryInSeconds % 60,
  };
}

function calculateStatus(auctionInfo) {
  return auctionInfo.started
    ? "Started"
    : auctionInfo.ended
    ? "Ended"
    : "Not Started";
}

function NFTListingBidModal(props) {
  const { pinataMetadata, auctionInfo, auctionContract } = props;
  const [highestBid, setHighestBid] = useState(auctionInfo.highestBid);
  const { timeTillExpiryMinutes, timeTillExpirySeconds } =
    calculateTimeTillExpiry(auctionInfo);
  const status = calculateStatus(auctionInfo);

  useEffect(() => {
    setHighestBid(auctionInfo.highestBid);
  }, [auctionInfo, setHighestBid]);

  useEffect(() => {
    if (auctionContract !== null) {
      auctionContract.events.Bid({}, (err, res) => {
        setHighestBid(parseInt(res.args.amount));
      });
    }
  }, [auctionContract, setHighestBid]);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {pinataMetadata.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Status: {status}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Highest Bid: {highestBid}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Time Till Expiry:
          <CountdownTimer
            initialMinute={timeTillExpiryMinutes}
            initialSecond={timeTillExpirySeconds}
          />
        </Typography>
        <hr />
        <TextField
          id="modal-bid"
          label="My Bid (GWei)"
          type="number"
          variant="outlined"
        />
        <Button variant="contained">Submit Bid</Button>
      </Box>
    </Modal>
  );
}

export default NFTListingBidModal;
