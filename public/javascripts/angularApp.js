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










