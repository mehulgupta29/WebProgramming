// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var commentData = require('./data.js');

// This package exports the function to create an express instance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This middleware will activate for every request we make to 
// any path starting with /assets;
// it will check the 'static' folder for matching files 
app.use('/assets', express.static('static'));

app.post("/", function(request, response) {
    try{
    var comment = request.body.comment;

    // On error, do: 
    // response.render("pages/home", { error: null, comments: ALL THE COMMENTS });
    // On success, do:
   // response.redirect("/");

    commentData.createComment(comment).then(function(comment) {
       // response.json(comment);
       
       });

     response.redirect("/");	
	

} 
	catch(errorMessage){
		commentData.getAllComments().then(function(commentList) {
        		response.render("./pages/home", { error: errorMessage, comments: commentList})  }
        		);
       
		}
});

app.get("/", function(request, response) {

	 commentData.getAllComments().then(function(commentList) {
        		response.render("./pages/home",{error: null, comments: commentList});
        	});
});

// Get all the comments
app.get("/api/comment", function(request, response) {
    commentData.getAllComments().then(function(commentList) {
        response.json(commentList);
    });
});

// We can now navigate to localhost:3000
app.listen(3000, function() {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
