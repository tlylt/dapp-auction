import "./App.css";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import { EthProvider } from "./contexts/EthContext";

import ConnectWallet from "./components/Intro/ConnectWallet";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <div id="ConnectWallet">
            <ConnectWallet />
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

export default App;
