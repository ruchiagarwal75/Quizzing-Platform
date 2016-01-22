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
    title: { type: String }
    , rating: String
    , releaseYear: Number
    , hasCreditCookie: Boolean
});
var Movie = mongoose.model('Movie', movieSchema);
/*
var thor = new Movie({
    title: 'Thor'
    , rating: 'PG-13'
    , releaseYear: '2011'  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
    , hasCreditCookie: true
});

thor.save(function(err, thor) {
    if (err) return console.error(err);
    console.dir(thor);
});

*/



Movie.findOne({ title: 'Thor' }, function(err, thor) {
    if (err) return console.error(err);
    console.dir(thor);
});

// Find all movies.
/*
Movie.find(function(err, movies) {
    if (err) return console.error(err);
    console.dir(movies);
});

// Find all movies that have a credit cookie.
Movie.find({ hasCreditCookie: true }, function(err, movies) {
    if (err) return console.error(err);
    console.dir(movies);
});*/
