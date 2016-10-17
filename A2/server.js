// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var myData = require('./data.js');
var myTodo = require('./toDoEntries.js');

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


// check for hidden input with the tag _method
// browser sometimes cannot submit a PUT or DELETE request,
// so we can use middleware to change it before it hits our routes!
// I have programatically injected some code that will add a hidden input called _method
app.use(function (req, res, next) {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
});


// Setup your routes here!
//GET/
app.get("/", function (request, response) { 
    // We have to pass a second parameter to specify the root directory
    // __dirname is a global variable representing the file directory you are currently in
    response.sendFile("./pages/index.html", { root: __dirname });
});


//GET/api/todo
app.get("/api/todo", function(request, response){
	response.json(myTodo.fetchAllToDos());
});

app.get("/api/todo/open", function(request, response){
	response.json(myTodo.fetchAllToDosOpen());
});

app.get("/api/todo/completed", function(request, response){
	response.json(myTodo.fetchAllToDosCompleted());
});

app.get("/api/todo/:id", function(request, response){
	try{
		response.json(myTodo.getToDo(request.params.id));
	}catch(message){
		response.status(message.code).json(message.error);
	}
});

app.post("/api/todo", function(request, response){
	try{
		response.json(myTodo.persistToDo(request.body.author, request.body.taskTitle, request.body.taskDescription));
	}catch(message){
		response.status(message.code).json(message.error);
	}
});

app.put("/api/todo/:id", function(request, response){
	try{
		response.json(myTodo.updateToDo(request.params.id, request.body.taskTitle, request.body.taskDescription, request.body.status));
	}catch(message){
		response.status(message.code).json(message.error);
	}
});

app.post("/api/todo/:id/notes", function(request, response){
	try{
		response.json(myTodo.addNotes(request.params.id, request.body.note));
	}catch(message){
		response.status(message.code).json(message.error);
	}
});

app.delete("/api/todo/:id", function(request, response){
	try{
		response.json(myTodo.deleteToDo(request.params.id));
	}catch(message){
		response.status(message.code).json(message.error);
	}
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
