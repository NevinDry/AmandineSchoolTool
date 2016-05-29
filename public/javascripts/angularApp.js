var app = angular.module('amandine', ['ui.router']);


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	  $stateProvider.state('home', {
              url: '/home',
              templateUrl: '/home.html',
              controller: 'MainCtrl',
            });
        
        $stateProvider.state('eleve', {
              url:'/eleve/{id}',
              templateUrl:'/eleve.html',
              controller:'EleveCtrl',
        });
        
        $stateProvider.state('eleverecap', {
              url:'/eleverecap/{id}',
              templateUrl:'/eleverecap.html',
              controller:'EleveRecapCtrl',
        });
        
       $stateProvider.state('login', {
          url: '/login',
          templateUrl: '/login.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
              $state.go('home');
            }
          }]
        });
       
        $stateProvider.state('register', {
          url: '/register',
          templateUrl: '/register.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
              $state.go('home');
            }
          }]
        });
        
        $stateProvider.state('manage', {
          url: '/manage',
          templateUrl: '/manage.html',
          controller: 'ManageCtrl',
          css: 'public/css/custom.css',
                                              
        });

	  $urlRouterProvider.otherwise('home');
	}
]);

//Directive for uploading image from camera
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//directive to check change on the input file skill (when user decide to add a photo for a step)
app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
      $scope.user = {};

      $scope.register = function(){
        auth.register($scope.user).error(function(error){
          $scope.error = error;
        }).then(function(){
          $state.go('home');
        });
      };

      $scope.logIn = function(){
        auth.logIn($scope.user).error(function(error){
          $scope.error = error;
        }).then(function(){
          $state.go('home');
        });
      };
}])


app.controller('NavCtrl', [
    '$scope',
    'auth',
    '$state',
    function($scope, auth, $state){
      $scope.isLoggedIn = auth.isLoggedIn;
      $scope.currentUser = auth.currentUser;
      $scope.logOut = auth.logOut;
}]);

app.controller('EleveCtrl', [
    '$scope',
    '$stateParams',
    '$timeout',
    'auth',
    'eleves',
    function($scope, $stateParams, $timeout, auth, eleves){
        eleves.get($stateParams.id).then(function(eleve){
            //retrieve the current eleve 
            $scope.eleve = eleve;
            //retrieve all his skills
             eleves.getAllSkill(eleve).then(function(skills){
                 $scope.eleve.skills=skills.data;
                 
                 //setting a default skill
                 $scope.skillToShow = skills.data[0];
             });
        });
        
       
            
        //we check everytime a file input is change to tell the user he can add this image to the server
        $scope.firstFileIsLoaded = false;
        $scope.secondFileIsLoaded = false;
        $scope.thirdFileIsLoaded = false;
        $scope.fourthFileIsLoaded = false;
        
        //When the select value change, we need to update our skilltoshow value to retrieve elements
        $scope.selectSkillToShow = function (){ 
            $scope.skillToShow = this.skillToShow;
        }

          
        $scope.uploadFirstStepPhoto = function (skill){ 
            if($scope.firstStepFileToUpload){

                  var imageFirstStep = $scope.firstStepFileToUpload;
                  eleves.addSkillImage({
                    firstStepPhoto: skill._id + imageFirstStep.name,
                    secondStepPhoto: skill.secondStepPhoto,
                    thirdStepPhoto: skill.thirdStepPhoto,
                    fourthStepPhoto: skill.fourthStepPhoto,                    
                   }, skill).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("First STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data._id;
                      eleves.uploadSkillToServ(imageFirstStep, uploadUrl).then(function() {
                            this.firstFileIsLoaded = false;
                            $scope.skillToShow.firstStepPhoto = skillUp.data.firstStepPhoto;
                      });
                });
            }
        };
        
        $scope.uploadSecondtStepPhoto = function (skill){ 
            if($scope.secondStepFileToUpload){

                  var imageSecondStep = $scope.secondStepFileToUpload;
                
                  eleves.addSkillImage({
                    firstStepPhoto: skill.firstStepPhoto,
                    secondStepPhoto: skill._id + imageSecondStep.name,
                    thirdStepPhoto: skill.thirdStepPhoto,
                    fourthStepPhoto: skill.fourthStepPhoto,                    
                   }, skill).then(function(skillUp) {
                      console.log("Second STep Uploaded");
                      //Once we added the image name to skill schema, we nee to upload this image
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data._id;
                      eleves.uploadSkillToServ(imageSecondStep, uploadUrl).then(function() {
                            $scope.secondFileIsLoaded = false;
                            $scope.skillToShow.secondStepPhoto = skillUp.data.secondStepPhoto;
                      });
                });
            }
        };
        
         $scope.uploadThirdStepPhoto = function (){ 
            if($scope.thirdStepFileToUpload){ 
                  var imageThirdStep = $scope.thirdStepFileToUpload;
                  eleves.addSkillImage({
                    firstStepPhoto: this.skillToShow.firstStepPhoto,
                    secondStepPhoto: this.skillToShow.secondStepPhoto,
                    thirdStepPhoto: this.skillToShow._id + imageThirdStep.name,
                    fourthStepPhoto: this.skillToShow.fourthStepPhoto,                    
                   }, this.skillToShow).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("Third STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data._id;
                      eleves.uploadSkillToServ(imageThirdStep, uploadUrl).then(function() {
                            $scope.thirdFileIsLoaded = false;
                            $scope.skillToShow.thirdStepPhoto = skillUp.data.thirdStepPhoto;
                      });
                });
            }
        };
        
        
         $scope.uploadFourthStepPhoto = function (skill){ 
            if($scope.fourthStepFileToUpload){

                  var imageFourthStep = $scope.fourthStepFileToUpload;
                  eleves.addSkillImage({
                    firstStepPhoto: skill.firstStepPhoto,
                    secondStepPhoto: skill.secondStepPhoto,
                    thirdStepPhoto: skill.thirdStepPhoto,
                    fourthStepPhoto: skill._id + imageFourthStep.name,                    
                   }, skill).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("Fourth STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data._id;
                      eleves.uploadSkillToServ(imageFourthStep, uploadUrl).then(function() {
                            $scope.fourthFileIsLoaded = false;
                            $scope.skillToShow.fourthStepPhoto = skillUp.data.fourthStepPhoto;
                        });
                   });
            }
        };
        
        
        
        
}]);

