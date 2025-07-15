const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  
  win.loadURL('http://localhost:3000');

  
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`❌ Electron failed to load: ${errorDescription} (${errorCode})`);
  });

  
}

// Handle Electron app lifecycle
app.whenReady().then(() => {
  createWindow();
  win.center();
win.show();


  app.on('activate', function () {
    
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
