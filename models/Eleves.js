var mongoose = require('mongoose');

var EleveSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  trombi: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



mongoose.model('Eleve', EleveSchema);