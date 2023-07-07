const mongoose = require('mongoose'); // Importe le module mongoose pour la définition du schéma
const uniqueValidator = require('mongoose-unique-validator'); // Importe le module mongoose-unique-validator pour assurer l'unicité de l'e-mail

const userSchema = mongoose.Schema({
  // Définition du schéma de l'utilisateur
  email: { type: String, required: true, unique: true }, // Champ pour stocker l'adresse e-mail de l'utilisateur (requis et unique)
  password: { type: String, required: true }, // Champ pour stocker le mot de passe de l'utilisateur (requis)
});

userSchema.plugin(uniqueValidator); // Applique le plugin uniqueValidator au schéma pour s'assurer que l'e-mail est unique

module.exports = mongoose.model('User', userSchema);
// Exporte le modèle de données pour les utilisateurs créé à partir du schéma,
// avec le nom du modèle ('User') et le schéma correspondant (userSchema).
