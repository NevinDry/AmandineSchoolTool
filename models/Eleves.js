var mongoose = require('mongoose');

var EleveSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  trombi: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], 
});



mongoose.model('Eleve', EleveSchema);