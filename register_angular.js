/**
 * Created by ruchi on 1/25/2016.
 */
var app=angular.module('registerApp',[]);
app.controller('registerController',function($scope,$http){

    $scope.succ=false;
    $scope.error=false;
    $scope.register=function() {
        /* var data={
         name:$scope.name,
         email:$scope.email,
         password:$scope.password,
         securityQues:$scope.securityQues,
         securityAns:$scope.securityAns,
         headers: {'Content-Type': 'application/json'}
         };
         console.log(data);
         var config = {
         headers : {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
         }
         }
         $http.post('/registration',{a:'#######################################3'})
         .then(function(res){
         $scope.succ=true;
         }, function(err){
         $scope.error=true;
         }
         );*/

        var data = $.param({
            json: JSON.stringify({
                name: 'ruchi'
            })
        });
        $http.post("/registration", data).success(function (data, status) {
            console.log(data)
        })
    //}
}
});
