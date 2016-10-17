// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var movieData = require('./data.js');

// We create our express isntance:
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.set('view engine', 'ejs');
app.use('/assets', express.static('static'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// If you'll notice, there's not a single database call in the server file!

// Get the best movies
app.get("/api/movies/best", function(request, response) {
    movieData.getPopularMovies().then(function(popularMovies){
        response.json(popularMovies);
    });
});

// Get a single movie
app.get("/api/movies/:id", function(request, response) {
    movieData.getMovie(request.params.id).then(function(movie) {
        response.json(movie);
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// Get all the movies
app.get("/api/movies", function(request, response) {
    movieData.getAllMovies().then(function(movieList) {
        response.json(movieList);
    });
});

// Create a movie
app.post("/api/movies", function(request, response) {
    movieData.createMovie(request.body.title, parseFloat(request.body.rating))
    .then(function(moviesList) {
        response.json(moviesList);
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// Update a movie 
app.put("/api/movies/:id", function(request, response) {
    movieData.updateMovie(request.params.id, request.body.title, request.body.rating).then(function(movie) {
        response.json(movie);
    }, function(errorMessage) {
        console.log("PUT/api/movies/:id, error="+errorMessage);
        response.status(500).json({ 'err': errorMessage });
    });
});

app.delete("/api/movies/:id", function(request, response) {
    movieData.deleteMovie(request.params.id).then(function(status) {
        response.json({success: status});
    }, function(errorMessage) {
        response.status(500).json({ 'err': errorMessage });
    });
});

app.get("/", function (request, response) {
    // We have to pass a second parameter to specify the root directory
    // __dirname is a global variable representing the file directory you are currently in
    response.render("pages/home");
});

// We can now navigate to localhost:3000
app.listen(3000, function() {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
