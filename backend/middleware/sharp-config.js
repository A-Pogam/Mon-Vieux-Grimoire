const sharp = require('sharp');
const fs = require('fs');

const optimizedImg = async (req, res, next) => {
  try {
    const optimizedImagePath = `${req.file.path}.webp`;

    await sharp(req.file.path)
      .resize({ width: 350, height: 500 })
      .webp({ quality: 80 })
      .toFile(optimizedImagePath);

    fs.unlink(req.file.path, (err) => {
      if (err) {
        return res.status(500).json({ err: 'Impossible de supprimer le fichier' });
      }

      req.file.path = `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`;
      next();
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = optimizedImg;
