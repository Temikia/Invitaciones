import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/invitation.css";

if (window.location.pathname.replace(/\/$/, "") === "/recuerdos" && new URLSearchParams(window.location.search).get("album") === "1") {
  window.history.replaceState(null, "", `/album${window.location.hash}`);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
