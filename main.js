const { app, BrowserWindow, ipcMain, Tray, Menu, protocol, session, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

let tray = null
let win = null

function showMainWindow() {
  const position = getWindowPosition();
  win.setPosition(position.x, position.y);
  win.show()
  win.focus()

  //This is necessary for the window to appear on windows
  // if (process.platform == "win32") {
  //   this.win.moveTop();
  // }
}

function getWindowPosition() {
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()

  let x = 0;
  let y = 0;

  x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {
    x: x,
    y: y
  }
}
  

function toggleWindowMain() {
  if (!win.isFocused() && win.isVisible()) {
    showMainWindow();
    return;
  }
  if (win.isVisible()) {
    win.hide()
  } else {
    showMainWindow();
  }
}

function toggleMenu() {
  console.log("right click");
  // tray.popUpContextMenu();
}

function createTray() {
  tray = new Tray(path.join(__dirname, '/assets/iconTemplate.png'));
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'About' },
  //   { label: 'Quit', click: () => { app.exit(0) }},
  // ])
  
  // tray.setContextMenu(contextMenu)
  tray.on('click', toggleWindowMain.bind(this));
  tray.on('right-click', toggleMenu.bind(this));
  
}

//Called when Electron is ready
app.on('ready', function () {
  win = new BrowserWindow({
    width: 300,
    height: 450,
    frame: false,
    show: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      plugins: true,
      preload: path.join(__dirname, "preload.js"),
    },
    skipTaskbar: true
  })

  win.loadFile('index.html');
  
  // Show devtools when command clicked
  // if (win.isVisible() && process.defaultApp && metaKey) {
    win.openDevTools({mode: 'detach'})
  // }
  win.setVisibleOnAllWorkspaces(true);

  //When closing Windows
  win.on('closed', () => {
    win = null
  })
  // if (process.platform == "darwin")
      app.dock.hide();
  createTray();  

    win.webContents.on('will-redirect', function (event, newUrl) {
      console.log(newUrl);
        //parse authorization code from request 
      if (newUrl.includes("#access_token")) {
        // console.log("request " + JSON.stringify(req));
        win.webContents.send("fromMain", {'SAVED': 'File Saved'});
        // win.loadFile('index.html')
      } else {
        // did not accept
        app.quit()
      }
      // More complex code to handle tokens goes here
  });
});

ipcMain.handle('load-from-main', async (event, arg) => {
  let data = ""
  // wait for read
  await readFile(path.join(__dirname, '/data/data.json')).then(file => {
    data = JSON.parse(file);
  })
  return data;
});

//When all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})

ipcMain.on('close', () => {
  app.quit()
})

ipcMain.on('loadUrl', (event, arg) => {
    win.loadURL(arg)
    // require('electron').shell.openExternal(arg);

})
