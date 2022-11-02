// Contracts
const AuctionFactory = artifacts.require("AuctionFactory")
const Auction = artifacts.require("Auction")

module.exports = async function (callback) {
    try {
        // Fetch accounts from wallet - these are unlocked
        const accounts = await web3.eth.getAccounts()

        // Fetch the deployed auction factory
        const auctionFactory = await AuctionFactory.deployed()
        console.log('AuctionFactory fetched', auctionFactory.address)

        // Fetch all the auctions from auction factory
        // and call end if the auction has started and the current time is greater than the end time (endAt) 
        const auctions = await auctionFactory.getAuctions()
        for (let i = 0; i < auctions.length; i++) {
            const auction = auctions[i]
            console.log('Auction fetched', auction)
            const auctionContract = await Auction.at(auction)
            const auctionDetails = await auctionContract.info()
            const auctionStarted = auctionDetails[9]
            const auctionEnded = auctionDetails[10]
            const auctionEndAt = auctionDetails[4]
            if (auctionStarted && !auctionEnded && auctionEndAt < Date.now()) {
                console.log("Found an auction that has ended")
                console.log("System will now help to close the auction")
                await auctionContract.end({ from: accounts[0] })
            } else {
                console.log("This auction has not ended")
            }
        }
    } catch (error) {
        console.log(error)
    }
    callback()
}