const Book = require('../models/book')
const fs = require('fs');

exports.getAllBooks = (req, res, next) => { 
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json(error));
};

//Requête pour récupérer les 3 livres les mieux notés
exports.getBestBook = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3) //Récupère tous les livres, les classes par ordre décroissant, garde les 3 premiers
  .then(books => res.status(200).json( books )) 
  .catch(err => res.status(400).json({ err }))
}

exports.getOneBook =(req, res, next) => { //trouver un livre
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`,
      averageRating: bookObject.ratings[0].grade
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

  exports.modifyBook = (req, res, next) => {  //mofifier un livre
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


  //Requête pour ajouter une note à un livre
exports.rateBook = (req, res, next) => {
  const user = req.body.userId
  Book.findOne({ _id: req.params.id }) 
  .then(book => {
      if (book.ratings.find(rating => rating.userId === user)) { //Contrôle si l'utilisateur à déjà noté le livre
          res.status(401).json({ message: 'Livre déjà noté'})
      } else {
          const newRating = { //Création d'un nouvel objet pour la  nouvelle note
              userId: user,
              grade: req.body.rating,
          }
          const updatedRatings = [ 
              ...book.ratings,
              newRating
          ]
          const calcAverageRating = (ratings) => {
              const sum = ratings.reduce((total, rate) => total + rate.grade, 0) 

              const average = sum / ratings.length //Calcul de la moyenne des notes
              return parseFloat(average.toFixed(2)) //Conversion de la valeur en nombre à virgule
          }
          const updateAverageRating = calcAverageRating(updatedRatings)
          Book.findOneAndUpdate(
              {_id: req.params.id, 'ratings.userId': { $ne: user }}, //Recherche du document à mettre à jour selon les conditions, $ne = not equal
              { $push: { ratings: newRating }, averageRating: updateAverageRating }, //Ajout la nouvelle notation et met à jour la note moyenne
              { new: true } //Retourne le document mis à jour
          )
          .then(updatedBook => res.status(201).json( updatedBook ))
          .catch(err => res.status(401).json({ err }))
      }
  })
  .catch(err => res.status(401).json({ err }))
}



  exports.deleteBook = (req, res, next) => { //supprime un livre
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };  