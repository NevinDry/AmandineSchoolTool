var mongoose = require('mongoose');

var SkillSchema = new mongoose.Schema({
  title: String,
  officialTitle: String,    
  firstStep: String,
  secondStep: String,
  thirdStep: String,
  fourthStep: String,
  firstStepPhoto: String,
  secondStepPhoto: String, 
  thirdStepPhoto: String,
  fourthStepPhoto: String,
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }
});



mongoose.model('Skill', SkillSchema);