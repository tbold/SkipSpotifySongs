const {ipcRenderer, contextBridge} = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electron',
    {
        sendClose: () => ipcRenderer.send('close'),
        loadData: async (arg) => {
            return await ipcRenderer.invoke('load-from-main', arg);
        },
        createAuthorizeURL: () => ipcRenderer.send('request-spotify-login'),
        getCurrentlyPlaying: async () => {
            return await ipcRenderer.invoke('get-currently-playing');
        },
        storeData: (channel, data) => {
            let validChannels = ["store-data"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                console.log("in receive: " +channel + " " + data);
                ipcRenderer.on(channel, (event, data) => {
                    return data;
                });
            }
        },
        send: (channel, data) => {
            // whitelist channels
            console.log("in sned: " + channel + " " + data)

            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        
    }

);
