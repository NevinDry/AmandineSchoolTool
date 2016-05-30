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
