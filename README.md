# DApp - Auction

# Setup Instructions
The project is setup using the Truffle suite for Ethereum, using Ganache to run a local blockchain. The project is also setup using React, and uses the React Truffle box to interact with deployed smart contracts on the Ethereum blockchain from a React web app.

## Install Truffle Suite
1. Install Truffle and Ganache globally
```
npm i -g truffle ganache
```

2. Install [MetaMask chrome extension](https://metamask.io/download/)

3. Setup local Ethereum blockchain on Ganache. Alternatively, download the Desktop app here (will be good for copying private keys to import accounts to MetaMask)

4. Check the port it is running on (7545 if Ganache Desktop or 8545 if Ganache CLI, by default), then edit `truffle-config.js` (`networks/development`) to match the port. If on Ganache Desktop, change the default port to 8545

5. On MetaMask, connect to your local blockchain (localhost:8545). Import an account from Ganache to MetaMask. You can copy the private key from Ganache (`Show Key` in `Accounts` tab in Ganache Desktop) and import it into MetaMask.
   
6. 
Deploy the smart contracts (if any changes) to the local blockchain. You can double check contract is deployed in Ganache Desktop > `Contracts` tab
```
// Ganache CLI
cd truffle
npm i # install the @openzeppelin/contracts npm dependency
truffle migrate --network development
```

5. Start the React web app
```
cd client
npm install
npm start
```


