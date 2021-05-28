const {ipcRenderer, contextBridge} = require('electron')
var SpotifyWebApi = require('spotify-web-api-node');
var stateKey = 'spotify_auth_state';
var scopes = ['user-read-private'];
var showDialog = true;
var responseType = 'token';

var spotifyApi = new SpotifyWebApi({
    clientId: 'aeacbb134c2248859ca39655e8f4bd36',
    state: 'spotify_auth_state',
    redirectUri: 'skip-spotify-songs://test/'});
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electron',
    {
        sendClose: () => ipcRenderer.send('close'),
        loadData: async (arg) => {
            return await ipcRenderer.invoke('load-from-main', arg);
        },
        loadUrl: (arg) => ipcRenderer.send('loadUrl', arg),
        createAuthorizeURL: () => {
            return spotifyApi.createAuthorizeURL(
            scopes,
            stateKey,
            showDialog,
            responseType )},
        receive: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, msg) => {
                    console.log(msg);
                });
            }
        }
    }

);

