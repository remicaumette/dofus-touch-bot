const electron = require("electron");
const {BrowserWindow, app} = electron;
const path = require("path");

app.on("ready", () => {
    const window = new BrowserWindow({width: 960, height: 720});
    window.loadURL("file://"+ path.join(__dirname, "..", "..", "dist", "index.html"));
});

app.on("window-all-closed", () => {
    app.quit();
});
