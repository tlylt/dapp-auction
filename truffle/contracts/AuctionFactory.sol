// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    event ContractCreated(address newContractAddress)

    function createNewAuction(
        IERC721 _nft,
        uint _nftId,
        uint _startingBid,
        uint _increment
    ) public returns (Auction) {
        Auction auction = new Auction(
            msg.sender,
            _nft,
            _nftId,
            _startingBid,
            _increment
        );
        auctions.push(auction);
        emit ContractCreated(address(auction))
    }
}
