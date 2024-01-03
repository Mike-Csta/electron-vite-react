import React from "react";
import "./rp1_loading_screen.css"; // Zaimportuj plik CSS z animacją i stylami

const Rp1_loading_screen = () => (
  <div className="app-loading-wrap">
    <div>
      <div className="loaders-css__square-spin">
        <div></div>
      </div>
      <div
        style={{
          color: "white",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          letterSpacing: "1px",
          fontSize: "37px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#bbb",
          fontWeight: "bold",
          position: "absolute",
          bottom: "27.1px",
        }}
      >
        DAB
      </div>
    </div>
  </div>
);

export default Rp1_loading_screen;
