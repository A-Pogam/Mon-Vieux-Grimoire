const sharp = require('sharp');
const fs = require('fs');

const optimizedImg = async (req, res, next) => {
  try {
    console.log('Chemin du fichier JPEG :', req.file.path); // Message de débogage pour afficher le chemin du fichier JPEG

    const optimizedImagePath = `${req.file.path}.webp`; // Chemin de l'image optimisée en format WebP

    await sharp(req.file.path) // Utilisation de Sharp pour le traitement de l'image
      .resize({ width: 350, height: 500 }) // Redimensionnement de l'image à une largeur de 350 pixels et une hauteur de 500 pixels
      .webp({ quality: 80 }) // Conversion de l'image en format WebP avec une qualité de 80
      .toFile(optimizedImagePath); // Enregistrement de l'image optimisée au chemin spécifié

    fs.unlink(req.file.path, (err) => { // Suppression du fichier JPEG d'origine
      if (err) {
        return res.status(500).json({ err: 'Impossible de supprimer le fichier' });
      }

      req.file.path = `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`; // Mise à jour du chemin de fichier dans la requête avec le chemin de l'image optimisée
      
      next(); // Appel du middleware suivant
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = optimizedImg;
