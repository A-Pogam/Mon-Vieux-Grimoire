const jwt = require('jsonwebtoken'); // Importe le module jsonwebtoken pour la vérification des tokens JWT

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Extrait le token JWT du header Authorization
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérifie le token en utilisant la clé secrète 'RANDOM_TOKEN_SECRET'
       const userId = decodedToken.userId; // Extrait l'ID de l'utilisateur du token décodé
       req.auth = {
           userId: userId // Ajoute l'ID de l'utilisateur à l'objet req.auth
       };
       next(); // Passe au middleware suivant
   } catch(error) {
       res.status(401).json({ error }); // Renvoie une réponse JSON contenant l'erreur avec le code de statut 401 (Unauthorized)
   }
};
