const http = require('http'); // Importe le module 'http' de Node.js pour créer un serveur HTTP
const app = require('./app'); // Importe l'application Express à partir du fichier './app.js'

const normalizePort = val => {
  // Fonction pour normaliser le port
  const port = parseInt(val, 10); // Convertit le port en un nombre entier décimal

  if (isNaN(port)) {
    return val; // Retourne le port tel quel s'il n'est pas un nombre
  }
  if (port >= 0) {
    return port; // Retourne le port s'il est un nombre positif ou nul
  }
  return false; // Retourne false si le port est invalide
};

const port = normalizePort(process.env.PORT || '4000'); // Détermine le port sur lequel le serveur écoutera les requêtes, en utilisant le port défini dans la variable d'environnement 'PORT' ou le port 4000 par défaut
app.set('port', port); // Définit le port dans l'application Express

const errorHandler = error => {
  // Fonction pour gérer les erreurs
  if (error.syscall !== 'listen') {
    throw error; // Lance l'erreur si elle ne concerne pas l'écoute du serveur
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur si le serveur nécessite des privilèges élevés pour écouter le port
      process.exit(1); // Quitte le processus Node.js avec le code d'erreur 1
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.'); // Affiche un message d'erreur si le port est déjà utilisé par un autre processus
      process.exit(1); // Quitte le processus Node.js avec le code d'erreur 1
      break;
    default:
      throw error; // Lance l'erreur pour les autres cas d'erreur
  }
};

const server = http.createServer(app); // Crée un serveur HTTP en utilisant l'application Express

server.on('error', errorHandler); // Écoute l'événement 'error' du serveur et appelle la fonction 'errorHandler'

server.on('listening', () => {
  // Événement 'listening' du serveur
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute sur le port spécifié
});

server.listen(port); // Démarre le serveur en écoutant sur le port spécifié
