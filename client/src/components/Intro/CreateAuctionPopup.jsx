import React, { useState } from 'react'
import Button from "@material-ui/core/Button";
import { useEth } from '../../contexts/EthContext';
import './CreateAuctionPopup.css'

const CreateAuctionPopup = (props) =>{
  const { state: { web3, networkID }} = useEth();
  const auctionJson = require('../../contracts/AuctionFactory.json');
  let auctionFactoryContract;


  const [vars, setVars] = useState({
    nftAddress: "",
    nftId: "",
    startingBid: 0,
    increment: 0,
  })
  const handleAddressInput = (event) => {
    setVars({
      ...vars, nftAddress: event.target.value
    })
  }
  const handleNftIdInput = (event) => {
    setVars({
      ...vars, nftId: event.target.value
    })
  }
  const handleStartingBidInput = (event) => {
    setVars({
      ...vars, startingBid: event.target.value
    })
  }
  const handleIncrementInput = (event) => {
    setVars({
      ...vars, increment: event.target.value
    })
  }

  const handleCreate = async () => {
    let auctionAddress = auctionJson.networks[networkID].address
    auctionFactoryContract = new web3.eth.Contract(auctionJson.abi, auctionAddress)
    console.log(auctionFactoryContract.methods)
    props.setTrigger(false)
  }

  return (props.trigger) ? (
    <div className="auction-popup">
      <div className="inner-auction-popup">
        <Button className="close-btn" onClick={()=>props.setTrigger(false)}>close</Button>
        {props.children}
        <form className="create-auction-form">
          <input
            onChange={handleAddressInput}
            value={vars.nftAddress}
            placeholder="NFT Address"
            name="nftAddress"
            />
          <input
            onChange={handleNftIdInput}
            value={vars.nftId}
            placeholder="NFT Token Id"
            name="nftTokenId"
            />
          <input
            onChange={handleStartingBidInput}
            value={vars.startingBid}
            placeholder="Starting Bid"
            name="startingBid"
            />
          <input
            onChange={handleIncrementInput}
            value={vars.increment}
            placeholder="Increment"
            name="increment"
            />
        </form>
        <Button className="create-auction" onClick={handleCreate}>Create Auction</Button>
      </div>
    </div>
  ) : "";
}

export default CreateAuctionPopup;