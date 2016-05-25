var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Eleve = mongoose.model('Eleve');
var SkillPatern = mongoose.model('SkillPatern');
var Skill = mongoose.model('Skill');

var jwt = require('express-jwt');
var passport = require('passport');

var auth = jwt({secret: 'pinkfloydC', userProperty: 'payload'});

//
// AUTH ROUTES
//
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


//
// SkILLPATERN ROUTES
//
router.get('/user/:user/skillpaterns', function(req, res, next) {
      SkillPatern.find({user : req.user} ,function(err, skillpaterns) {
            if (err) { return next(err); }
               res.json(skillpaterns);
      });	
});

router.get('/skillpaterns/:skillpatern', function(req, res) {
   res.json(req.skillpatern);
});

router.post('/user/:user/skillpaterns', auth, function(req, res, next) {
   var skillpatern = new SkillPatern(req.body);
   skillpatern.user = req.user;
    
    skillpatern.save(function(err, skillpatern){
    if(err){ return next(err); }

    req.user.skillpaterns.push(skillpatern);
    req.user.save(function(err, post) {
      if(err){ return next(err); }
        SkillPatern.find({user : req.user} ,function(err, skillpaterns) {
            if (err) { return next(err); }
            res.json(skillpaterns);
        });	
    });
  });
});

router.put('/user/:user/skillpaterns/:skillpatern', auth, function(req, res, next) {
    var userC = req.user;
    
    SkillPatern.findById(req.skillpatern._id, function(err, skillpaternToEdit) {
      if (!skillpaternToEdit)
        return next(new Error('skillpatern introuvable'));
      else {
        var title = req.body.title;
        var firstStep = req.body.firstStep;
        var secondStep = req.body.secondStep;
        var thirdStep = req.body.thirdStep;
        var fourthStep = req.body.fourthStep;
        var officialTitle = req.body.officialTitle;   
        skillpaternToEdit.update({ title: title,  officialTitle: officialTitle, firstStep: firstStep, secondStep: secondStep, thirdStep: thirdStep, fourthStep: fourthStep}, function() {
            SkillPatern.find({user : userC} ,function(err, skillpaterns) {
                if (err) { return next(err); }
                res.json(skillpaterns);
            });	
        });  
      }
    });
});

router.delete('/user/:user/skillpaterns/:skillpatern', function(req, res) {
    var userC = req.user;
    SkillPatern.remove({
		_id: req.params.skillpatern
	}, function(err, skillpatern) {
     if (err) { return next(err); }
       
       SkillPatern.find({user : userC} ,function(err, skillpaterns) {
        if (err) { return next(err); }
           res.json(skillpaterns);
       });	
    });
});


router.param('skillpatern', function(req, res, next, id) {

  var query = SkillPatern.findById(id);
    
  query.exec(function (err, skillpatern){
    if (err) { return next(err); }
    if (!skillpatern) { return next(new Error('can\'t find skillpatern')); }

    req.skillpatern = skillpatern;
    return next();
  });
});



//
// ELEVES ROUTES
//
router.get('/user/:user/eleves', function(req, res, next) {
      Eleve.find({user : req.user} ,function(err, eleves) {
            if (err) { return next(err); }
               res.json(eleves);
      });	
});

router.get('/eleves/:eleve', function(req, res) {
   res.json(req.eleve);
});


router.get('/eleves/:eleve/skill', function(req, res, next) {
      Skill.find({eleve : req.eleve} ,function(err, skills) {
            if (err) { return next(err); }
             res.json(skills);
      });	
});


router.post('/user/:user/eleves', auth, function(req, res, next) {
   var eleve = new Eleve(req.body);
   eleve.user = req.user;
    
    eleve.save(function(err, eleve){
    if(err){ return next(err); }

    req.user.eleves.push(eleve);
    req.user.save(function(err, post) {
      if(err){ return next(err); }
        Eleve.find({user : req.user} ,function(err, eleves) {
            if (err) { return next(err); }
            res.json(eleves);
        });	
    });
  });
});

router.post('/user/:user/eleves/:eleve/skill', auth, function(req, res, next) {
   var skill = new Skill(req.body);
   skill.eleve = req.eleve;
    
    skill.save(function(err, skill){
    if(err){ return next(err); }

    req.eleve.skills.push(skill);
    req.eleve.save(function(err, post) {
      if(err){ return next(err); }
        Eleve.find({user : req.user} ,function(err, eleves) {
            if (err) { return next(err); }
            res.json(eleves);
        });	
    });
  });
});


router.put('/user/:user/eleves/:eleve', auth, function(req, res, next) {
    var userC = req.user;
    
    Eleve.findById(req.eleve._id, function(err, eleveToEdit) {
      if (!eleveToEdit)
        return next(new Error('Eleve introuvable'));
      else {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var trombi = req.body.trombi;
        eleveToEdit.update({ firstname: firstname, lastname: lastname, trombi: trombi}, function() {
            Eleve.find({user : userC} ,function(err, eleves) {
                if (err) { return next(err); }
                res.json(eleves);
            });	
        });  
      }
    });
});

router.delete('/eleves/:eleve/skills/:skill', function(req, res) {
    var eleveC = req.eleve;
    Skill.remove({
		_id: req.params.skill
	}, function(err, skill) {
     if (err) { return next(err); }    
       Skill.find({eleve : eleveC} ,function(err, skills) {
        if (err) { return next(err); }
           res.json(skills);
       });	
    });
});




router.param('user', function(req, res, next, id) {

  var query = User.findById(id);
    
  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
});


router.param('eleve', function(req, res, next, id) {

  var query = Eleve.findById(id);
    
  query.exec(function (err, eleve){
    if (err) { return next(err); }
    if (!eleve) { return next(new Error('can\'t find eleve')); }

    req.eleve = eleve;
    return next();
  });
});