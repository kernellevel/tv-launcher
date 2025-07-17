const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	runAction: action => ipcRenderer.invoke('run-action', action),
	onConfigChange: callback =>
		ipcRenderer.on('config-changed', (_event, ...args) => callback(...args)),
})
