/**
 * Created by ruchi on 1/25/2016.
 */

var app1= angular.module('forgotApp',[]);
app1.controller('forgotController',function($scope,$http){
    var user=null;
    $scope.userExist=false;
    $scope.notexist=true;
    $scope.wrongans=true;
    $scope.changepass=false;
    $scope.mismatch=true;
    $scope.updateSucc=false;


    $scope.askQuestion=function(){
     $http.get('/forgotpass?email='+$scope.data.email)
         .then(function(resp){
             user=resp.data;
           if(user=='User Doesnt Exist'){
               $scope.notexist=false;
           }
             else{
               console.log(resp);
               $scope.userExist=true;
               $scope.securityQues=resp.data.securityQues;
           }

         },function(error){

         })
 }

    $scope.verifyUser=function(){
    if($scope.ans.toString().toLowerCase()==user.securityAns.toString().toLowerCase()){
      $scope.changepass=true;
    }
        else{
        $scope.wrongans=false;
    }
    }

    $scope.changePassword=function() {

        if ($scope.data.newpass.toString()) {
            var serializedData = $.param($scope.data);

            if ($scope.data.newpass.toString() == $scope.data.confpass.toString()) {
                console.log('here1')
                $http({
                    method: 'POST',
                    url: '/updatePassword',
                    data: serializedData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (resp) {
                    $scope.updateSucc = true;
                })
            }
            else {
                $scope.mismatch = false;
            }
        }
    }
});