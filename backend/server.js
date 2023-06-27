// Importer le module 'http' de Node.js
const http = require('http');
// Importer le module 'app' du fichier './app.js'
const app = require('./app');

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Déterminer le port sur lequel le serveur écoutera les requêtes
const port = normalizePort(process.env.PORT || '4000');
// Définir le port dans l'application
app.set('port', port);

// Fonction pour gérer les erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Créer un serveur HTTP avec l'application
const server = http.createServer(app);

// Écouter l'événement 'error' du serveur et appeler la fonction 'errorHandler'
server.on('error', errorHandler);

// Écouter l'événement 'listening' du serveur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Démarrer le serveur en écoutant sur le port spécifié
server.listen(port);
