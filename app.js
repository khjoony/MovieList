// Write RESTful service by using Express
// 1. Movielist & Moviedetail : JSON
// 2. Add Movieliview function : JSON
// 3. router saparation
// 4. apply template

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var initialData = fs.readFileSync('initialDB.json');
var movieList= JSON.parse(initialData);

var app = express();
app.use(bodyParser.json());

app.get('/movies', showMovieList);
app.get('/movies/:movieId', showMovieDetail);
app.post('/movies/:movieId', addReview);

app.get('/', function(req, res) {
    res.end('Welcome to Movies app');
});

function addReview(req, res) {
    var movieId = req.params.movieId;
    var movie = findMovie(movieId);
    if( ! movie ) {
        res.status(404).send({msg:'Not Found'});
        return;
    }

    var review = req.body.review;
    movie.reviews.push(review);
    res.send({msg:'success'});
}

function findMovie(movieId) {
    for(var i = 0; i < movieList.length; i ++) {
        var item = movieList[i];
        if( item.movieId == movieId) {
            return item;
        }
    }
    return null;
}
function showMovieDetail(req, res) {
    var movieId = req.params.movieId;
    var movie = findMovie(movieId);

    if( ! movie ) {
        res.status(404).send({msg:'Not Found'});
        return;
    }

    res.send(movie);
}
function showMovieList(req, res) {
    var data = [];
    movieList.forEach(function(movie) {
        var info = {
            movieId : movie.movieId,
            title   : movie.title
        };
        data.push(info);
    });
    var result = {
        count : data.length,
        data  : data
    };
    res.send(result);
}

app.listen(3000);