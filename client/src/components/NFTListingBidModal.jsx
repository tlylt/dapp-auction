import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";
import { useEth } from "../contexts/EthContext";
import { displayInGwei } from "../utils";
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

function getRPCErrorMessage(err) {
  let msg = "";
  try {
    var open = err.message.indexOf("{");
    var close = err.message.lastIndexOf("}");
    var j_s = err.message.substring(open, close + 1);
    var j = JSON.parse(j_s);

    msg = j.value.data.message;
    open = msg.indexOf("revert");
    close = msg.length;
    msg = msg.substring(open + 7, close);
  } catch (err) {
    msg = "An error occurred";
  }

  return msg;
}

const test = async (things, accounts) => {
  console.log('Auction data: ', things)
  // let auctionContract = things.auctionContract;
  // let info = await auctionContract.methods.info().call({from: accounts[0]});
  // console.log(info);
};

const calculateTimeTillExpiry = (auctionData) => {
  const expiryTime = auctionData.endAt;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeTillExpiryInSeconds = expiryTime - currentTime;
  return {
    timeTillExpiryHours: Math.floor(timeTillExpiryInSeconds / 3600),
    timeTillExpiryMinutes: Math.floor((timeTillExpiryInSeconds % 3600) / 60),
    timeTillExpirySeconds: timeTillExpiryInSeconds % 60,
  };
};

function NFTListingBidModal({ pinataMetadata, auctionData }) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: { accounts },
  } = useEth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [highestBid, setHighestBid] = useState(auctionData.highestBid);
  const { timeTillExpiryHours, timeTillExpiryMinutes, timeTillExpirySeconds } =
    calculateTimeTillExpiry(auctionData);
  const [currBidAmount, setCurrBidAmount] = useState(0);

  // As soon as auctionContract is ready, we'll register our Solidity event listener on Auction.bid()
  useEffect(() => {
    if (auctionData.auctionContract !== null) {
      auctionData.auctionContract.events.Bid({}, (err, res) => {
        setHighestBid(parseInt(res.returnValues.amount));
      });
    }
  }, [auctionData.auctionContract, setHighestBid]);

  const handleBidAmountChange = (event) => {
    setCurrBidAmount(event.target.value * Math.pow(10, 9));
  };

  const submitBid = async () => {
    // Handle bidding
    // User bid amount is lower than highestBid or less than increment
    if (currBidAmount < highestBid) {
      // some notification
      enqueueSnackbar("Bid amount is lower than highest bid", {
        variant: "error",
      });
      return;
    } else if (
      currBidAmount - highestBid < auctionData.increment &&
      accounts[0] !== auctionData.highestBidder
    ) {
      enqueueSnackbar(
        "Bid amount should be greater than highest bid + increment!",
        { variant: "warning" }
      );
      return;
    } else {
      let sendAmount = currBidAmount - auctionData.userBidAmount;
      // debugger;
      console.log(currBidAmount, auctionData.userBidAmount, sendAmount);
      const auctionContract = auctionData.auctionContract;
      try {
        console.log(`sending amount = ${sendAmount}`);
        await auctionContract.methods
          .bid()
          .send({ from: accounts[0], value: sendAmount });
        enqueueSnackbar("Successfully submitted bid!", { variant: "success" });
        auctionData.userBidAmount = currBidAmount;
        console.log(auctionData.userBidAmount)
      } catch (err) {
        enqueueSnackbar(getRPCErrorMessage(err), { variant: "error" });
      }
    }
  };

  const handleStartAuction = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.start().send({ from: accounts[0] });
      enqueueSnackbar("Auction Successfully Started", { variant: "success" });
      console.log("auction started :D");
    } catch (err) {
      enqueueSnackbar(getRPCErrorMessage(err), { variant: "error" });
    }
  };

  const handleWithdraw = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.withdraw().send({ from: accounts[0] });
      enqueueSnackbar("Successfully withdrew your bid amount", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getRPCErrorMessage(err), { variant: "error" });
    }
  };

  const handleEnd = async () => {
    if (
      accounts[0] !== auctionData.seller &&
      accounts[0] !== auctionData.highestBidder
    ) {
      enqueueSnackbar("You are not the seller nor highest bidder", {
        variant: "error",
      });
      return;
    }
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.end().send({ from: accounts[0] });
      enqueueSnackbar("Successfully ended the auction!", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getRPCErrorMessage(err), { variant: "error" });
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Open</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent={"space-between"}>
            <Button onClick={() => test(auctionData, accounts)}>
              Print auction info
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </Box>
          <Box
            sx={{
              marginLeft: "14px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Title: {pinataMetadata.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Highest Bid: {displayInGwei(highestBid)} gwei
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Time Till Expiry:
              {auctionData.started ? (
                <CountdownTimer
                  initialHour={timeTillExpiryHours}
                  initialMinute={timeTillExpiryMinutes}
                  initialSecond={timeTillExpirySeconds}
                />
              ) : (
                <span>
                  <i>Auction has not yet started</i>
                </span>
              )}
            </Typography>
            <hr />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Box display="flex">
                <Typography>
                  If you are the seller{" "}
                  <Button variant="contained" onClick={handleStartAuction}>
                    Start
                  </Button>{" "}
                  <Button variant="contained" onClick={handleEnd}>
                    End
                  </Button>
                </Typography>
              </Box>
              <Box display="flex">
                <TextField
                  id="modal-bid"
                  label="My Bid (GWei)"
                  type="number"
                  variant="outlined"
                  required
                  min={0}
                  size="small"
                  onChange={handleBidAmountChange}
                />
                <Button variant="contained" onClick={submitBid}>
                  Submit Bid
                </Button>
              </Box>
              <Box>
                <Box display="flex">
                  <Typography>
                    No longer interested?{" "}
                    <Button variant="contained" onClick={handleWithdraw}>
                      {" "}
                      Withdraw{" "}
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default NFTListingBidModal;
