import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import CountdownTimer from './CountdownTimer';
import { useState } from 'react';
import { useEth } from '../contexts/EthContext';
import { displayInGwei } from '../utils';
import { useSnackbar } from 'notistack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const test = async (things) => {
  let auctionContract = things.auctionContract;
  let info = await auctionContract.methods.info().call();
  console.log(info);
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
  const [timeTillExpiry, setTimeTillExpiry] = useState(0);
  const [currBidAmount, setCurrBidAmount] = useState(0);

  const handleBidAmountChange = (event) => {
    setCurrBidAmount(event.target.value);
  };

  const submitBid = async () => {
    // Handle bidding
    // User bid amount is lower than highestBid or less than increment
    if (currBidAmount < highestBid) {
      // some notification
      enqueueSnackbar('Bid amount is lower than highest bid', {
        variant: 'error',
      });
      return;
    } else if (
      currBidAmount - highestBid < auctionData.increment &&
      accounts[0] !== auctionData.highestBidder
    ) {
      // some notification
    }
    let sendAmount = currBidAmount - auctionData.userBidAmount;

    const auctionContract = auctionData.auctionContract;

    try {
      const res = await auctionContract.methods
        .bid()
        .send({ from: accounts[0], value: sendAmount });
      console.log(res);
      setHighestBid(currBidAmount);
      enqueueSnackbar('Bid submitted successfully!', { variant: 'success' });
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Bid failed', { variant: 'error' });
    }
  };

  const handleStartAuction = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.start().send({ from: accounts[0] });
      console.log('auction started :D');
    } catch (err) {
      console.log(err);
    }
  };

  const handleWithdraw = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.withdraw().send({ from: accounts[0] });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnd = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.end().send({ from: accounts[0] });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Open</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent={'space-between'}>
            <Button onClick={() => test(auctionData)}>
              Print auction info
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </Box>
          <Box
            sx={{
              marginLeft: '14px',
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
              <CountdownTimer initialMinute={2} initialSecond={10} />
            </Typography>
            <hr />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <Box display="flex">
                <Typography>
                  If you are the seller:{' '}
                  <Button variant="contained" onClick={handleStartAuction}>
                    Start
                  </Button>{' '}
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
                    No longer interested?{' '}
                    <Button variant="contained" onClick={handleWithdraw}>
                      {' '}
                      Withdraw{' '}
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
