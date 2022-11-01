import { Button, Card, Box, Grid, Typography, Divider } from '@mui/material';
import NftApprovalCard from './NftApprovalCard';

function Account() {
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
            <Box>
              <Typography variant="h1" gutterBottom>
                xxxxxx
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
                  <Typography variant="h3">Auction Details</Typography>
                  <Typography variant="h4">Start time:</Typography>
                  <Typography variant="h4">Minimal increment:</Typography>
                  <Typography variant="h4">Duration:</Typography>
                  <Typography variant="h4">End time:</Typography>
                </Box>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid sm item>
                <Button fullWidth variant="outlined">
                  Start Auction
                </Button>
              </Grid>
              <Grid sm item>
                <Button fullWidth variant="contained">
                  End Auction
                </Button>
              </Grid>
            </Grid>
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
