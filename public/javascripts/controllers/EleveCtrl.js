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
                    firstStepPhoto: skill._id + new Date().getTime() / 1000,
                    secondStepPhoto: skill.secondStepPhoto,
                    thirdStepPhoto: skill.thirdStepPhoto,
                    fourthStepPhoto: skill.fourthStepPhoto,                    
                   }, skill).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("First STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data.firstStepPhoto;
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
                    secondStepPhoto: skill._id + new Date().getTime() / 1000,
                    thirdStepPhoto: skill.thirdStepPhoto,
                    fourthStepPhoto: skill.fourthStepPhoto,                    
                   }, skill).then(function(skillUp) {
                      console.log("Second STep Uploaded");
                      //Once we added the image name to skill schema, we nee to upload this image
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data.secondStepPhoto;
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
                    thirdStepPhoto: this.skillToShow._id + new Date().getTime() / 1000,
                    fourthStepPhoto: this.skillToShow.fourthStepPhoto,                    
                   }, this.skillToShow).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("Third STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data.thirdStepPhoto;
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
                    fourthStepPhoto: skill._id + new Date().getTime() / 1000,                    
                   }, skill).then(function(skillUp) {
                      //Once we added the image name to skill schema, we nee to upload this image
                      console.log("Fourth STep Uploaded");
                      var uploadUrl = "/uploadImageSkill/"+skillUp.data.fourthStepPhoto;
                      eleves.uploadSkillToServ(imageFourthStep, uploadUrl).then(function() {
                            $scope.fourthFileIsLoaded = false;
                            $scope.skillToShow.fourthStepPhoto = skillUp.data.fourthStepPhoto;
                        });
                   });
            }
        };
        
        
        
        
}]);