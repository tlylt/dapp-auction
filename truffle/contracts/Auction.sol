// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC721 {
    function transfer(address, uint) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract Auction is ReentrancyGuard {
    event Start();
    event End(address highestBidder, uint highestBid);
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);

    address payable public immutable seller;

    bool public started;
    bool public ended;

    uint public startAt;
    uint public duration;
    uint public endAt;
    uint public increment;

    IERC721 public nft; // address of the NFT
    uint public nftId;

    uint public highestBid;
    address public highestBidder;
    mapping(address => uint) public bids;

    constructor () {
        seller = payable(msg.sender);
    }

    function start(IERC721 _nft, uint _nftId, uint startingBid, uint _increment, uint _duration) external {
        require(!started, "Auction already started!");
        require(msg.sender == seller, "You did not start the auction!");
        require(_duration > 0, "Duration must be greater than 0!");
        require(_increment > 0, "Increment must be greater than 0!");
        require(startingBid > 0, "Starting bid must be greater than 0!");
        highestBid = startingBid;

        nft = _nft;
        nftId = _nftId;
        nft.transferFrom(msg.sender, address(this), nftId);

        started = true;
        startAt = block.timestamp;
        increment = _increment;
        duration = _duration;
        endAt = block.timestamp + _duration;

        emit Start();
    }

    function getPrice() public view returns (uint) {
        return highestBid;
    }

    function info() public view returns (address, address, uint, uint, uint, uint, uint, uint, uint, bool, bool) {
        return (
            seller,
            highestBidder,
            startAt,
            duration,
            endAt,
            increment,
            highestBid,
            nftId,
            bids[msg.sender],
            started,
            ended
        );
    }

    function bid() external payable {
        require(started, "Auction not started!");
        require(!ended, "Auction ended!");
        require(block.timestamp < endAt, "Auction ended!");
        require(msg.value >= increment, "Insufficient bid amount increment!");
        require(msg.value + bids[msg.sender] > highestBid, "Bid must be greater than highest bid!");

        // if the highestBidder has been overtaken, keep track of the previous highestBidder so that they can be refunded
        if (highestBidder != address(0)) {
            bids[highestBidder] = highestBid;
        }

        highestBid = msg.value + bids[msg.sender];
        highestBidder = msg.sender;

        emit Bid(highestBidder, highestBid);
    }

    function withdraw() nonReentrant external payable {
        require(started, "Auction not started!");
        require(msg.sender != highestBidder, "Highest bidder cannot withdraw.");
        uint bal = bids[msg.sender];
        require(bal > 0, "No balance to withdraw.");

        bids[msg.sender] = 0; // Ensure all state changes happen before calling external contracts
        (bool sent,) = payable(msg.sender).call{value: bal}("");
        require(sent, "Could not withdraw");

        emit Withdraw(msg.sender, bal);
    }

    function end() nonReentrant external {
        require(started, "You need to start first!");
        require(block.timestamp >= endAt, "Auction is still ongoing!");
        require(!ended, "Auction already ended!");
        ended = true; // Ensure all state changes happen before calling external contracts

        if (highestBidder != address(0)) {
            nft.transfer(highestBidder, nftId);
            (bool sent,) = seller.call{value: highestBid}("");
            require(sent, "Could not pay seller!");
        } else {
            nft.transfer(seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}