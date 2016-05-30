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