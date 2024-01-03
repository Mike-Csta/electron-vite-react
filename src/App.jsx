import React from "react";
import { useState, useEffect } from "react";
import Raport_zakupy from "./raport_zakupy/Raport_zakupy";
import { ipcRenderer } from "electron";
import CtxMenu from "./mui/CtxMenu";
import Test1 from "./test1";
import defaultIcon from "./assets/icons/dfi.ico"; // Ścieżka do domyślnej ikony
import WajperIcon from "./assets/icons/Wajper.ico";
import IFS2003 from "./assets/icons/IFS2003.ico";
import EXCEL from "./assets/icons/EXCEL.ico";
import { Link } from "react-router-dom";

import "./App.css";

function App() {
  const [aplikacje, setAplikacje] = useState([]);
  const [raporty, setRaporty] = useState([]);

  const [filter, setFilter] = useState("installed"); // 'all' lub 'installed'

  // function getIconPath(appName) {
  //   try {
  //     // Próba zaimportowania ikony na podstawie nazwy aplikacji
  //     return require(`./assets/icons/${appName}.ico`).default;
  //   } catch (e) {
  //     // Jeśli import się nie powiedzie (plik nie istnieje), zwróć domyślną ikonę
  //     return defaultIcon;
  //   }
  // }

  function getIconPath(appName) {
    switch (appName) {
      case "Wajper":
        return WajperIcon;
      case "Excel":
        return EXCEL;
      case "IFS 2003":
        return IFS2003;
      // Dodaj więcej przypadków dla innych aplikacji
      default:
        return defaultIcon; // Domyślna ikona, gdy nie ma specyficznej ikony dla aplikacji
    }
  }

  const filteredApps =
    filter === "all" ? aplikacje : aplikacje.filter((app) => app.installed);

  const checkAppsList = async (sciezka, req, res, fx, myapps) => {
    ipcRenderer.send(req, sciezka);

    // Funkcja, która zostanie wywołana po otrzymaniu odpowiedzi
    const handleResponse = (event, installedApps) => {
      fx([
        ...installedApps,
        {
          name: "Excel",
          executablePath:
            "C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE",
          installed: true,
        },
        {
          name: "IFS 2003",
          executablePath: "S:\\Runtime310\\DistributionAndManufacturing.exe",
          installed: true,
        },
      ]);
    };

    // Nasłuchuj odpowiedzi
    ipcRenderer.on(res, handleResponse);

    // Oczyszczenie listenera
    return () => {
      ipcRenderer.removeListener(res, handleResponse);
    };
  };

  useEffect(() => {
    checkAppsList(
      "\\\\192.168.22.114\\dab\\RIARES\\Aplikacje",
      "check-installed-apps",
      "installed-apps-response",
      setAplikacje,
      false
    );

    checkAppsList(
      "\\\\192.168.22.114\\dab\\RIARES\\Raporty",
      "check-installed-apps2",
      "installed-apps-response2",
      setRaporty,
      true
    );
  }, []);

  useEffect(() => {
    console.log(aplikacje, raporty);
  }, [aplikacje, raporty]);

  const launchApp = (appPath, installPath) => {
    ipcRenderer.send("launch-app", appPath, installPath);
  };
  // return <Raport_zakupy />;

  useEffect(() => {
    ipcRenderer.send("request-shortcut-arg");
    ipcRenderer.on("response-shortcut-arg", (event, arg) => {
      console.log("Argument otrzymany z głównego procesu:", arg);
    });
  }, []);

  const test2 = () => {};
  // return <Test1 />;

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
        <button onClick={test2}>test2</button>
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
        <div className="app_container">
          {/* podział na l i p */}
          <div
            style={{
              minWidth: 420,
              // backgroundColor: "red",
              display: "flex",
              flexDirection: "column",
              borderRight: "3px solid #dedede",
            }}
          >
            <div
              style={{
                flex: 1,
                width: "100%",
                padding: 15,
                position: "relative",
              }}
            >
              <Link className="app_raport_elem" to="/Raport_zakupy">
                <div
                  style={{
                    position: "absolute",
                    color: "#bbb",
                    left: 18,
                    top: 7,
                    fontSize: 35,
                  }}
                >
                  |
                </div>
                PZ - Bez faktur Dział zakupów
              </Link>
            </div>
            {/* <div style={{ flex: 1, width: "100%", padding: 15 }}>
              {raporty.map((raport) => (
                <div>
                  <button
                    style={{
                      backgroundColor: "#aaa",
                      border: "none",
                      width: "90%",
                      height: 35,
                    }}
                  >
                    {raport.name}
                  </button>
                  <CtxMenu />
                </div>
              ))}
            </div> */}
          </div>
          <div
            style={{
              flex: 1,
              paddingLeft: 13,
              display: "flex",
              alignItems: "flex-start",
              // justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute" }}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: filter == "installed" ? "#aaa" : "#ccc",
                  fontSize: "12.5px",
                  paddingRight: 7,
                  marginTop: 10,
                  borderRight: "1px solid #ccc",
                }}
                onClick={() => setFilter("installed")}
              >
                Zainstalowane
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: filter == "all" ? "#aaa" : "#ccc",
                  fontSize: "12.5px",
                }}
                onClick={() => setFilter("all")}
              >
                Wszystkie
              </button>
            </div>
            {filteredApps.map((app) =>
              app.installed ? (
                <button
                  className="app_aplication_elem"
                  onClick={() => launchApp(app.executablePath, app.installPath)}
                >
                  <img
                    src={getIconPath(app.name)}
                    alt={app.name}
                    className="app_aplication_elem_img"
                    // Dostosuj rozmiar według potrzeb
                  />
                  <div
                    style={{
                      width: "96%",
                      height: "72%",
                      top: 2,
                      left: 2,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#d8d8d8",
                      position: "absolute",
                      fontSize: 50,
                      color: "white",
                      overflow: "hidden",
                      zIndex: 4,
                    }}
                  >
                    <img
                      src={getIconPath(app.name)}
                      alt={app.name}
                      className="app_aplication_photo"
                    />
                    <img
                      src={getIconPath(app.name)}
                      alt={app.name}
                      style={{
                        width: "22px",
                        height: "22px",
                        left: 5,
                        bottom: 5,
                        filter: "blur(.05px)",

                        position: "absolute",
                      }} // Dostosuj rozmiar według potrzeb
                    />
                    <div style={{ marginTop: 5, zIndex: 4, opacity: 0.2 }}>
                      {app.name[0]}
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#555",
                      fontWeight: "600",
                      fontSize: 16,
                      marginBottom: 4,
                      zIndex: 4,
                    }}
                  >
                    {app.name}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -4,
                      right: -3,
                      zIndex: 5,
                    }}
                  >
                    <CtxMenu
                      ShortcutName={app.executablePath}
                      Name={app.name}
                      args={"--xx-dd--aa--ii"}
                    />
                  </div>
                </button>
              ) : (
                <button
                  className="app_aplication_elem"
                  onClick={() => launchApp(app.executablePath, app.installPath)}
                >
                  <div
                    style={{
                      width: "96%",
                      height: "72%",
                      top: 2,
                      left: 2,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#cfcfcf",
                      position: "absolute",
                      fontSize: 20,
                      color: "#e4e4e4",
                    }}
                  >
                    <img
                      src={getIconPath(app.name)}
                      alt={app.name}
                      style={{
                        width: "22px",
                        height: "22px",
                        left: 5,
                        bottom: 5,
                        filter: "blur(.05px)",

                        position: "absolute",
                      }} // Dostosuj rozmiar według potrzeb
                    />
                    <div style={{ marginTop: 5 }}>{"Zainstaluj"}</div>
                  </div>
                  <div
                    style={{
                      color: "#666",
                      fontWeight: "600",
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {app.name}
                  </div>
                  <div style={{ position: "absolute", bottom: -4, right: -3 }}>
                    <CtxMenu
                      ShortcutName={app.executablePath}
                      Name={app.name}
                    />
                  </div>
                </button>
              )
            )}
          </div>
          {/* podział na l i p */}
        </div>
      </div>
    </div>
  );
}

export default App;
