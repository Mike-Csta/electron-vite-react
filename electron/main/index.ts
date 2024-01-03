import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";
const os = require("os");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const lockFileDir = "/tmp/app-lock-"; // Katalog dla plików blokady

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

if (release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

ipcMain.on("get-username", (event) => {
  event.reply("send-username", os.userInfo().username);
});

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const args = process.argv.slice(2);
  const shortcutArg = args[0];

  if (url) {
    win.loadURL(url);
    if (!app.isPackaged) {
      win.webContents.openDevTools();
    }
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    win?.webContents.send("shortcut-arg", shortcutArg);
  });

  ipcMain.on("request-shortcut-arg", (event) => {
    event.reply("response-shortcut-arg", shortcutArg);
  });
  app.setName("UnikalnaNazwaAplikacji");
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  update(win);
}

// ipcMain.on(
//   "create-custom-shortcut",
//   (event, appPath, shortcutName, iconPath, additionalArgs = "") => {
//     const shortcutPath = path.join(
//       app.getPath("desktop"),
//       `${shortcutName}.lnk`
//     );
//     const args = `--no-sandbox ${additionalArgs}`; // Dodanie --no-sandbox do argumentów

//     const shortcutOptions = {
//       target: appPath,
//       args: args,
//       icon: iconPath, // Dodaj ścieżkę do ikony
//       description: shortcutName, // Możesz też dodać opis
//     };

//     if (shell.writeShortcutLink(shortcutPath, "create", shortcutOptions)) {
//       event.reply("custom-shortcut-creation-result", true);
//     } else {
//       event.reply("custom-shortcut-creation-result", false);
//     }
//   }
// );

const activeProcesses = new Map();

ipcMain.on("launch-app", (event, installerFolderPath) => {
  const appPath = process.argv.slice(2)[0] || "App";

  if (activeProcesses.has(appPath)) {
    console.log(`Aplikacja ${appPath} jest już uruchomiona.`);
    return;
  }

  if (!fs.existsSync(appPath)) {
    console.log(`Plik ${appPath} nie istnieje. Uruchamiam instalator.`);
    const installerFiles = fs
      .readdirSync(installerFolderPath)
      .filter((file) => file.endsWith(".exe"));
    if (installerFiles.length === 0) {
      console.error(
        `Nie znaleziono pliku instalacyjnego w folderze ${installerFolderPath}`
      );
      return;
    }

    const installerPath = `${installerFolderPath}/${installerFiles[0]}`;
    spawn(installerPath, [], { detached: true, stdio: "ignore" }).unref();
    return;
  }

  const child = spawn(appPath, [], {
    detached: true,
    env: {},
    stdio: "ignore",
  });

  activeProcesses.set(appPath, child);
  child.unref();
  child.on("error", (error) => {
    console.error(`Błąd uruchomienia aplikacji: ${error}`);
    activeProcesses.delete(appPath);
  });

  child.on("close", (code) => {
    console.log(`Proces zakończony z kodem: ${code}`);
    activeProcesses.delete(appPath);
  });
});

// Funkcja do sprawdzania zainstalowanych aplikacji
function checkInstalledApps(networkFolderPath, localFolderPath) {
  const getDirectories = (srcPath) => {
    return fs
      .readdirSync(srcPath)
      .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory());
  };

  const networkFolders = getDirectories(networkFolderPath);
  const localFolders = getDirectories(localFolderPath);

  const result = networkFolders.map((folder) => {
    const executablePath = path.join(localFolderPath, folder, `${folder}.exe`);
    const installPath = path.join(networkFolderPath, folder);

    const isInstalled = fs.existsSync(executablePath);

    return {
      name: folder,
      installed: isInstalled,
      executablePath: executablePath,
      installPath: installPath,
    };
  });

  return result;
}

// Nasłuchiwanie zdarzeń IPC
ipcMain.on("check-installed-apps", (event, networkFolderPath) => {
  const localFolderPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Programs`;
  const installedApps = checkInstalledApps(networkFolderPath, localFolderPath);
  event.reply("installed-apps-response", installedApps);
});

ipcMain.on("check-installed-apps2", (event, networkFolderPath) => {
  const localFolderPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Programs`;
  const installedApps = checkInstalledApps(networkFolderPath, localFolderPath);
  event.reply("installed-apps-response2", installedApps);
});

ipcMain.on(
  "create-desktop-shortcut",
  (event, appPath, shortcutName, args = "") => {
    const shortcutPath = path.join(
      app.getPath("desktop"),
      `${shortcutName}.lnk`
    );

    const shortcutOptions = {
      target: appPath,
      args: args,
    };

    if (shell.writeShortcutLink(shortcutPath, "create", shortcutOptions)) {
      event.reply("shortcut-creation-result", true);
    } else {
      event.reply("shortcut-creation-result", false);
    }
  }
);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
