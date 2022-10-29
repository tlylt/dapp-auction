import './Auction.css';
import Demo from './components/Demo';
import Footer from './components/Footer';
import Intro from './components/Intro/';
import Setup from './components/Setup';
import { EthProvider } from './contexts/EthContext';

import ConnectWallet from './components/Intro/ConnectWallet';
import CreateAuction from './components/Intro/CreateAuction';
import NftApprovalCard from './components/Intro/NftApprovalCard';

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
