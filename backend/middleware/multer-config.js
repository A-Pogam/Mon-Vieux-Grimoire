const multer = require('multer'); // Importe le module multer pour la gestion des fichiers téléchargés

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // Configuration du stockage des fichiers
  destination: (req, file, callback) => {
    callback(null, 'images'); // Indique le dossier de destination où les fichiers seront enregistrés (dans ce cas, 'images')
  },
  filename: (req, file, callback) => {
    const bookObject = JSON.parse(req.body.book); // Parse les données JSON du livre à partir du corps de la requête
    const title = bookObject.title; // Récupère le titre du livre
    const name = title.split(' ').join('_'); // Remplace les espaces dans le titre par des underscores pour créer un nom de fichier unique
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension du fichier en fonction de son type MIME
    callback(null, name + '_' + Date.now() + extension); // Crée un nom de fichier unique en combinant le titre du livre, la date actuelle et l'extension du fichier
  }
});

module.exports = multer({ storage }).single('image');
// Exporte le middleware multer configuré avec le stockage défini précédemment,
// et spécifie que seule une seule image sera téléchargée dans la requête, avec le champ 'image' comme nom de champ du formulaire.
