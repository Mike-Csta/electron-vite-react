import React from "react";
import { useState, useEffect } from "react";
import Raport_zakupy from "./raport_zakupy/Raport_zakupy";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          height: 80,
          backgroundColor: "#f6f6f6",
          width: "100%",
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginBottom: 13.5,
            marginLeft: 17,
            fontWeight: "600",
          }}
        >
          Raporty I Aplikacje
        </div>
        <div
          style={{
            marginBottom: 13.5,
            marginLeft: 13,
            fontWeight: "600",
            position: "absolute",
            marginLeft: "50%",
            marginRight: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            backgroundColor: "#e7e7e7",
            padding: "20px 20px 10px 20px",
            borderRadius: 7,
            top: -10,
          }}
        >
          Mikołaj Chlasta
        </div>
        <div
          style={{
            position: "absolute",
            right: 17,
            fontSize: 60,
            top: -10,
            width: 20,
            lineHeight: 0.135,
            color: "#d7d7d7",
          }}
        >
          _ _ _
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#f6f6f6",
          width: "100%",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: "#e7e7e7",
            width: "100%",
            height: "100%",
            marginLeft: 13,
            marginRight: 13,
            marginBottom: 27,
            borderRadius: 5,
            display: "flex",
          }}
        >
          {/* podział na l i p */}
          <div
            style={{
              width: 420,
              backgroundColor: "red",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, width: "100%" }}>Raporty</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "blue" }}></div>
          {/* podział na l i p */}
        </div>
      </div>
    </div>
  );
}

export default App;
