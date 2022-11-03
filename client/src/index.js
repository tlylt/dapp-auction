import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "./theme/ThemeProvider";
import { SnackbarProvider } from "notistack";

require("dotenv").config();

function getLibrary(provider) {
  return new Web3Provider(provider);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider>
        <SnackbarProvider maxSnack={3}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
