var mongoose = require('mongoose');

var SkillPaternSchema = new mongoose.Schema({
  title: String,
  firstStep: String,
  secondStep: String,
  thirdStep: String,
  fourthStep: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



mongoose.model('SkillPatern', SkillPaternSchema);