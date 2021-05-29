var SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
var stateKey = 'spotify_auth_state';
var scopes = ['user-read-private', 'user-read-currently-playing', 'user-read-playback-state'];
var showDialog = true;
var responseType = 'code';
var spotifyApi = null;

function initSpotify() {
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    state: stateKey,
    redirectUri: 'skip-spotify-songs://test/',
  clientSecret: process.env.CLIENT_SECRET});
}

function createAuthorizeURL() {
  return spotifyApi.createAuthorizeURL(
    scopes,
    stateKey,
    showDialog,
    responseType )
}

async function setCredentials(token) {
  return spotifyApi.authorizationCodeGrant(token).then((data) => {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);
  
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      return true;    
  }).catch(err => {
    console.log('could not authorize: ', err);
    return false;
  });
}

async function getCurrentlyPlaying() {
  return spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
    // console.log('Now playing: ', data);
    return data;
  }, function(err) {
    console.log('Something went wrong!', err);
    return null;
  });
}
// window.electron.receive("fromMain", (data) => {
//   console.log(`Received ${data} from main process`);
// });

module.exports = {
  initSpotify: initSpotify,
  createAuthorizeURL: createAuthorizeURL,
  setCredentials: setCredentials,
  getCurrentlyPlaying: getCurrentlyPlaying
}

