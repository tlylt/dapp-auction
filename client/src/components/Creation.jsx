import CloseIcon from '@mui/icons-material/Close';
import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import { useEth } from '../contexts/EthContext';
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

export default function Creation({ refetchData }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    state: { web3, networkID, accounts },
  } = useEth();
  const auctionJson = require('../contracts/AuctionFactory.json');
  let auctionFactoryContract;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (vars.nftAddress === '') {
      enqueueSnackbar('NFT Address is required', { variant: 'error' });
      return;
    }
    if (vars.startingBid <= 0) {
      enqueueSnackbar('Starting Bid must be greater than 0', {
        variant: 'error',
      });
      return;
    }
    if (vars.duration <= 0) {
      enqueueSnackbar('Duration must be greater or equal to 1 hour', {
        variant: 'error',
      });
      return;
    }

    if (vars.increment <= 0) {
      enqueueSnackbar('Increment must be greater than 0', { variant: 'error' });
      return;
    }

    let auctionAddress = auctionJson.networks[networkID].address;
    auctionFactoryContract = new web3.eth.Contract(
      auctionJson.abi,
      auctionAddress
    );
    try {
      let val = await auctionFactoryContract.methods
        .createNewAuction(
          vars.nftAddress,
          vars.nftId,
          vars.startingBid * Math.pow(10, 9),
          vars.increment * Math.pow(10, 9), //convert from Gwei in form input to wei in Auction constructor
          vars.duration * 60 * 60 // convert from hours in form input to seconds in Auction constructor
        )
        .send({ from: accounts[0] });
      let auctionDeployedAddress =
        val.events.ContractCreated.returnValues.newContractAddress;
      console.log(auctionDeployedAddress);
      setOpen(false);
      enqueueSnackbar('Auction Created', { variant: 'success' });
      setVars({
        nftAddress: '',
        nftId: '',
        startingBid: 0,
        increment: 0,
        duration: 0,
      });
      refetchData();
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Transaction Rejected', { variant: 'error' });
      return;
    }
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
              placeholder="0x..."
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
              label="Starting Bid (gWei)"
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
              label="Minimum Increment (gWei)"
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
