/**
 * Created by ruchi on 1/17/2016.
 */
var app=angular.module('myApp',[]);

app.controller('myController',function($scope,$http,$rootScope){

   $rootScope.correctans=0;
    $scope.submitted=false;
    $scope.timeout=false;
    $scope.showPrev=false;
    $scope.showNext=true;
    $scope.submissions={};
    $scope.mcqSub=false;
    var quesNum=0;

    var url = window.location.href;
    var index=url.indexOf('sub=');
    var sub=url.substr(index+4);

    $http.get('/gradedquizzes').then(function(res){
        $scope.quizzes=res.data;
    })

    $scope.nextQues=function() {
        var url = window.location.href;
        var index=url.indexOf('sub=');
        var sub=url.substr(index+4);
        quesNum++;
       // console.log(quesNum+' '+totalQues);
    if($scope.prev!=true && quesNum!=0){
        $scope.showPrev=true;
    }
    if(quesNum==$scope.totalQues){
        $scope.showNext=false;
    }
    else{
        $scope.showNext=true;
    }
    var check = document.querySelectorAll('input.check');
    var checkvalue = '';
    for (var i = 0; i < check.length; i++) {

        if (check[i].checked == true) {
            checkvalue = (check[i].value);
            check[i].checked = false;
            //console.log($scope.newQues.answer);
            if (checkvalue == $scope.newQues.answer) {

                $rootScope.correctans++;
               localStorage.correctans=$rootScope.correctans;

            }
            $scope.submissions['q'+quesNum]=checkvalue;
            console.log($scope.submissions)
      }

    }

    $http.get('/ques?q='+quesNum+"&sub="+sub)
        .then(function(resp) {
            var responce=resp.data;
            console.log(typeof responce)
            if (responce != null && (typeof responce) != 'string' && responce != '') {
                $scope.newQues = responce;

                //console.log($rootScope.correctans);

            }

            /*else {

              $scope.submitAll();

            }*/
        })


}

    $scope.prevQues= function(){
        var url = window.location.href;
        var index=url.indexOf('sub=');
        var sub=url.substr(index+4);
      quesNum--;
        if(quesNum==0){
            $scope.showPrev=false;
        }
        if(quesNum!=$scope.totalQues){
            $scope.showNext=true;
        }
        $http.get('/ques?q='+quesNum+"&sub="+sub)
            .then(function(resp) {
                var responce=resp.data;
              //  console.log(typeof responce)
                if (responce != null && (typeof responce) != 'string' && responce != '') {
                    $scope.newQues = responce;

                    //console.log($rootScope.correctans);

                }

            })
    }

$scope.submitAll=function(){
   // window.location.href='/submitans';
    quesNum++;
    $scope.submitted=true;
    var check = document.querySelectorAll('input.check');
    var checkvalue = '';
    for (var i = 0; i < check.length; i++) {

        if (check[i].checked == true) {
            checkvalue = (check[i].value);
            check[i].checked = false;
            //console.log($scope.newQues.answer);
            if (checkvalue == $scope.newQues.answer) {

                $rootScope.correctans++;
                localStorage.correctans=$rootScope.correctans;

            }
            $scope.submissions['q'+quesNum]=checkvalue;
            console.log($scope.submissions)
        }

    }
   // console.log('ans submitted');
}

    $scope.calltimeout=function(){
      $scope.timeout=true;
        $scope.submitted=true;
    }

    $scope.viewSubmission=function(){
        $scope.mcqSub=true;
       /* sno:String,
            question:String,
            option1:String,
            option2:String,
            option3:String,
            option4:String,
            answer:String*/
        $http.get('/getQues?sub='+sub).then(function(resp){
         $scope.mcqs=resp.data;
         for(var i=0;i<$scope.mcqs.length;i++){

             $scope.mcqs[i].submission=$scope.submissions['q'+(i+1)];
             if($scope.mcqs[i].answer=='op1'){
                 $scope.mcqs[i].answer=$scope.mcqs[i].option1;
             }
             else if($scope.mcqs[i].answer=='op2'){
                 $scope.mcqs[i].answer=$scope.mcqs[i].option2;
             }
            else if($scope.mcqs[i].answer=='op3'){
                 $scope.mcqs[i].answer=$scope.mcqs[i].option3;
             }
            else if($scope.mcqs[i].answer=='op4'){
                 $scope.mcqs[i].answer=$scope.mcqs[i].option4;
             }
           //same forsubmissions
             if($scope.mcqs[i].submission=='op1'){
                 $scope.mcqs[i].submission=$scope.mcqs[i].option1;
             }
             else if($scope.mcqs[i].submission=='op2'){
                 $scope.mcqs[i].submission=$scope.mcqs[i].option2;
             }
             else if($scope.mcqs[i].submission=='op3'){
                 $scope.mcqs[i].submission=$scope.mcqs[i].option3;
             }
             else if($scope.mcqs[i].submission=='op4'){
                 $scope.mcqs[i].submission=$scope.mcqs[i].option4;
             }

            //check if submission is correct answer or not
             if($scope.mcqs[i].submission==$scope.mcqs[i].answer){
                 console.log('***'+$scope.mcqs[i].submission)
                 $scope.mcqs[i].correct='alert alert-success'
             }
             else if(($scope.mcqs[i].submission!=$scope.mcqs[i].answer)){
                 console.log('$$'+$scope.mcqs[i].submission)
                 $scope.mcqs[i].correct='alert alert-danger'
             }

         }


        })
    }



    //below code is for first question on the screen.


    if(url.indexOf('0')>-1){
        $http.get('/ques?q=0&sub='+sub)
            .then(function(responce){
                $scope.newQues=responce.data;

            })
        $http.get('totalques?sub='+sub)
            .then(function(respp){

                $scope.totalQues=parseInt(respp.data)-1; // since question Number starts with 0.
            },function(err){
                console.log('error:'+err.data);
            })
    }


});

/*app.controller('scoreController',function($scope){
    $scope.correctans=localStorage.correctans;
});*/



