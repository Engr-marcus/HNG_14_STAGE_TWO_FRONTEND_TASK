import React from "react";
import ReactDOM from "react-dom/client";
import { InvoiceProvider } from "./context/InvoiceContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./app/App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </ThemeProvider>
  </React.StrictMode>
);