const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')

app.disableHardwareAcceleration()

let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		fullscreen: true,
		frame: false,
		kiosk: true,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		},
	})

	mainWindow.loadFile('renderer/index.html')

	const configPath = path.join(__dirname, 'config.json')
	fs.watchFile(configPath, { interval: 1000 }, (curr, prev) => {
		if (mainWindow && !mainWindow.isDestroyed()) {
			console.log('Config file changed, sending reload signal to renderer.')
			mainWindow.webContents.send('config-changed')
		}
	})

	mainWindow.on('closed', () => {
		fs.unwatchFile(configPath)
		mainWindow = null
	})
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

ipcMain.handle('run-action', (event, action) => {
	if (!action) return { success: false, error: 'No action provided' }

	try {
		if (action.startsWith('http')) {
			shell.openExternal(action)
		} else if (action.startsWith('system:')) {
			const command = action.split(':')[1]
			switch (command) {
				case 'sleep':
					exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0')
					break
				case 'shutdown':
					exec('shutdown /s /t 0')
					break
				default:
					throw new Error(`Unknown system command: ${command}`)
			}
		} else {
			shell.openPath(action)
		}
		return { success: true }
	} catch (err) {
		console.error(`Failed to execute action "${action}":`, err)
		return { success: false, error: err.message }
	}
})
