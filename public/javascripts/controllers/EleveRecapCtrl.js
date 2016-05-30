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