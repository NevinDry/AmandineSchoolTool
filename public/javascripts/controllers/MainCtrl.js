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