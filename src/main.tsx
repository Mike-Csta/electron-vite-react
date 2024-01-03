import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./samples/node-api";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom"; // Import HashRouter
import Raport_zakupy from "./raport_zakupy/Raport_zakupy";

const rootElement = document.getElementById("root") as Element;
let zmienna1 = "_App1";
const componentMap = {
  _App1: App,
  RaportZakupy1: Raport_zakupy,
  // możesz dodać więcej mapowań tutaj
};
const DynamicComponent = componentMap[zmienna1] || App; // Domyślnie App, jeśli nie znaleziono mapowania

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<DynamicComponent />} />
        <Route path="/App" element={<App />} />
        <Route path="/Raport_zakupy" element={<Raport_zakupy />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
