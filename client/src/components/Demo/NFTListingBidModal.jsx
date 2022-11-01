import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import CountdownTimer from './CountdownTimer';
import { useState } from 'react';
import { useEth } from '../../contexts/EthContext';

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
  console.log('here');
  let auctionContract = things.auctionContract;
  let info = await auctionContract.methods.info().call();
  console.log(info);
};

function NFTListingBidModal(props) {
  const {
    state: { accounts },
  } = useEth();

  const { pinataMetadata } = props;
  const { ...auctionData } = props.auctionData;
  const [ highestBid, setHighestBid] = useState(auctionData.highestBid);
  const [ timeTillExpiry, setTimeTillExpiry ] = useState(0);
  const [ currBidAmount, setCurrBidAmount ] = useState(0);

  const handleBidAmountChange = (event) => {
    setCurrBidAmount(event.target.value);
  };


  const submitBid = async () => {
    // Handle bidding
    // User bid amount is lower than highestBid or less than increment
    if (currBidAmount < highestBid) {
      // some notification
    } else if (currBidAmount - highestBid < auctionData.increment && accounts[0] !== auctionData.highestBidder) {
      // some notification
    }
    let sendAmount = currBidAmount - auctionData.userBidAmount;

    const auctionContract = auctionData.auctionContract;
    try {
      let res = await auctionContract.methods
        .bid()
        .send({ from: accounts[0], value: sendAmount });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartAuction = async () => {
    const auctionContract = auctionData.auctionContract;
    try {
      await auctionContract.methods.start().send({ from: accounts[0] })
      console.log("auction started :D")
    } catch(err){
      console.log(err)
    }
  };

  const handleWithdraw = async() => {
    const auctionContract = auctionData.auctionContract
    try {
      await auctionContract.methods.withdraw().send({ from: accounts[0] })
    } catch(err){
      console.log(err)
    }
  };

  const handleEnd = async() => {
    const auctionContract = auctionData.auctionContract
    try {
      await auctionContract.methods.end().send({ from: accounts[0] })
    } catch(err){
      console.log(err)
    }
  };

  return (
    <Modal open={props.open}>
      <Box sx={style}>
        <Button onClick={() => props.onClose(false)}>Close</Button>
        <Button onClick={() => test(auctionData)}>Print auction info</Button>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {pinataMetadata.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Highest Bid: {highestBid}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Time Till Expiry:
          <CountdownTimer initialMinute={2} initialSecond={10} />
        </Typography>
        <hr />
        <Button variant="contained" onClick={handleStartAuction}>
          {' '}
          Start{' '}
        </Button>
        <br />
        <TextField
          id="modal-bid"
          label="My Bid (GWei)"
          type="number"
          variant="outlined"
          onChange={handleBidAmountChange}
        />
        <Button variant="contained" onClick={submitBid}>
          Submit Bid{' '}
        </Button>
        <br />
        <Button variant="contained" onClick={handleWithdraw}> Withdraw </Button>
        <br />
        <Button variant="contained" onClick={handleEnd}> End </Button>
      </Box>
    </Modal>
  );
}

export default NFTListingBidModal;
