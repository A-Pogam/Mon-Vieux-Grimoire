const express = require('express'); // Importe le module express pour la création du routeur
const router = express.Router(); // Crée un routeur Express

const auth = require('../middleware/auth'); // Importe le middleware d'authentification
const mutler = require('../middleware/multer-config'); // Importe le middleware de configuration Multer pour la gestion des fichiers
const sharp = require('../middleware/sharp-config'); // Importe le middleware de configuration Sharp pour le redimensionnement des images
const bookCtrl = require('../controllers/book.controllers'); // Importe le contrôleur des livres

router.get('/', bookCtrl.getAllBooks); // Définit la route GET '/' qui appelle la fonction getAllBooks du contrôleur des livres
router.get('/bestrating', bookCtrl.getBestBook); 
router.get('/:id', bookCtrl.getOneBook); 
router.post('/:id/rating', auth, bookCtrl.rateBook); 
router.post('/', auth, mutler, sharp, bookCtrl.createBook); // Définit la route POST '/' qui appelle la fonction createBook du contrôleur des livres avec l'authentification et la gestion des fichiers Multer requises, et le redimensionnement des images Sharp
router.put('/:id', auth, mutler, bookCtrl.modifyBook); // Définit la route PUT '/:id' qui appelle la fonction modifyBook du contrôleur des livres avec l'authentification et la gestion des fichiers Multer requises
router.delete('/:id', auth, bookCtrl.deleteBook); 

module.exports = router; // Exporte le routeur pour qu'il puisse être utilisé par d'autres modules (comme dans le fichier principal de l'application)
