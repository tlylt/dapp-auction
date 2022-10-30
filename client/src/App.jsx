import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auction from "./Auction";
import Landing from "./Landing";

function App() {
  return (
    <div id="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/auction" element={<Auction />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
