const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({ //Création du shéma qu'on souhaite
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true },

        }
    ],
    averageRating: { type: Number, required: true },
})

module.exports = mongoose.model('book', bookSchema); // exportons ce schéma en tant que modèle Mongoose appelé « Thing », le rendant par là même disponible pour notre application Express