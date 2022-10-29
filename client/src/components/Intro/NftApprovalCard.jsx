import { Box, Card, CardContent, Typography, Button } from "@material-ui/core";
import React, { useState } from 'react'
import { useEth } from '../../contexts/EthContext';


const NftApprovalCard = (props) =>{
  const { state: { web3, networkID, accounts}} = useEth();
  const nftJson = require('../../contracts/MintNFT.json')
  const [vars, setVars] = useState({
    auctionAddress: "",
    nftId: "" //token id,
  })

  const handleAddressInput = (event) => {
    setVars({
      ...vars, auctionAddress: event.target.value
    })
  }

  const handleNftIdInput = (event) => {
    setVars({
      ...vars, nftId: event.target.value
    })
  }

  const handleApproval = async () =>{
    let nftAddress = nftJson.networks[networkID].address
    let nftContract = new web3.eth.Contract(nftJson.abi, nftAddress)
    const tid = parseInt(vars.nftId)
    await nftContract.methods.approve(vars.auctionAddress, tid).send({from: accounts[0]})
  }

  return (
    <Box width='300px'>
      <Card>
        <CardContent>
          <Typography gutterBottom variant='h4' component='div'>Approve Auction Contract for NFT</Typography>
          <Typography variant="body1">
            Enter the auction contract address and the NFT token id which you want to allow the auction to make changes to.
          </Typography>
          <form className="nft-approval-form">
            <input 
              placeholder="Auction Address"
              name="auctionAddress"
              value={vars.auctionAddress}
              onChange={handleAddressInput}
            />
            <input
              placeholder="NFT token id"
              name="tokenId"
              value={vars.nftId}
              onChange={handleNftIdInput}
            />
          </form>
          <Button onClick={handleApproval}>Set Approve</Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default NftApprovalCard;