var stateKey = 'spotify_auth_state';
var errpr = null;
var scopes = 'user-read-private';
var showDialog = true;
var responseType = 'token';

async function initSpotify(key, type) {
  var authorizeURL = window.electron.createAuthorizeURL();
  window.electron.loadUrl(authorizeURL);
}


