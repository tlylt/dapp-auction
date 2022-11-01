import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useEth } from '../contexts/EthContext';
import { useState } from 'react';
import { Box, TextField } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Creation() {
  const [open, setOpen] = useState(false);

  const {
    state: { web3, networkID, accounts },
  } = useEth();
  const auctionJson = require('../contracts/AuctionFactory.json');
  let auctionFactoryContract;

  const handleCreate = async (e) => {
    e.preventDefault();
    let auctionAddress = auctionJson.networks[networkID].address;
    auctionFactoryContract = new web3.eth.Contract(
      auctionJson.abi,
      auctionAddress
    );
    let val = await auctionFactoryContract.methods
      .createNewAuction(
        vars.nftAddress,
        vars.nftId,
        vars.startingBid,
        vars.increment,
        vars.duration
      )
      .send({ from: accounts[0] });
    let auctionDeployedAddress =
      val.events.ContractCreated.returnValues.newContractAddress;
    console.log(auctionDeployedAddress);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [vars, setVars] = useState({
    nftAddress: '',
    nftId: 0,
    startingBid: 0,
    increment: 0,
    duration: 0,
  });

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new auction
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          🚀 New Auction
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreate} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nftAddress"
              label="NFT Address"
              name="nftAddress"
              autoFocus
              onChange={(event) => {
                setVars({
                  ...vars,
                  nftAddress: event.target.value,
                });
              }}
              value={vars.nftAddress}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="nftTokenId"
              label="NFT Token ID"
              id="nftTokenId"
              type="number"
              onChange={(event) => {
                setVars({
                  ...vars,
                  nftId: event.target.value,
                });
              }}
              value={vars.nftId}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              min={0}
              name="startingBid"
              label="Starting Bid"
              id="startingBid"
              type="number"
              onChange={(event) => {
                setVars({
                  ...vars,
                  startingBid: event.target.value,
                });
              }}
              value={vars.startingBid}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="minIncrement"
              label="Minimum Increment"
              id="minIncrement"
              type="number"
              onChange={(event) => {
                setVars({
                  ...vars,
                  increment: event.target.value,
                });
              }}
              value={vars.increment}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="duration"
              label="Auction Duration (hrs)"
              id="duration"
              type="number"
              onChange={(event) => {
                setVars({
                  ...vars,
                  duration: event.target.value,
                });
              }}
              value={vars.duration}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
          <Typography gutterBottom>
            *Note: This only creates the auction, you still need to approve the
            NFT and start the auction when you are done
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
