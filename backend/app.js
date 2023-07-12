const express = require('express'); // Importe le module Express
const mongoose = require('mongoose'); // Importe le module Mongoose pour interagir avec MongoDB
const bookRoutes = require('./routes/book.routes'); // Importe les routes liées aux livres
const userRoutes = require('./routes/user.routes'); // Importe les routes liées aux utilisateurs
const path = require('path'); // Importe le module path pour gérer les chemins de fichiers

mongoose.connect('mongodb+srv://Idri:jU9kL0qXq6LwwJ7N@cluster0.1rc5ign.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, // indique à Mongoose d'utiliser le nouveau moteur d'analyse de l'URL pour l'analyse de l'URL de connexion
    useUnifiedTopology: true }) // active la nouvelle infrastructure de surveillance des serveurs de MongoDB, qui est recommandée pour une utilisation en production.
  .then(() => console.log('Connexion à MongoDB réussie !')) // Affiche un message de succès si la connexion à MongoDB est établie avec succès
  .catch(() => console.log('Connexion à MongoDB échouée !')); // Affiche un message d'erreur si la connexion à MongoDB échoue

const app = express(); // Crée une instance de l'application Express

app.use((req, res, next) => {
  // Définit les en-têtes CORS pour autoriser les requêtes provenant de différentes origines HTTP
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json()); // Utilise le middleware express.json() pour analyser les corps de requête JSON/même chose que bodyParser

app.use('/api/books', bookRoutes); // Utilise les routes liées aux livres pour les URL commençant par "/api/books"
app.use('/api/auth', userRoutes); // Utilise les routes liées aux utilisateurs pour les URL commençant par "/api/auth"
app.use('/images', express.static(path.join(__dirname, 'images'))); // Définit un répertoire statique pour servir les fichiers d'images

module.exports = app; // Exporte l'application Express pour qu'elle puisse être utilisée par d'autres modules (comme dans le serveur Node.js)
