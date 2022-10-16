import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import CountdownTimer from "./CountdownTimer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function NFTListingBidModal(props) {
  const { pinataMetadata } = props;
  const { highestBid, setHighestBid } = React.useState(0);
  const { timeTillExpiry, setTimeTillExpiry } = React.useState(0);
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {pinataMetadata.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Highest Bid: {highestBid}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Time Till Expiry:
          <CountdownTimer initialMinute={2} initialSecond={10} />
        </Typography>
        <hr />
        <TextField
          id="modal-bid"
          label="My Bid (GWei)"
          type="number"
          variant="outlined"
        />
        <Button variant="contained">Submit Bid</Button>
      </Box>
    </Modal>
  );
}

export default NFTListingBidModal;
