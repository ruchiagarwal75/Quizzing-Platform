/**
 * Created by ruchi on 1/5/2016.
 */
var express= require('express');
var app=express();
var request=require('request');

var mongoose=require('mongoose');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/test');

var qnum=1;
var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
var users = mongoose.model('users', userSchema);


var quesSchema = new mongoose.Schema({
    sno:String,
    question:String,
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    answer:String
});
var ques = mongoose.model('mcqs', quesSchema);
app.get('/login',function(req,res){
    res.sendfile('loginform.html');
});
app.post('/login',function(req,res){
    users.findOne({email:req.body.email,password:req.body.password},function(err,users){
        if(users){
            //  res.write(err);
            res.redirect('/dashboard');
        }
        else{
            res.redirect('/login?Login=failed');

        }
    })

});

app.get('/submit_ques',function(req,res){
    res.sendfile('submit_ques.html');
});
app.post('/submit_ques',function(req,res) {

var quesNum='0';
    ques.count({}, function (err, resp) {
        if (resp) {
            //  res.write(err);
            quesNum=resp;
        }
        var newques = new ques({
            sno:quesNum,
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

                res.redirect('/submit_ques?submit=succ');
            }
        });


    });


} )

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
    console.log(url_parts.query);
    ques.findOne({"sno": query.q},function(err,resp){
        if(ques){
            //  res.write(err);
            res.send(resp);

        }
        else{
            res.redirect('/dashboard');

        }
    })


});
app.get('/angularserver.js',function(req,res){
    res.sendfile('angularserver.js');
});
app.get('/dashboard',function(req,res){
    res.sendfile('dashboard.html');
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
app.get('/registration',function(req,res){
    res.sendfile('registration.html');
});
app.get('/submitans',function(req,res){
    res.sendfile('quiz_report.html')
});

app.post('/registration',function(req,res){
    var newuser = new users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password

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