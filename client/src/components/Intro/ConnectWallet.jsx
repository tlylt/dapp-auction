import Button from "@material-ui/core/Button";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const Injected = new InjectedConnector({
  supportedChainIds: [
    1, // Ethereum Mainnet
    0x539, // Dev Network on localhost:8545 via Ganache
  ],
});

// Generate a functional component with a button to enable users to connect to Metamask wallet
const ConnectWallet = () => {
  const { account, chainId, activate, deactivate, active } = useWeb3React();
  return (
    <div>
      {active ? (
        <Button variant="outined" onClick={() => deactivate()}>
          ✅ Account {account.slice(0, 5)}... on chain {chainId}
        </Button>
      ) : (
        <Button variant="contained" onClick={() => activate(Injected)}>
          Connect to Metamask
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
