const express = require('express'); // Importe le module express pour la création du routeur
const router = express.Router(); // Crée un routeur Express

const userCtrl = require('../controllers/user.controllers'); // Importe le contrôleur des utilisateurs

router.post('/signup', userCtrl.signup); // Définit la route POST '/signup' qui appelle la fonction signup du contrôleur des utilisateurs
router.post('/login', userCtrl.login); // Définit la route POST '/login' qui appelle la fonction login du contrôleur des utilisateurs

module.exports = router; // Exporte le routeur pour qu'il puisse être utilisé par d'autres modules (comme dans le fichier principal de l'application)
