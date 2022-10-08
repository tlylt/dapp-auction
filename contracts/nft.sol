// SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;
// this contract is used to deploy and acuqire NFT to test the auction functionality
//https://docs.openzeppelin.com/contracts/2.x/api/token/erc721
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintNFTContract is ERC721, Ownable {
    uint256 public mintPrice = 0.001 ether; // price of nft
    uint256 public totalSupply;
    bool public isMintEnabled;

    constructor() payable ERC721("Mint NFT", "MINTNFT") {}

    function toggleIsMintEnabled() external onlyOwner {
        // Owner must enable the mint
        isMintEnabled = !isMintEnabled;
    }

    function mint() external payable {
        require(isMintEnabled, "Minting not enabled");
        require(msg.value == mintPrice, "wrong value");
        totalSupply++;
        uint256 tokenId = totalSupply;
        _safeMint(msg.sender, tokenId); // see doc on line 4
    }
}
