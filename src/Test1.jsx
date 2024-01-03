import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";

const App = () => {
  const launchApp = (appPath, installPath) => {
    ipcRenderer.send("launch-app", appPath, installPath);
  };

  function createSkrotPulpit(appPath, shortcutName) {
    ipcRenderer.send("create-desktop-shortcut", appPath, shortcutName);
  }

  // Odbieranie wyniku tworzenia skrótu
  ipcRenderer.on("shortcut-creation-result", (event, success) => {
    if (success) {
      console.log("Skrót został pomyślnie utworzony.");
    } else {
      console.error("Nie udało się utworzyć skrótu.");
    }
  });

  return (
    <div>
      <button
        onClick={() =>
          launchApp(
            "C:\\Users\\mikolaj.chlasta\\AppData\\Local\\Programs\\Wajper\\Wajper.exe",
            "\\\\192.168.22.114\\dab\\RIARES\\Wajper"
          )
        }
      >
        Uruchom Aplikację 1
      </button>

      <button
        onClick={() =>
          createSkrotPulpit(
            "C:\\Users\\mikolaj.chlasta\\AppData\\Local\\Programs\\Wajper\\Wajper.exe",
            "WAAAAAJPEEEEER 3000"
          )
        }
      >
        Stwórz skrót na pulpicie
      </button>
    </div>
  );
};

export default App;
