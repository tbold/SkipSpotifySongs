
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('path')

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
  tray = new Tray(path.join(__dirname, 'iconTemplate.png'));
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
      nodeIntegration: true,
      plugins: true
    },
    skipTaskbar: true
  })

  win.loadFile('index.html');
  // Show devtools when command clicked
  if (win.isVisible() && process.defaultApp && metaKey) {
    win.openDevTools({mode: 'detach'})
  }
  win.setVisibleOnAllWorkspaces(true);

  //When closing Windows
  win.on('closed', () => {
    win = null
  })
  // if (process.platform == "darwin")
      app.dock.hide();
  createTray();
});

//When all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})