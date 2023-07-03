const express = require('express'); //importer express
const mongoose = require('mongoose');

const bookRoutes = require ('./routes/book.routes');

mongoose.connect('mongodb+srv://Idri:jU9kL0qXq6LwwJ7N@cluster0.1rc5ign.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); //appelle/créer app, l'application

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json()); //même chose que bodyParser

app.use('./api/book', bookRoutes);
  
module.exports = app; //exporter pour qu'elle puisse être appelé comme dans le serveur node