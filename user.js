
/**
 * Created by ruchi on 1/6/2016.
 */
/**
 * Created by ruchi on 1/6/2016.
 */
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');
var movieSchema = new mongoose.Schema({
    name:String,
    password:String
});
var users = mongoose.model('users', movieSchema);

 var thor = new users({
 name:'gagan',
     password:'xyz'
 });

 thor.save(function(err, thor) {
 if (err) return console.error(err);
 console.dir(thor);
 });





/*user.findOne({ pasword: 'abc' }, function(err, thor) {
    if (err) return console.error(err);
    console.dir(thor);
});*/

// Find all movies.

 users.find(function(err, movies) {
 if (err) return console.error(err);
 console.dir(movies);
 });
/*
 // Find all movies that have a credit cookie.
 Movie.find({ hasCreditCookie: true }, function(err, movies) {
 if (err) return console.error(err);
 console.dir(movies);
 });*/
