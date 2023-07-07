const mongoose = require('mongoose'); // Importe le module mongoose pour la définition du schéma

const bookSchema = mongoose.Schema({
  // Définition du schéma du livre
  userId: { type: String, required: true }, // Champ pour stocker l'ID de l'utilisateur associé au livre
  title: { type: String, required: true }, // Champ pour stocker le titre du livre
  author: { type: String, required: true }, // Champ pour stocker l'auteur du livre
  imageUrl: { type: String, required: true }, // Champ pour stocker l'URL de l'image du livre
  year: { type: Number, required: true }, // Champ pour stocker l'année de publication du livre
  genre: { type: String, required: true }, // Champ pour stocker le genre du livre
  ratings: [
    // Champ pour stocker les évaluations/note des utilisateurs du livre
    {
      userId: { type: String, required: true }, // Champ pour stocker l'ID de l'utilisateur qui a donné l'évaluation
      grade: { type: Number, required: true }, // Champ pour stocker la note donnée par l'utilisateur
    },
  ],
  averageRating: { type: Number, required: true }, // Champ pour stocker la note moyenne du livre
});

module.exports = mongoose.model('book', bookSchema);
// Exporte le modèle de données pour les livres créé à partir du schéma,
// avec le nom du modèle ('book') et le schéma correspondant (bookSchema).
