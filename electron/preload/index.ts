function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
    }
  },
};

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  0% { transform: rotateZ(0); }
  100%  { transform: rotateX(200deg); }
}



.${className}::before {
  content:"";
  position: absolute;
  margin-left: -12px;
  animation-fill-mode: both;
  width: 6px;
  border-radius:3px;
  height: 25px;
  background: #bbb;
  animation: square-spin 1s 0.1s ease infinite;
}
.${className}{
  animation-fill-mode: both;
  width: 6px;
  border-radius:3px;
  height: 25px;
  background: #bbb;
  animation: square-spin 1s 0.15s ease infinite;
}

.${className}::after {
  content:"";
  position: absolute;
  margin-left: 12px;
  animation-fill-mode: both;
  width: 6px;
  border-radius:3px;
  height: 25px;
  background: #bbb;
  animation: square-spin 1s 0.1s ease infinite;
}



.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  z-index: 90000;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div><div style="color:white;
  
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  ;  letter-spacing: 1px;font-size:37px;
  left:50%;transform:translateX(-50%);
  color:#bbb;
  font-weight:bold;position:absolute;bottom:30px">DAB</div><div class="${className}"><div></div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
