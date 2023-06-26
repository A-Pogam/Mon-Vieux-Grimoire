const express = require('express'); //importer express

const app = express(); //appelle/créer app, l'application

//quatre éléments de middleware :
app.use((req, res, next) => { //le premier enregistre « Requête reçue ! » dans la console et passe l'exécution
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => { //le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;
  res.status(201); 
  next();
});

app.use((req, res, next) => { //requête et réponse, renvoyer à la prochaine fonction une exécution du serveur, le troisième envoie la réponse JSON et passe l'exécution ;
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => { // le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console
  console.log('Réponse envoyée avec succès !');
});

module.exports = app; //exporter pour qu'elle puisse être appelé comme dans le serveur node