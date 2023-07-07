const bcrypt = require('bcrypt'); // Importe le module bcrypt pour le chiffrement des mots de passe
const jwt = require('jsonwebtoken'); // Importe le module jsonwebtoken pour la création de tokens JWT

const User = require('../models/user'); // Importe le modèle de données User

exports.signup = (req, res, next) => {
  // Fonction pour l'inscription d'un utilisateur
  bcrypt.hash(req.body.password, 10) // Hash le mot de passe fourni dans la requête avec un coût de hachage de 10
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash // Stocke le mot de passe haché dans la base de données
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Renvoie un message de succès avec le code de statut 201 (Created)
        .catch(error => res.status(400).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 400 (Bad Request)
    })
    .catch(error => res.status(500).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 500 (Internal Server Error)
};

exports.login = (req, res, next) => {
  // Fonction pour la connexion d'un utilisateur
  User.findOne({ email: req.body.email }) // Recherche un utilisateur dans la base de données en fonction de son adresse e-mail
      .then(user => {
          if (!user) {
              // Vérifie si l'utilisateur n'a pas été trouvé dans la base de données
              return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Renvoie une réponse JSON avec un message d'erreur et le code de statut 401 (Unauthorized)
          }
          bcrypt.compare(req.body.password, user.password) // Compare le mot de passe fourni dans la requête avec le mot de passe haché stocké dans la base de données
              .then(valid => {
                  if (!valid) {
                      // Vérifie si les mots de passe ne correspondent pas
                      return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Renvoie une réponse JSON avec un message d'erreur et le code de statut 401 (Unauthorized)
                  }
                  res.status(200).json({
                      userId: user._id, // Renvoie l'ID de l'utilisateur
                      token: jwt.sign(
                          { userId: user._id }, // Crée un token JWT contenant l'ID de l'utilisateur
                          'RANDOM_TOKEN_SECRET', // Clé secrète utilisée pour signer le token (devrait être générée de manière sécurisée)
                          { expiresIn: '4h' } // Durée de validité du token (4 heures dans cet exemple)
                      )
                  });
              })
              .catch(error => res.status(500).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 500 (Internal Server Error)
      })
      .catch(error => res.status(500).json({ error })); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 500 (Internal Server Error)
};
