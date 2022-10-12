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

## Smart Contract Design

### Auction

### User Flow

1. NFT seller starts an auction
   1. User first deploys the auction contract
   2. User approves the auction contract to transfer his/her NFT from the ERC721 contract
   3. User starts the auction via `start()` function, and supplies:
      1. NFT address
      2. NFT ID
      3. Starting bid
      4. Bid increment limit
      5. Duration of auction
2. User joins the auction
   1. User views the auction details by calling `info()` function
   2. User participate in the auction by calling `bid()` function, and supplies:
      1. Amount to bid
         1. Which must be higher than the starting/existing bid
         2. For the second bid onwards, the amount is treated as a bid increment, and must be higher than the increment limit
   3. User can only withdraw bid amount if he/she is not the highest bidder
3. NFT seller settles the auction
   1. User views the auction details by calling `info()` function
   2. User settles the auction by calling `end()` function
      1. If the auction is not yet ended, the function will revert
      2. If the auction is ended, the function will transfer the NFT to the highest bidder, and transfer the funds to the NFT seller
4. Auction participants who are not the highest bidder can withdraw their bid amount
   1. User views the auction details by calling `info()` function
   2. User withdraws the bid amount by calling `withdraw()` function

### Prevent Reentrancy Attack

What is a reentrancy attack?

> A reentrancy attack occurs when a function makes an external call to another untrusted contract.
> Then the untrusted contract makes a recursive call back to the original function in an attempt to drain funds.
> 

How to prevent reentrancy attack?

> To prevent a reentrancy attack in a Solidity smart contract, you should:
>
> - Ensure all state changes happen before calling external contracts, i.e., update balances or code internally before calling external code
> - se function modifiers that prevent reentrancy

Resources:

- [Hack Solidity: Reentrancy Attack](https://hackernoon.com/hack-solidity-reentrancy-attack)
- [Re-Entrancy Attacks. How to avoid smart contract hacks and loss of funds](https://www.youtube.com/watch?v=6bQvKCKrATM)