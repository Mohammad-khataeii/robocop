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

  // Load React dev server
  win.loadURL('http://localhost:3000');

  // Optional: log errors if page fails to load
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`❌ Electron failed to load: ${errorDescription} (${errorCode})`);
  });

  // Optional: open DevTools automatically
  // win.webContents.openDevTools();

  // No need for win.destroy(), Electron handles it
}

// Handle Electron app lifecycle
app.whenReady().then(() => {
  createWindow();
  win.center();
win.show();


  app.on('activate', function () {
    // On macOS, re-create window when dock icon clicked and no windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
