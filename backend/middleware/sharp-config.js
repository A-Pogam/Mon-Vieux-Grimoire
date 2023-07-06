const sharp = require('sharp');
const fs = require('fs');

const optimizedImg = async (req, res, next) => {
    try {


    const optimizedImagePath = req.file.path.replace(/\.[^.]+$/, '') + '.webp'; // Construit le chemin de l'image optimisée en remplaçant l'extension par '.webp'

    await sharp(req.file.path) // Charge l'image à partir du chemin spécifié
      .resize({ width: 350, height: 500 }) // Redimensionne l'image aux dimensions spécifiées
      .webp({ quality: 80 }) // Convertit l'image en format WebP avec une qualité de 80%
      .toFile(optimizedImagePath) // Enregistre l'image optimisée au chemin spécifié
      .then((info) => {
      })
      .catch((err) => {
        throw new Error('Problème de traitement avec Sharp');
      });

    fs.unlink(req.file.path, (err) => { // Supprime le fichier JPEG d'origine
      if (err) {
        return res.status(500).json({ err: 'Impossible de supprimer le fichier' }); // Si une erreur se produit lors de la suppression du fichier, renvoie une réponse d'erreur
      }

      req.file.path = `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`; // Met à jour le chemin du fichier dans la requête pour pointer vers l'image optimisée
      next(); // Passe à la prochaine étape du middleware
    });
  } catch (err) {
    return res.status(500).json({ err }); // Si une erreur se produit lors du traitement de l'image, renvoie une réponse d'erreur
  }
};

module.exports = optimizedImg; // Exporte la fonction middleware pour être utilisée dans d'autres parties de l'application
