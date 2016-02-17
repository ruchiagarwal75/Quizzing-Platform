/**
 * Created by ruchi on 1/5/2016.
 */
var express= require('express');
var app=express();
var request=require('request');
var url=require('url');
var mongoose=require('mongoose');
var sessions= require('client-sessions');
var bcrypt=require('bcryptjs');
app.use(sessions({
    cookieName:'session',
    secret:'hjgwdjhnasbch2r4rcu7867hbgujgqyu287863vxqv'
}));
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/test');

var qnum=1;
var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    securityQues:String,
    securityAns:String,
    userType:String

});
var users = mongoose.model('users', userSchema);


var quesSchema = new mongoose.Schema({
    sno:String,
    quizid:String,
    question:String,
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    answer:String
});
var ques = mongoose.model('mcqs', quesSchema);

var quizSchema = new mongoose.Schema({
    quizid:Number,
    quizname:String,
    subjectid:Number,
    quiztype:String,
    enabled:Boolean


});

var quiz = mongoose.model('quizzes', quizSchema);

app.get('/',function(req,res){
   res.redirect('/login')
});
app.get('/candidateNav.html',function(req,res){
    res.sendfile('candidateNav.html')
});
app.get('/login',function(req,res){
    if(req.session){
        req.session.reset();
    }
    res.sendfile('loginform.html');
});
app.post('/login',function(req,res){

        users.findOne({email: req.body.email}, function (err, users) {

            if (users) {
          if(bcrypt.compareSync(req.body.password,users.password))
                //  res.write(err);
                req.session.users = users;
               if(users.userType=='candidate'){
                   res.redirect('/dashboard');
               }
                else{
                   res.redirect('/adminDashboard');
               }

            }
            else {
                res.redirect('/login?Login=failed');

            }
        })


});
app.get('/adminDashboard',function(req,res){   // all admin code
    if(req.session && req.session.users){
        res.sendfile('adminDashboard.html');
    }
    else{
        console.log('session doesnot exist');
        req.session.reset();
        res.redirect('/login');
    }

});

app.get('/createQuiz',function(req,res){
    res.sendfile('createQuiz.html');
});


app.post('/createQuiz',function(req,res){
    var quizNum='0';
    quiz.count({}, function (err, resp) {
        if (resp) {
            //  res.write(err);
            quizNum=resp;
        }
        console.log('ans :: '+JSON.stringify(req.body));
        var newquiz = new quiz({
            quizid:quizNum,
            quizname:req.body.quizname,
            subjectid:req.body.subjectid,
            quiztype:req.body.quiztype,
            enabled:false
        });

        newquiz.save(function(err, newquiz) {

            if (newquiz) {
                //console.log(newquiz);
            //   res.redirect('/submit_ques');
                res.send(newquiz);
            }

            else{

                res.redirect('/adminDashboard');
            }
        });


   });



});

app.get('/deleteQuiz',function(req,res){
    res.sendfile('delete_quiz.html');
});

app.post('/deleteQuiz',function(req,res){
   quiz.remove({quizname:req.body.quiz.quizname},function(err,resp){
       ques.remove({quizid:req.body.quiz.quizid},function(error,response){
           res.send('succ')
       });

   });

});

app.get('/editQuiz',function(req,res){
    res.sendfile('edit_quiz.html');
});


app.post('/editQuiz',function(req,res){

    ques.remove({quizid:req.body.quizid,sno:req.body.sno},function(error,response){
        var newques = new ques({
            sno:req.body.sno,
            quizid:req.body.quizid,
            question:req.body.question,
            option1:req.body.option1,
            option2:req.body.option2,
            option3:req.body.option3,
            option4:req.body.option4,
            answer:req.body.answer

        });

        newques.save(function(err, newques) {

            if (newques) {
                res.send('succ');
                console.log('updated')
            }


        });

    });

});

app.get('/enableQuiz',function(req,res){
    res.sendfile('enable_quiz.html');
});

app.post('/enableQuiz',function(req,res){
    console.log(req.body);
    quiz.where('quizid', req.body.quizid).update({enabled:true}, function (err, count) {
        if(count){
            console.log(count);
            res.send('Successfull');
        }
    });
});

app.get('/disableQuiz',function(req,res){
    res.sendfile('disable_quiz.html');
});

app.post('/disableQuiz',function(req,res){
    console.log(req.body);
    quiz.where('quizid', req.body.quizid).update({enabled:false}, function (err, count) {
        if(count){
            console.log(count);
            res.send('Successfull');
        }
    });
});


app.get('/scheduleQuiz',function(req,res){
    res.sendfile('schedule_quiz.html');
});

app.post('/scheduleQuiz',function(req,res){
    console.log(req.body);
    quiz.where('quizid', req.body.quizid).update({enabled:false}, function (err, count) {
        if(count){
           //enter quizid, startdate, enddate in a db
        }
    });
});

app.get('/admin_angular.js',function(req,res){
    res.sendfile('admin_angular.js');
});


app.get('/dashboard',function(req,res){
    if(req.session && req.session.users){
        res.sendfile('dashboard.html');
    }
    else{
        console.log('session doesnot exist');
        req.session.reset();
        res.redirect('/login');
    }

});
app.get('/logout',function(req,res){
 //   req.session=null
    req.session.reset();
    console.log(req.session);
    res.redirect('/login');
});
app.get('/totalques',function(req,res){
    var url=require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    ques.count({quizid:query.sub}, function (err, resp) {
        if (resp) {
            //  res.write(err);
         //   console.log('total ques:'+resp);
            res.send(JSON.stringify(resp));
        }

    })
});


