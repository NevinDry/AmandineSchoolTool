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
        };
        
        $scope.falseModSkillPatern = function(){
          $scope.showModSkillPatern = false;
          $scope.title =  '';
          $scope.firstStep =  '';
          $scope.secondStep = '';
          $scope.thirdStep =  '';
          $scope.fourthStep =  '';
        };
        
        
        //Skillpaterns functions create/edit/delete
        $scope.addSkillPatern = function(){
          if(!$scope.title || !$scope.firstStep || !$scope.secondStep || !$scope.thirdStep || !$scope.fourthStep) { 
          return; }
          
          skillpaterns.create({
            title: $scope.title,
            firstStep: $scope.firstStep,
            secondStep: $scope.secondStep,
            thirdStep: $scope.thirdStep,
            fourthStep: $scope.fourthStep,
           }).success(function(skillpatern) {
             $scope.user.skillpaterns = skillpaterns.skillpaterns;
          });
          $scope.title = '';
          $scope.firstStep = '';
          $scope.secondStep = '';
          $scope.thirdStep = '';
          $scope.fourthStep = '';
        };
        
        $scope.editSkillPatern = function(skillToEdit){
              if(!$scope.title || !$scope.firstStep || !$scope.secondStep || !$scope.thirdStep || !$scope.fourthStep) {console.log($scope.firstname); 
              return; }

              skillpaterns.edit({
                title: $scope.title,
                firstStep: $scope.firstStep,
                secondStep: $scope.secondStep,
                thirdStep: $scope.thirdStep,
                fourthStep: $scope.fourthStep,
               }, skillToEdit).success(function() {
                 $scope.user.skillpaterns = skillpaterns.skillpaterns;
              });
              $scope.showModSkillPatern = false;
              $scope.title = '';
              $scope.firstStep = '';
              $scope.secondStep = '';
              $scope.thirdStep = '';
              $scope.fourthStep = '';
        };
        
        
        $scope.suprSkillPatern = function(skillpatern){
            skillpaterns.delete(skillpatern).success(function(skillpatern) {   
                $scope.user.skillpaterns = skillpaterns.skillpaterns;
            });
        };
        
        
        //Eleves functions create/edit/delete
        $scope.addEleve = function(){
          if(!$scope.lastname || !$scope.firstname || !$scope.image) {console.log($scope.firstname); return; }
          
          eleves.create({
            lastname: $scope.lastname,
            firstname: $scope.firstname,
            trombi: $scope.image,
           }).success(function(eleve) {
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
                 $scope.user.eleves = eleves.eleves;
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
    
    e.create = function(eleve) {
      return $http.post('/user/' + auth.getUser() + '/eleves', eleve, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
            angular.copy(data, e.eleves);
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


