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


app.controller('MainCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
      
}]);

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
      console.log("NAVCTRL");
      $scope.isLoggedIn = auth.isLoggedIn;
      $scope.currentUser = auth.currentUser;
      $scope.logOut = auth.logOut;
}]);


app.controller('ManageCtrl', [
'$scope',
'auth',   
'eleves',
'skillpaterns',    
    function($scope, auth, eleves, skillpaterns){
        
        
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
          console.log($scope.eleveToEdit);
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
        $scope.addEleve = function(){
          if(!$scope.lastname || !$scope.firstname || !$scope.image) { return; }
          eleves.create({
            lastname: $scope.lastname,
            firstname: $scope.firstname,
            trombi: $scope.image,
           }).success(function() {
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
                               }                 
                        eleves.createSkill(eleves.eleves[eleves.eleves.length-1], skill).success(function() {
                            console.log("youpi");
                        });
                     });
              }
             $scope.skillpaternCheckBox = [];
             $scope.user.eleves = eleves.eleves;
          });
            

          $scope.firstname = '';
          $scope.lastname = '';
          $scope.image = '';
          
        };
        
        $scope.editEleve = function(eleveToEdit){
              if(!$scope.lastname || !$scope.firstname || !$scope.image) { return; }

              eleves.edit({
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                trombi: $scope.image,
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
                                   }                 
                            eleves.createSkill(eleves.eleves[eleves.eleves.length-1], skill).success(function() {
                            });
                         });
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
        });
    };
    
    e.getAllSkill = function(eleve) {
      return $http.get('/eleves/' + eleve._id + '/skill').success(function(res){
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