app.get('/quizzes',function(req,res){
    quiz.find({},function(err,resp){
        res.send(resp);
    });
});

app.get('/getDisabledQuizzes',function(req,res){
    quiz.find({enabled:false},function(err,resp){
        res.send(resp);
    });
});
app.get('/getEnabledQuizzes',function(req,res){
    quiz.find({enabled:true},function(err,resp){
        res.send(resp);
    });
});

app.get('/gradedquizzes',function(req,res){
   quiz.find({enabled:true,quiztype:'Graded'},function(err,resp){
       res.send(resp);
   });
});

app.get('/submit_ques',function(req,res){
    res.sendfile('submit_ques.html');
});
app.post('/submit_ques',function(req,res) {

    var quesNum='0';
    var url=require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    ques.count({quizid:query.quizid}, function (err, resp) {

        if (resp) {
            //  res.write(err);
            quesNum=resp;
        }

        var newques = new ques({
            sno:quesNum,
            quizid:query.quizid,
            question:req.body.ques,
            option1:req.body.op1,
            option2:req.body.op2,
            option3:req.body.op3,
            option4:req.body.op4,
            answer:req.body.ans

        });

        newques.save(function(err, newques) {

            if (err) {
                res.redirect('/submit_ques?submit=fail');
            }

            else{

                res.redirect('/submit_ques?submit=succ&quizid='+query.quizid);
            }
        });


    });


} );

app.get('/quiz_welcome',function(req,res){

        res.sendfile('quiz_welcome.html');

});
app.get('/quiz_main',function(req,res){
    res.sendfile('quiz_main.html');
});
app.get('/ques',function(req,res){
    var url=require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;  // query={q:'0'}
  //  console.log(url_parts.query);
    console.log(query);
    ques.findOne({"sno": query.q, quizid:query.sub},function(err,resp){
        if(resp){
            //  res.write(err);
            console.log(resp);
            res.send(resp);

        }
        else{
            res.redirect('/dashboard');

        }
    })


})

app.get('/getQues',function(req,res){
    var url=require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    ques.find({quizid:query.sub},function(err,resp){
        if(resp){
            //  res.write(err);
            res.send(resp);

        }
        });
});
app.get('/Quiz_angularserver.js',function(req,res){
    res.sendfile('Quiz_angularserver.js');
});
app.get('/forgotPass_angular.js',function(req,res){
    res.sendfile('forgotPass_angular.js');
});
app.get('/register_angular.js',function(req,res){
    res.sendfile('register_angular.js');
});
app.get('/jquery.datetimepicker.js',function(req,res){
    res.sendfile('jquery.datetimepicker.js');
});
app.get('/jquery.datetimepicker.min.js',function(req,res){
    res.sendfile('jquery.datetimepicker.min.js');
});
app.get('/jquery.js',function(req,res){
    res.sendfile('jquery.js');
});
app.get('/jquery.datetimepicker.css',function(req,res){
    res.sendfile('jquery.datetimepicker.css');
});
app.get('/create.png',function(req,res){
    res.sendfile('create.png');
});
app.get('/delete.jpg',function(req,res){
    res.sendfile('delete.jpg');
});
app.get('/edit.png',function(req,res){
    res.sendfile('edit.png');
});
app.get('/js.png',function(req,res){
    res.sendfile('js.png');
});
app.get('/angularjs.png',function(req,res){
    res.sendfile('angularjs.png');
});
app.get('/nodejs.png',function(req,res){
    res.sendfile('nodejs.png');
});

app.get('/enable.jpg',function(req,res){
    res.sendfile('enable.jpg');
});
app.get('/disable.jpg',function(req,res){
    res.sendfile('disable.jpg');
});
app.get('/schedule.png',function(req,res){
    res.sendfile('schedule.png');
});
app.get('/registration',function(req,res){
    res.sendfile('registration.html');
});
app.get('/submitans',function(req,res){
    res.sendfile('quiz_report.html')
});
app.post('/updatePassword',function(req,res){

    var passhash= bcrypt.hashSync(req.body.newpass, bcrypt.genSaltSync(10));
    users.where('email', req.body.email).update({password:passhash}, function (err, count) {
      if(count){

          res.send('Successfull')
      }
    });
});
app.get('/forgotPassword',function(req,res){
   res.sendfile('forgotpass.html');
});
app.get('/forgotpass',function(req,res){
    var url=require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query.email;  //
    users.findOne({email:query},function(err,users){
        if(users){
            //  res.write(err);
            res.send(users);
        }
        else{
            res.send('User Doesnt Exist');

        }
    })
});

app.post('/registration',function(req,res){

    var passhash= bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    console.log(req)
    var newuser = new users({
        name:req.body.name,
        email:req.body.email,
        password:passhash,
        securityQues:req.body.securityQues,
        securityAns:req.body.securityAns,
        userType:'candidate'

    });

    newuser.save(function(err, newuser) {
        var option={
            protocol:'http',
            hostname:'localhost',
            pathname:'/registration',
            port:8888,
            method:'GET'

        };
        if (err) {
           option.query={Succ:false};
            var apipath=url.format(option);
            res.redirect(apipath);
        }

        else{
            option.query={Succ:true};
            var apipath=url.format(option);
            res.redirect(apipath);
              }
    });


});

app.listen(8888,'localhost');