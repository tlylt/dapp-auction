import {
  ListItem,
  styled,
  ListItemAvatar,
  alpha,
  ListItemText,
  Box,
  Button,
} from '@mui/material';
import { useState } from 'react';
import NFTListingBidModal from './NFTListingBidModal';
import Text from './Text';

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 5px;
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
  }
`
);

function AuctionDetails({ auction }) {
  const { pinataMetadata } = auction;
  return (
    <ListItem>
      <ListItemAvatarWrapper>
        <img
          alt="img"
          src={pinataMetadata.image}
          width={400}
          height={400}
          objectFit={'contain'}
        />
      </ListItemAvatarWrapper>
      <Box display="flex" flexDirection="column">
        <ListItemText
          primary={`Name: ${pinataMetadata.name}`}
          primaryTypographyProps={{
            variant: 'h5',
            noWrap: true,
          }}
          secondary={`By: ${auction.seller}`}
          secondaryTypographyProps={{
            variant: 'subtitle2',
            noWrap: true,
          }}
        />
        <Text>Description: {pinataMetadata.description}</Text>
        <Text>
          Auction Contract Address: {auction.auctionContract._address}
        </Text>
        <Text>Highest Bid: {auction.highestBid} (Wei)</Text>
        <Text>Minimal Increment Per Bid: {auction.increment} (Wei)</Text>
        <Text>Auction Started: {auction.started ? 'Yes' : 'No'}</Text>
        <Text>Auction Ended: {auction.ended ? 'Yes' : 'No'}</Text>
      </Box>
      <Box>
        <NFTListingBidModal
          pinataMetadata={pinataMetadata}
          auctionData={auction}
        />
      </Box>
    </ListItem>
  );
}

export default AuctionDetails;
