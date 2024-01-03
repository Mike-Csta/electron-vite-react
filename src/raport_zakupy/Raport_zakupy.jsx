import React from "react";
import { useState, useEffect } from "react";
import Bottom from "./components/bottom";
import Top from "./components/Top";
import Rp1_loading_screen from "./components/Rp1_loading_screen";
import { rp1_store } from "./pullstate/rp1_store";
// import Top from "./components/top";
function Raport_zakupy() {
  const isloading = rp1_store.useState((s) => s.isloading);

  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        top: "0",
        left: "0",
        backgroundColor: "#f7f7f7",
      }}
    >
      {isloading && <Rp1_loading_screen />}
      <div
        style={{
          backgroundColor: "red",
          height: 45,
          width: "100%",
        }}
      >
        <Top />
      </div>
      <div
        style={{
          flex: 1,
          width: "100%",

          position: "relative",
        }}
      >
        <Bottom />
      </div>
    </div>
  );
}

export default Raport_zakupy;
