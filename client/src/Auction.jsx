import './Auction.css';
import Demo from './components/Demo';
import AuctionListings from "./components/Demo/AuctionListings";
import Footer from './components/Footer';
import Intro from './components/Intro/';
import ConnectWallet from './components/Intro/ConnectWallet';
import CreateAuction from './components/Intro/CreateAuction';
import NftApprovalCard from './components/Intro/NftApprovalCard';
import Setup from './components/Setup';
import { EthProvider } from './contexts/EthContext';

function Auction() {
  return (
    <EthProvider>
      <div id="Auction">
        <div className="container">
          <div id="ConnectWallet">
            <ConnectWallet />
          </div>
          <div id="AuctionButton">
            <CreateAuction />
          </div>
          <NftApprovalCard></NftApprovalCard>
          <div id="AuctionListings">
            <AuctionListings />
          </div>
          <Intro />
          <hr />
          <Setup />
          <hr />
          <Demo />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default Auction;
