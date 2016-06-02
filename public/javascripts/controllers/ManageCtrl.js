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
          var skillImageName = new Date().getTime() / 1000;    
          eleves.create({
            lastname: $scope.lastname,
            firstname: $scope.firstname,
            trombi: skillImageName,
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
              var uploadUrl = "/uploadImageEleve/"+skillImageName;
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
            var imageEleveMod;
            var skillImageName;
            if($scope.imageEleveMod){
                  skillImageName = new Date().getTime() / 1000;  
             }else{
                 skillImageName = $scope.eleveToEdit.trombi;
             }
              eleves.edit({
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                trombi: skillImageName,
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
                      var uploadUrl = "/uploadImageEleve/"+skillImageName;;
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