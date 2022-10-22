// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    event ContractCreated(address newContractAddress);

    function createNewAuction(
        IERC721 _nft,
        uint _nftId,
        uint _startingBid,
        uint _increment
    ) public {
        Auction auction = new Auction(
            msg.sender,
            _nft,
            _nftId,
            _startingBid,
            _increment
        );
        auctions.push(auction);
        emit ContractCreated(address(auction));
    }

    function getAuctions() external view returns (Auction[] memory _auctions) {
        _auctions = new Auction[](auctions.length);
        for (uint i = 0; i < auctions.length; i++) {
            _auctions[i] = auctions[i];
        }
    }
}