app.controller('MainCtrl', [
    '$scope',
     '$state',
    'auth',
    'eleves',
    function($scope, $state, auth, eleves){
        
        //Get all data we need to display view
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.user = {eleves: []};            
        eleves.getAll().success(function() {
            $scope.user.eleves = eleves.eleves;
        });
        
        $scope.eleveViewEngine = function(eleve){
            $state.go('eleve',  {id :eleve._id});
        }  
}]);

app.controller('EleveRecapCtrl', [
    '$scope',
    '$stateParams',
    'auth',
    'eleves',
    function($scope, $stateParams, auth, eleves){
        
        $scope.lastEtapeSuccedPhoto = {};
        $scope.lastEtapeSuccedTitle = {};
        
        eleves.get($stateParams.id).then(function(eleve){
            //retrieve the current eleve 
            $scope.eleve = eleve;
            //retrieve all his skills
             eleves.getAllSkill(eleve).then(function(skills){
                 $scope.eleve.skills=skills.data;
                 
                  for(var skill in skills.data) { 
                    var currentSKill = skills.data[skill]; 
                    if(currentSKill.fourthStepPhoto != 'defaut'){
                        $scope.lastEtapeSuccedPhoto[skill] = currentSKill.fourthStepPhoto;
                        $scope.lastEtapeSuccedTitle[skill] = currentSKill.fourthStep;
                    }else if(currentSKill.thirdStepPhoto != 'defaut'){
                        $scope.lastEtapeSuccedPhoto[skill] = currentSKill.thirdStepPhoto;
                        $scope.lastEtapeSuccedTitle[skill] = currentSKill.thirdStep;
                    }else if(currentSKill.secondStepPhoto != 'defaut'){
                        $scope.lastEtapeSuccedPhoto[skill] = currentSKill.secondStepPhoto;
                        $scope.lastEtapeSuccedTitle[skill] = currentSKill.secondStep;
                    }else{
                        $scope.lastEtapeSuccedPhoto[skill] = currentSKill.firstStepPhoto;
                        $scope.lastEtapeSuccedTitle[skill] = currentSKill.firstStep;
                    }    
                }
             });
        });
        
       
   
}]);


