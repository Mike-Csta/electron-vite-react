import React from "react";
import { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { MdOutlineRefresh } from "react-icons/md";
function Top() {
  function formatUsername(username) {
    return username
      .split(".") // dzieli nazwę użytkownika na części
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // zamienia pierwszą literę każdej części na wielką
      .join(" "); // łączy części, używając spacji zamiast kropki
  }
  const [username, setUsername] = useState("");
  useEffect(() => {
    ipcRenderer.send("get-username");
    ipcRenderer.on("send-username", (event, username) => {
      setUsername(`${formatUsername(username)} - Zakupy`);
    });
    console.log(username);
  });

  return (
    <div
      style={{
        width: "100%",
        height: 45,
        backgroundColor: "#e6e6e6",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          fontWeight: "600",
          color: "#646464",
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px 15px",
              // borderRadius: "7px",
            }}
          >
            {username}
          </div>
          <div
            style={{
              padding: "10px 15px",
              borderRadius: "7px",
            }}
          >
            Pozycje magazynowe bez faktur
          </div>
          <div
            style={{
              fontSize: 18,
              position: "absolute",
              right: 95,
              top: 7,
              color: "#ccc",
            }}
          >
            |
          </div>
          <div
            style={{
              padding: "10px 15px 0 0",
              borderRadius: "7px",
              color: "#999",
              left: 20,
            }}
          >
            24.11.2023
          </div>
          <MdOutlineRefresh
            size={17.5}
            style={{
              color: "#bfbfbf",
              top: 13,
              position: "absolute",
              right: -4,
            }}
          />
        </div>
      </div>
      <button
        style={{
          margin: "3px 5px ",
          position: "absolute",
          fontSize: "17px",
          fontWeight: "600",
          color: "#777",
          border: 0,
          right: 0,
          padding: "10px 35px",
          backgroundColor: "#ddd",
        }}
      >
        Zapisz
      </button>
    </div>
  );
}

export default Top;
