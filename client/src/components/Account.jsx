import { Card, Box, Grid, Typography, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useEth } from '../contexts/EthContext';
import { displayInGwei, displayInHours } from '../utils';
import NftApprovalCard from './NftApprovalCard';

function Account({ auctions }) {
  const [auction, setAuction] = useState();
  const {
    state: { accounts },
  } = useEth();

  useEffect(() => {
    if (auctions !== undefined && auctions.length > 0) {
      for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].seller === accounts[0]) {
          setAuction(auctions[i]);
        }
      }
    }
  }, [auctions, accounts]);

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3,
              }}
              variant="h4"
            >
              Your Latest Auction
            </Typography>
            {auction ? (
              <Box>
                <Typography variant="h1" gutterBottom>
                  {displayInGwei(auction.highestBid)} gwei
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="normal"
                  color="text.secondary"
                >
                  Current Highest Bid Amount
                </Typography>
                <Box
                  display="flex"
                  sx={{
                    py: 4,
                  }}
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h3">
                      <a href={`#${auction.auctionContract._address}`}>
                        Go to Auction
                      </a>
                    </Typography>
                    <Typography variant="h4">
                      Title:{auction.pinataMetadata.name}
                    </Typography>
                    <Typography variant="h4">
                      Minimal increment:{displayInGwei(auction.increment)} gwei
                    </Typography>
                    <Typography variant="h4">
                      Duration:{displayInHours(auction.duration)} hours
                    </Typography>
                    <Typography variant="h4">
                      Start time:{auction.startAt}
                    </Typography>
                    <Typography variant="h4">
                      End time:{auction.endAt}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="h3">
                You have not created any auctions yet...
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid
          sx={{
            position: 'relative',
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
            }}
          >
            <Divider absolute orientation="vertical" />
          </Box>
          <NftApprovalCard />
        </Grid>
      </Grid>
    </Card>
  );
}

export default Account;