app.controller('ManageCtrl', [
'$scope',
'auth',   
'eleves',
'skillpaterns', 
'$state',    
    function($scope, auth, eleves, skillpaterns, $state){
        
        
        //Get all data we need to display view
        $scope.user = {eleves: [], skillpaterns: []};
        $scope.skillpaternCheckBox = {};
            
        eleves.getAll().success(function() {
            $scope.user.eleves = eleves.eleves;
        });

        skillpaterns.getAll().success(function() {
            $scope.user.skillpaterns = skillpaterns.skillpaterns;
        });
        
        
        
        //Manage button clicking to edit/delete
        $scope.showSuprEleve = false;
        $scope.showModEleve = false;
        $scope.showSuprSkillPatern = false;
        $scope.showModSkillPatern = false;
        $scope.isLoggedIn = auth.isLoggedIn;
        
        $scope.trueModEleve = function(eleve){
          $scope.showModEleve = true;
          $scope.eleveToEdit = eleve;
            
          eleves.getAllSkill(eleve).then(function(skills){$scope.eleveToEdit.skills=skills.data});
          $scope.firstname = eleve.firstname;
          $scope.lastname = eleve.lastname;
          $scope.image = eleve.trombi;
        };
        
        $scope.falseModEleve = function(){
          $scope.showModEleve = false;
          $scope.firstname = '';
          $scope.lastname = '';
          $scope.image = '';
        };
        
        $scope.trueModSkillPatern = function(skillpatern){
          $scope.showModSkillPatern = true;
          $scope.skillToEdit = skillpatern;
          $scope.title = skillpatern.title;
          $scope.firstStep = skillpatern.firstStep;
          $scope.secondStep = skillpatern.secondStep;
          $scope.thirdStep = skillpatern.thirdStep;
          $scope.fourthStep = skillpatern.fourthStep;
          $scope.officialTitle = skillpatern.officialTitle;
            
        };
        
        $scope.falseModSkillPatern = function(){
          $scope.showModSkillPatern = false;
          $scope.title =  '';
          $scope.firstStep =  '';
          $scope.secondStep = '';
          $scope.thirdStep =  '';
          $scope.fourthStep =  '';
          $scope.officialTitle =  '';   
        };
        
        
        //Skillpaterns functions create/edit/delete
        $scope.addSkillPatern = function(){
          if(!$scope.title || !$scope.firstStep || !$scope.secondStep || !$scope.thirdStep || !$scope.fourthStep || !$scope.officialTitle) { 
          return; }
          
          skillpaterns.create({
            title: $scope.title,
            firstStep: $scope.firstStep,
            secondStep: $scope.secondStep,
            thirdStep: $scope.thirdStep,
            fourthStep: $scope.fourthStep,
            officialTitle: $scope.officialTitle,  
           }).success(function(skillpatern) {
             $scope.user.skillpaterns = skillpaterns.skillpaterns;
          });
          $scope.title = '';
          $scope.firstStep = '';
          $scope.secondStep = '';
          $scope.thirdStep = '';
          $scope.fourthStep = '';
          $scope.officialTitle =  '';   
        };
        
        $scope.editSkillPatern = function(skillToEdit){
              if(!$scope.title || !$scope.firstStep || !$scope.secondStep || !$scope.thirdStep || !$scope.fourthStep || !$scope.officialTitle) { 
              return; }

              skillpaterns.edit({
                title: $scope.title,
                firstStep: $scope.firstStep,
                secondStep: $scope.secondStep,
                thirdStep: $scope.thirdStep,
                fourthStep: $scope.fourthStep,
                officialTitle: $scope.officialTitle, 
               }, skillToEdit).success(function() {
                 $scope.user.skillpaterns = skillpaterns.skillpaterns;
              });
              $scope.showModSkillPatern = false;
              $scope.title = '';
              $scope.firstStep = '';
              $scope.secondStep = '';
              $scope.thirdStep = '';
              $scope.fourthStep = '';
              $scope.officialTitle =  ''; 
        };
        
        
        $scope.suprSkillPatern = function(skillpatern){
            skillpaterns.delete(skillpatern).success(function(skillpatern) {   
                $scope.user.skillpaterns = skillpaterns.skillpaterns;
            });
        };
        
        
        //Eleves functions create/edit/delete
        
        $scope.eleveViewRecap = function(eleve){
            $state.go('eleverecap',  {id :eleve._id});
        }  
        
        
        $scope.addEleve = function(){
          if(!$scope.lastname || !$scope.firstname || !$scope.imageEleve) { return; }
          //Getting image file (gor the name and then for the upload)  
          var imageEleve = $scope.imageEleve; 
            
          eleves.create({
            lastname: $scope.lastname,
            firstname: $scope.firstname,
            trombi: $scope.imageEleve.name,
           }).success(function() {
              
              //We need to create skills from each selected skillpaterns
              var skillToAddToEleve = angular.fromJson($scope.skillpaternCheckBox);
              for(skillId in skillToAddToEleve)
              {
                    //for each skillpatern selected we recover data and create a new Skill with these data
                    skillpaterns.get(skillId).then(function(skillpatern){
                        var skill = {
                                title: skillpatern.title,
                                firstStep: skillpatern.firstStep,
                                secondStep: skillpatern.secondStep,
                                thirdStep: skillpatern.thirdStep,
                                fourthStep: skillpatern.fourthStep,
                                officialTitle: skillpatern.officialTitle,  
                                                            
                                //setting a defaut image to show
                                firstStepPhoto: 'defaut',
                                secondStepPhoto: 'defaut',
                                thirdStepPhoto: 'defaut',
                                fourthStepPhoto: 'defaut',
                               }
                        //Call CRUD to add a skill to an eleve
                        eleves.createSkill(eleves.eleves[eleves.eleves.length-1], skill).success(function() {
                        });
                     });
              }
              
              //Now we need to upload the image file to the server
              var uploadUrl = "/uploadImageEleve";
              eleves.uploadEleveToServ(imageEleve, uploadUrl);
              
             //Uncheking boxes, update scope eleves 
             $scope.skillpaternCheckBox = [];
             $scope.user.eleves = eleves.eleves;
          });
            

          $scope.firstname = '';
          $scope.lastname = '';
          $scope.image = '';
          
        };
        
        $scope.editEleve = function(eleveToEdit){
              if(!$scope.lastname || !$scope.firstname) { return; }
              
            //checking and managing image 
            var imageEleve;
            if($scope.imageEleve){
                  imageEleve = $scope.imageEleve; 
             }else{
                 imageEleve = $scope.eleveToEdit.trombi;
             }
            console.log("imageeleve"+imageEleve);
              eleves.edit({
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                trombi: imageEleve.name,
               }, eleveToEdit).success(function() {
                  var skillToAddToEleve = angular.fromJson($scope.skillpaternCheckBox);
                  for(skillId in skillToAddToEleve)
                  {
                        skillpaterns.get(skillId).then(function(skillpatern){
                            var skill = {
                                    title: skillpatern.title,
                                    firstStep: skillpatern.firstStep,
                                    secondStep: skillpatern.secondStep,
                                    thirdStep: skillpatern.thirdStep,
                                    fourthStep: skillpatern.fourthStep,
                                    officialTitle: skillpatern.officialTitle,
                                     //setting a defaut image to show
                                    firstStepPhoto: 'defaut',
                                    secondStepPhoto: 'defaut',
                                    thirdStepPhoto: 'defaut',
                                    fourthStepPhoto: 'defaut',
                            }
                            //we create skill for the last added eleve
                            eleves.createSkill(eleves.eleves[eleves.eleves.length-1], skill).success(function() {
                            });
                         });
                  }
                  //If user as selected an image, we need to upload it
                  if($scope.imageEleveMod){
                      var uploadUrl = "/uploadImageEleve";
                      eleves.uploadEleveToServ($scope.imageEleveMod, uploadUrl); 
                  }
                 $scope.user.eleves = eleves.eleves;
                 $scope.skillpaternCheckBox = [];
              });
            

              $scope.showModEleve = false;
              $scope.firstname = '';
              $scope.lastname = '';
              $scope.image = '';
        };

        $scope.suprEleve = function(eleve){
            eleves.delete(eleve).success(function(eleve) {   
                $scope.user.eleves = eleves.eleves;
            });
        };
        
        $scope.deleteSkill = function(eleve, skill){
            eleves.deleteSkill(eleve, skill).then(function(skills){$scope.eleveToEdit.skills=skills.data});
        };
	}
]);

