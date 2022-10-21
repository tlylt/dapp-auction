import Button from "@material-ui/core/Button";
import CreateAuctionPopup from "./CreateAuctionPopup";
import { useState } from "react";

const CreateAuction = () =>{
  const [popupState, setPopup] = useState(false);
  return (
    <div>
      <Button onClick={()=>setPopup(true)}>
        Create New Auction
      </Button>
      <CreateAuctionPopup trigger={popupState} setTrigger={setPopup}>
        <h3>Create new auction</h3>
      </CreateAuctionPopup>
    </div>
  )
}

export default CreateAuction;