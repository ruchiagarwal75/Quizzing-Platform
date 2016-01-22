/**
 * Created by ruchi on 1/17/2016.
 */
var app=angular.module('myApp',[]);

app.controller('myController',function($scope,$http,$rootScope){

   $rootScope.correctans=0;
    $scope.submitted=false;
    $scope.timeout=false;
    var quesNum=0;
    $scope.nextQues=function() {

    var check = document.querySelectorAll('input.check');
    var checkvalue = '';
    for (var i = 0; i < check.length; i++) {

        if (check[i].checked == true) {
            checkvalue = (check[i].value);
            check[i].checked = false;
            console.log($scope.newQues.answer);
            if (checkvalue == $scope.newQues.answer) {

                $rootScope.correctans++;
                localStorage.correctans=$rootScope.correctans;

            }
        }

    }
    quesNum++;
    $http.get('/ques?q='+quesNum)
        .then(function(resp) {
            var responce=resp.data;
            console.log(typeof responce)
            if (responce != null && (typeof responce) != 'string' && responce != '') {
                $scope.newQues = responce;

                console.log($rootScope.correctans);

            }
            else {

              $scope.submitAll();

            }
        })
}

$scope.submitAll=function(){
   // window.location.href='/submitans';
    $scope.submitted=true;
    console.log('ans submitted');
}

    $scope.calltimeout=function(){
      $scope.timeout=true;
        $scope.submitted=true;
    }

    var url = window.location.href;
    if(url.indexOf('0')>-1){
        $http.get('/ques?q=0')
            .then(function(responce){
                $scope.newQues=responce.data;

            })
    }


});

/*app.controller('scoreController',function($scope){
    $scope.correctans=localStorage.correctans;
});*/



