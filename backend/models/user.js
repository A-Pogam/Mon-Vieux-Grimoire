const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // S'assurer qu'on ne peut pas utliser 2X la même adresse e-mail

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique : true },
  password: { type: String, required: true }, 
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);