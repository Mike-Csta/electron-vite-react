import React from "react";
import { useState, useEffect } from "react";
const { ipcRenderer } = require("electron");
import { MdOutlineRefresh } from "react-icons/md";
import { Link } from "react-router-dom";

import {
  rp1_store,
  update_switch1,
  update_switch2,
  update_top_select_target_value,
  update_isloading,
} from "../pullstate/rp1_store.jsx";
import "./top.css";
function Top() {
  const planners = rp1_store.useState((s) => s.planners);
  const top_select_target_value = rp1_store.useState(
    (s) => s.top_select_target_value
  );
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
      setUsername(`${formatUsername(username)}`);
    });
    console.log(username);
  }, []);

  function convertPolishChars(str) {
    const polishCharMap = {
      ą: "a",
      ć: "c",
      ę: "e",
      ł: "l",
      ń: "n",
      ó: "o",
      ś: "s",
      ż: "z",
      ź: "z",
      Ą: "A",
      Ć: "C",
      Ę: "E",
      Ł: "L",
      Ń: "N",
      Ó: "O",
      Ś: "S",
      Ż: "Z",
      Ź: "Z",
    };

    return str
      .split("")
      .map((char) => polishCharMap[char] || char)
      .join("");
  }

  useEffect(() => {
    update_top_select_target_value(convertPolishChars(username));
  }, [username]);

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
          <Link className="top_RIA_logo" to="/App">
            <button
              className="top_RIA_logo2"
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                height: 45,
                width: 60,
                border: "none",
              }}
              onClick={() => {
                update_isloading(true);
              }}
            >
              RIA
            </button>
          </Link>
          <div
            style={{
              backgroundColor: "#eee",
              padding: "10px 15px 15px 5px",
              // borderRadius: "7px",
            }}
          >
            {username} - Zakupy
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
      <select
        style={{
          position: "absolute",
          right: 150,
          top: 0,
          width: 220,
          height: 45,
          outline: "none",
          border: 0,
          backgroundColor: "#ddd",
          color: "#777",
          fontWeight: "600",
          fontSize: "13px",
        }}
        value={top_select_target_value}
        onChange={(e) => update_top_select_target_value(e.target.value)}
      >
        <option value="">Wszyscy Planiści</option>

        <option value={username}>{username}</option>
        {planners.map((planner) => (
          <option key={planner} value={planner}>
            {planner}
          </option>
        ))}
      </select>
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
        onClick={() => {
          update_switch1();
        }}
      >
        Zapisz
      </button>
    </div>
  );
}

export default Top;
