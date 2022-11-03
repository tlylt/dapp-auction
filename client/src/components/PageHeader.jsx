import { Typography, Avatar, Grid, useTheme } from '@mui/material';
import Creation from './Creation';

function PageHeader({ refetchData }) {
  const user = {
    avatar: 'https://avatars.dicebear.com/api/pixel-art-neutral/7.svg',
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(12),
            height: theme.spacing(12),
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          WELCOME
        </Typography>
        <Typography variant="subtitle2">
          Participate in NFT auctions now!
        </Typography>
        <Creation refetchData={refetchData} />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
