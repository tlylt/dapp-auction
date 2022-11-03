import {
  ListItem,
  styled,
  ListItemAvatar,
  alpha,
  ListItemText,
  Box,
} from '@mui/material';
import { useEth } from '../contexts/EthContext';
import { displayInGwei } from '../utils';
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
    object-fit: contain;
  }
`
);

function AuctionDetails({ auction }) {
  const { pinataMetadata } = auction;
  const {
    state: { accounts },
  } = useEth();
  return (
    <ListItem id={auction.auctionContract._address}>
      <ListItemAvatarWrapper>
        <img alt="img" src={pinataMetadata.image} width={400} height={400} />
      </ListItemAvatarWrapper>
      <Box display="flex" flexDirection="column">
        {accounts[0] === auction.seller && (
          <ListItemText primary={'✨My Auction✨'}></ListItemText>
        )}
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
        <Text>Highest Bid: {displayInGwei(auction.highestBid)} (gwei)</Text>
        <Text>
          Minimal Increment Per Bid: {displayInGwei(auction.increment)} (gwei)
        </Text>
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
