// const Auction = artifacts.require("Auction");

// module.exports = function (deployer) {
//   deployer.deploy(Auction);
// };

const AuctionFactory = artifacts.require("AuctionFactory");

module.exports = function (deployer) {
  deployer.deploy(AuctionFactory);
};
