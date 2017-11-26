const electron = require("electron");
const {BrowserWindow, app} = electron;
const path = require("path");

app.on("ready", () => {
    const window = new BrowserWindow({width: 960, height: 720});
    window.loadURL("file://" + path.join(__dirname, "..", "..", "build", "index.html"), {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1"
    });
    window.openDevTools({mode: "bottom"});
});

app.on("window-all-closed", () => {
    app.quit();
});