app.factory('skillpaterns', ['$http', 'auth', function($http, auth){
  var s = {
    skillpaterns: []
  };
    
    s.getAll = function() {
      return $http.get('/user/' + auth.getUser() + '/skillpaterns').success(function(data){
          angular.copy(data, s.skillpaterns);
      });
    };
    
    s.get = function(id) {
        return $http.get('/skillpaterns/' + id).then(function(res){
            return res.data;
    });
    };
    
    s.create = function(skillpatern) {
      return $http.post('/user/' + auth.getUser() + '/skillpaterns', skillpatern, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
          angular.copy(data, s.skillpaterns);
      });
    };
    
    s.edit = function(newSkillPatern, skillpatern) {
        return $http.put('/user/' + auth.getUser() + '/skillpaterns/' + skillpatern._id, newSkillPatern, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
          angular.copy(data, s.skillpaterns);
      });
    };  
    
    s.delete = function(skillpatern) {
      return $http.delete('/user/'+ auth.getUser() +'/skillpaterns/' + skillpatern._id).success(function(data){
          angular.copy(data, s.skillpaterns);
      });
    };  
    
  return s;
}]);


app.factory('eleves', ['$http', 'auth', function($http, auth){
  var e = {
    eleves: []
  };
    
    e.getAll = function() {
      return $http.get('/user/' + auth.getUser() + '/eleves').success(function(data){
          angular.copy(data, e.eleves);
      });
    };
    
    e.get = function(id) {
        return $http.get('/eleves/' + id).then(function(res){
             return res.data;
        });
    };
    
    e.getAllSkill = function(eleve) {
      return $http.get('/eleves/' + eleve._id + '/skill').success(function(res){
          return res.data;
      });
    };
    
    e.getSkill = function(skillid) {
      return $http.get('/skills/' + skillid).success(function(res){
          return res.data;
      });
    };
    
    e.create = function(eleve) {
      return $http.post('/user/' + auth.getUser() + '/eleves', eleve, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
            angular.copy(data, e.eleves);
      });
    };
    
    e.createSkill = function(eleve, skill) {
      return $http.post('/user/' + auth.getUser() + '/eleves/' + eleve._id +"/skill", skill, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
            angular.copy(data, e.eleves);
      });
    };
    
    e.addSkillImage = function(newPhotosPaths, skillToEdit) {
        return $http.put('/skills/' + skillToEdit._id, newPhotosPaths, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(res){
          return res.data;    
      });
    };  
    
    
     e.deleteSkill = function(eleve, skill) {
      return $http.delete('/eleves/'+ eleve._id +'/skills/' + skill._id).success(function(res){
          return res.data;
      });
    };  
    
    e.edit = function(newEleve, eleve) {
        return $http.put('/user/' + auth.getUser() + '/eleves/' + eleve._id, newEleve, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
          angular.copy(data, e.eleves);
      });
    };  
    
    e.delete = function(eleve) {
      return $http.delete('/user/'+ auth.getUser() +'/eleves/' + eleve._id).success(function(data){
          angular.copy(data, e.eleves);
      });
    };  
    
    e.uploadEleveToServ = function(file, uploadUrl){
         var fd = new FormData();
         fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log("image uploaded");
        })
        .error(function(){
        });
    }
    
    
    e.uploadSkillToServ = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res){
            return res.data;
        })
    }
    
    
  return e;
}]);



app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};
    
    auth.saveToken = function (token){
      $window.localStorage['amandine-token'] = token;
    };

    auth.getToken = function (){
      return $window.localStorage['amandine-token'];
    }
    
    auth.isLoggedIn = function(){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    
    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.username;
      }
    };
    
    auth.getUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload._id;
      }
    };
    
    auth.register = function(user){
      return $http.post('/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    auth.logIn = function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    auth.logOut = function(){
      $window.localStorage.removeItem('amandine-token');
    };    

  return auth;
}]);


