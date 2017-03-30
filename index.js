const electron = require('electron')
const { app, BrowserWindow } = electron
const debug = true

app.on('ready', () => {
    setUpScreens()
})

function setUpScreens() {
    let electronScreen = electron.screen
    let displays = electronScreen.getAllDisplays()
    let externalDisplay = null

    let roulleteWin = null
    let controlWin = null

    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i]
            break
        }
    }

    if (externalDisplay) {
        roulleteWin = new BrowserWindow({
            frame: debug ? true : false,
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            width: 1080,
            height: 720
        })
    } else {
        roulleteWin = new BrowserWindow({
            frame: debug ? true : false,
            width: 1080,
            height: 720
        })
    }

    roulleteWin.loadURL(`file://${__dirname}/html/roullete.html`)
    roulleteWin.setResizable(false)

    if (!debug)
        roulleteWin.setMenu(null)

    if (debug)
        roulleteWin.webContents.openDevTools()

    const ipcMain = electron.ipcMain
    ipcMain.on('roullete-option', function (event, arg) {
        var data = {
            random: (arg === '') ? true : false,
            selected: arg
        };

        roulleteWin.webContents.send('roullete-selection', data)
    });

    controlWin = new BrowserWindow({
        width: 720,
        height: 720
    })
    controlWin.loadURL(`file://${__dirname}/html/controller.html`)
    controlWin.setResizable(false)

    if (!debug)
        controlWin.setMenu(null)

    if (debug)
        controlWin.webContents.openDevTools()

    // Close the whole app
    controlWin.on('closed', function () {
        app.quit()
    })
}