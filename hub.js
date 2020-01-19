var STORAGE_KEY = 'burner-hub-wallets';
var wallets = [];

var connectedFrame = null;

if (window.parent == window) {
  window.location.replace('https://demo.' + window.location.hostname);
}

function loadWallets() {
  wallets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return wallets;
}

function getWallet(origin) {
  for (var i in wallets) {
    var wallet = wallets[i];
    if (wallet.origin === origin) {
      return wallet;
    }
  }
  return null;
}

var callbacks = {
  registerWallet: function(event, reply) {
    var origin = event.origin;

    loadWallets();
    if (getWallet(origin)) {
      console.log('Already registered', wallet.origin);
      return reply();
    }

    wallets.push({ origin: origin, name: event.data.name });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    reply();
  },

  getWallets: function(event, reply) {
    var _wallets = loadWallets();
    reply(_wallets);
  },
};

function receiveMessage(event) {
  if (callbacks[event.data.command]) {
    function reply(response) {
      event.source.postMessage({
        response: response,
        id: event.data.id
      }, event.origin);
    }
    callbacks[event.data.command](event, reply);
  } else {
    console.error('Unknown command', event.data.command);
  }
}

window.addEventListener('message', receiveMessage, false);
