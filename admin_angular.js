/**
 * Created by ruchi on 1/29/2016.
 */

var app= angular.module('adminApp',[]);
app.controller('adminController',function($scope,$http,$location){
    $scope.succ=false;
    $scope.deleteSucc=false;
    //$scope.updateSucc=false;
    $scope.subjects=[{name:'angular',id:1},{name:'node',id:2},{name:'js',id:3}]
    $scope.quiz=[{type:'Graded'},{type:'Sample'}];
    $scope.selectedQues={};
    $scope.deleteQuiz=function(){
        var data={quiz:$scope.quiz};
        var serializedData = $.param(data);
        $http({
            method: 'POST',
                url: '/deleteQuiz',
                data: serializedData,
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(res){
            $scope.deleteSucc=true;
        })
    }
    $scope.newQuiz= function(){

        var data={quizname:$scope.quizName,subjectid:$scope.subject.id,quiztype:$scope.quizType.type};
        var serializedData = $.param(data);
        $http({
            method: 'POST',
            url: '/createQuiz',
            data: serializedData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(res){
            //console.log('got res');
            window.location.href='/submit_ques?quizid='+res.data.quizid;
        })
    }

    $scope.updateQues=function(){
        $scope.dispQues=true;
        $scope.editContent=false;
        $scope.succ=false;
        $http.get('/getQues?sub='+$scope.quiz.quizid)
            .then(function(resp){
                $scope.questions=resp.data;
                for(var i=0; i< $scope.questions.length;i++){
                    if($scope.questions[i].answer=='op1'){
                       $scope.questions[i].answer=$scope.questions[i].option1;
                    }
                    if($scope.questions[i].answer=='op2'){
                        $scope.questions[i].answer=$scope.questions[i].option2;
                    }
                    if($scope.questions[i].answer=='op3'){
                        $scope.questions[i].answer=$scope.questions[i].option3;
                    }
                    if($scope.questions[i].answer=='op4'){
                        $scope.questions[i].answer=$scope.questions[i].option4;
                    }
                }
            })
    }
    $scope.update=function(ques){
       $scope.dispQues=false;
       $scope.editContent=true;
        $scope.selectedQues=ques;
     //   alert($scope.selectedQues.question);
    }

$scope.submitUpdateQuiz=function(){

    console.log('got here')
    /*sno:String,
        quizid:String,
        question:String,
        option1:String,
        option2:String,
        option3:String,
        option4:String,
        answer:String*/
    if($scope.op1==true){
        $scope.selectedQues.answer='op1';
    }
    if($scope.op2==true){
        $scope.selectedQues.answer='op2';
    }
    if($scope.op3==true){
        $scope.selectedQues.answer='op3';
    }
    if($scope.op4==true){
        $scope.selectedQues.answer='op4';
    }
   /* var data={sno:$scope.selectedQues.sno,question:$scope.selectedQues.question,
        option1:$scope.selectedQues.option1,option2:$scope.selectedQues.option2,option3:$scope.selectedQues.option3,
    option4:$scope.selectedQues.option4,answer: $scope.selectedQues.answer};*/

    var serializedData= $.param($scope.selectedQues);


    $http({
        method:'POST',
        data:serializedData,
        url:'/editQuiz',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
         }).then(function(){
      //  window.location.href='/editQuiz';
        $scope.succ=true;
    })

}

  /*  $scope.enablelQuiz=function(){
        $http.get('/enableQuiz?quizid='+quiz.quizid).then(function(res){
            $scope.quizenabled=true;
        })
    }*/


    $scope.enableQuiz=function(){
        var serializeData= $.param($scope.enablequiz);
        $http({
            method:'POST',
            url:'/enableQuiz',
            data:serializeData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        }).then(function(res){
            $scope.enableSucc=true;
        })
    };

    $scope.disableQuiz=function(){
       alert('called');
        var serializeDisData= $.param($scope.disablequiz);
        $http({
            method:'POST',
            url:'/disableQuiz',
            data:serializeDisData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        }).then(function(res){
            $scope.disableSucc=true;
        })
    }

    $http.get('/quizzes').then(function(res){
        $scope.quizzes=res.data;


    })

    $http.get('/getDisabledQuizzes').then(function(res){
        $scope.disabledQuizzes=res.data;


    })
    $http.get('/getEnabledQuizzes').then(function(res){
        $scope.enabledQuizzes=res.data;


    })


})