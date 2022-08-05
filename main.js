// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol, screen, ipcMain,Notification, desktopCapturer } = require('electron')
const path = require('path')
const url = require('url')

let window_height = 200;
let window_width = 300;
let mainWindow ;
function createWindow() {
  // Create the browser window.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: window_width,
    height: window_height,
    x: width - window_width,
    y: 100,
    alwaysOnTop: true,
    frame: false,
    transparent:true,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}
const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'App started'

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}).then(showNotification)

app.setLoginItemSettings({
  openAtLogin: true    
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})

ipcMain.on('resize', (evt, arg) => {

  window_height=400;
  console.log("asas")
 // window.resizeTo(window_width,window_height);

})

ipcMain.on('notify',(evt, arg)=>{
  showNotification()
})

ipcMain.on('screenShot',(evt, arg)=>{
 mainWindow.minimize();
  desktopCapturer.getSources({ types: ['window', 'screen'],thumbnailSize:{width:1920,height:1080} }).then((s) => {
    let img=s[0].thumbnail.toDataURL();
    mainWindow.webContents.send('sereenCaptured',img);
    mainWindow.restore()
  })
})