const Book = require('../models/book'); // Importe le modèle de données du livre
const fs = require('fs'); // Importe le module fs (système de fichiers) pour effectuer des opérations sur les fichiers

exports.getAllBooks = (req, res, next) => {
  Book.find() // Recherche tous les livres dans la base de données
    .then(books => res.status(200).json(books)) // Renvoie les livres en tant que réponse JSON avec le code de statut 200 (OK)
    .catch(error => res.status(400).json(error)); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 400 (Bad Request)
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche un livre spécifique dans la base de données en fonction de son ID
    .then(book => res.status(200).json(book)) // Renvoie le livre trouvé en tant que réponse JSON avec le code de statut 200 (OK)
    .catch(error => res.status(404).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 404 (Not Found)
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Parse les données JSON du livre à partir du corps de la requête
  delete bookObject._id; // Supprime la propriété "_id" du livre (si elle existe)
  delete bookObject._userId; // Supprime la propriété "_userId" du livre (si elle existe)

  const book = new Book({
    ...bookObject, // Utilise la syntaxe spread pour copier toutes les propriétés du livre (facilite la manipulation des tableaux, des objets et des chaînes de caractères en fournissant un moyen concis de copier, combiner ou étendre des éléments dans d'autres contextes)
    userId: req.auth.userId, // Associe l'ID de l'utilisateur authentifié à la propriété "userId" du livre
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}.webp`, // Construit l'URL de l'image du livre en utilisant le protocole, l'hôte et le nom de fichier fournis dans la requête
    averageRating: bookObject.ratings[0].grade // Récupère la note moyenne du livre à partir des données du livre
  });

  book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) }) // Renvoie une réponse JSON contenant un message de succès avec le code de statut 201 (Created)
    .catch(error => { res.status(400).json({ error }) }); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 400 (Bad Request)
};

exports.modifyBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) // Met à jour les informations d'un livre spécifique en fonction de son ID en utilisant les données fournies dans le corps de la requête
    .then(() => res.status(200).json({ message: 'Livre modifié !' })) // Renvoie une réponse JSON contenant un message de succès avec le code de statut 200 (OK)
    .catch(error => res.status(400).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 400 (Bad Request)
};

exports.rateBook = (req, res, next) => {
  const user = req.body.userId; // Récupère l'ID de l'utilisateur à partir du corps de la requête

  Book.findOne({ _id: req.params.id }) // Recherche le livre spécifié par son ID
    .then(book => {
      if (book.ratings.find(rating => rating.userId === user)) {
        // Vérifie si l'utilisateur a déjà noté le livre en parcourant les notes existantes
        res.status(401).json({ message: 'Livre déjà noté' }); // Renvoie une réponse JSON avec un message d'erreur et le code de statut 401 (Unauthorized)
      } else {
        const newRating = {
          userId: user, // Associe l'ID de l'utilisateur à la note
          grade: req.body.rating, // Récupère la note à partir du corps de la requête
        }

        const updatedRatings = [
          ...book.ratings, // Copie les notes existantes du livre
          newRating // Ajoute la nouvelle note
        ]

        const calcAverageRating = (ratings) => {
          const sum = ratings.reduce((total, rate) => total + rate.grade, 0); // Calcule la somme des notes

          const average = sum / ratings.length; // Calcule la moyenne des notes
          return parseFloat(average.toFixed(2)); // Convertit la valeur en nombre à virgule avec 2 décimales
        }

        const updateAverageRating = calcAverageRating(updatedRatings); // Calcule la nouvelle note moyenne

        Book.findOneAndUpdate(
          { _id: req.params.id, 'ratings.userId': { $ne: user } }, // Recherche le document à mettre à jour en vérifiant que l'utilisateur n'a pas déjà noté le livre
          { $push: { ratings: newRating }, averageRating: updateAverageRating }, // Ajoute la nouvelle note et met à jour la note moyenne
          { new: true } // Renvoie le document mis à jour
        )
          .then(updatedBook => res.status(201).json(updatedBook)) // Renvoie le livre mis à jour en tant que réponse JSON avec le code de statut 201 (Created)
          .catch(err => res.status(401).json({ err })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 401 (Unauthorized)
      }
    })
    .catch(err => res.status(401).json({ err })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 401 (Unauthorized)
};

exports.getBestBook = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3) // Recherche tous les livres, les classe par ordre décroissant selon la note moyenne et limite les résultats aux 3 premiers
    .then(books => res.status(200).json(books)) // Renvoie les livres en tant que réponse JSON avec le code de statut 200 (OK)
    .catch(err => res.status(400).json({ err })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 400 (Bad Request)
};

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