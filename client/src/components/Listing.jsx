import { Card, Box, Grid, Typography, List, Button } from '@mui/material';
import { useEffect } from 'react';
import AuctionDetails from './AuctionDetails';
import { useEth } from '../contexts/EthContext';
import { getAuctionFactoryContract, getAuctions } from '../utils';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

function Listing() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: { web3, networkID },
  } = useEth();

  const [auctionFactoryContract, setAuctionFactoryContract] = useState(null);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    if (web3 && networkID) {
      setAuctionFactoryContract(getAuctionFactoryContract(web3, networkID));
    }
  }, [web3, networkID]);

  useEffect(() => {
    console.log('auctions', auctions);
  }, [auctions]);

  async function refetchData() {
    const auctions = await getAuctions(web3, auctionFactoryContract);
    setAuctions(auctions);
    enqueueSnackbar('Auctions refreshed', {
      variant: 'success',
    });
  }

  useEffect(() => {
    async function fetchData() {
      const auctions = await getAuctions(web3, auctionFactoryContract);
      setAuctions(auctions);
    }
    if (auctionFactoryContract) {
      fetchData();
    }
  }, [auctionFactoryContract, web3]);

  return (
    <Card>
      <Typography
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4}
        variant="h4"
      >
        All Auctions{' '}
        <Button
          onClick={() => {
            refetchData();
          }}
          variant="text"
          color="secondary"
          size="small"
        >
          Refresh
        </Button>
      </Typography>
      <Grid spacing={0} container>
        <Box py={4} pr={4} flex={1}>
          <Grid
            container
            xs={12}
            item
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <List
              sx={{
                width: '80%',
              }}
            >
              {auctions === [] ? (
                <Typography
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Auctions available at the moment...
                </Typography>
              ) : (
                auctions.map((auction, idx) => (
                  <AuctionDetails auction={auction} key={idx} />
                ))
              )}
            </List>
          </Grid>
        </Box>
      </Grid>
    </Card>
  );
}

export default Listing;
