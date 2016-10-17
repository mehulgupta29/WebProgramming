// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var myData = require('./data.js');
var	cookieParser = require('cookie-parser');
var Guid = require("Guid");
var bcrypt = require("bcrypt-nodejs");

// This package exports the function to create an express instance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This middleware will activate for every request we make to 
// any path starting with /assets;
// it will check the 'static' folder for matching files 
app.use('/assets', express.static('static'));

// Setup your routes here!

//Middleware
//Check if the user is already logged in
app.use(function(request, response, next){
	if(request.cookies.currentSessionId){
		console.log("if, currentSessionId="+request.cookies.currentSessionId);
		console.log(request.cookies);
		response.locals.userSession = request.cookies.currentSessionId;
		response.locals.res = response;
	}
	next();
});

//ROUTES
app.get("/home", function (request, response) {
    response.render("pages/home", { pageTitle: "Welcome Home" });
});

app.get("/", function (request, response) { 
    // We have to pass a second parameter to specify the root directory
    // __dirname is a global variable representing the file directory you are currently in
    //response.sendFile("./pages/index.html", { root: __dirname });
    response.render("pages/home", {pageTitle: "Welcome", error: ''})
});

//Called when the user logs in
app.post("/result/login", function(request, response){
	//try{
	var username = request.body.username;
	var password = request.body.password;

	myData.getUserByUsernamePassword(username, password)
	.then(function(user1){

		if(!user1) console.log("user1 undefined");

		bcrypt.compare(password, user1.encryptedPassword, function(err, res){
        	if (res === true) {
            	
            	var expiresAt = new Date();
    			expiresAt.setMinutes(expiresAt.getMinutes()+5);
				response.cookie("currentSessionId", user1.currentSessionId, {'expires': expiresAt});

				response.redirect("../profile");
            	
            } else {
                response.render("./pages/home", {'pageTitle': 'Error', 'error': 'Passwords does not match the hash', 'user':''});
            }
        });
	}, function(errorMessage){
		response.render("./pages/home", {pageTitle: 'Error!!', error: errorMessage});
	});
});

//Called when the user signs up
app.post("/result/signup", function(request, response){
	var uname = request.body.uname;
	var pword = request.body.pword;
	
	//checks if the username is unique
	myData.usernameExists(uname).then(function(){
		//if the username is unqiue then redirect to /profile

		myData.createUser(uname, pword).then(function(user){

			//response.locals.userId = user._id;
			var expiresAt = new Date();
    		expiresAt.setMinutes(expiresAt.getMinutes()+5);
			response.cookie("currentSessionId", user.currentSessionId, {'expires':expiresAt});
			
			response.redirect("../profile");
		}, function(errorMessage){
			response.render("./pages/home", {'pageTitle': 'Error', 'error': errorMessage});
		});

		//else render error on home page
	}, function(errorMessage){
		response.render("./pages/home", {'pageTitle': 'Error', 'error': errorMessage});
	});
});

app.use(function(request, response, next){
	next();
});

app.get("/profile", function(request, response){
	myData.getUserBySessionId(request.cookies.currentSessionId).then(function(user){

		response.locals.userSession = request.cookies.currentSessionId;
		response.render("pages/profile", {pageTitle: "User Profile", error: '', 'user': user});
	}, function(errorMessage){
		response.render("./pages/home", {'pageTitle': 'Error', 'error': errorMessage});
	});
});

app.post("/result/profile", function(request, response){
	
	myData.getUserBySessionId(request.cookies.currentSessionId).then(function(user){
		myData.updateUserProfile(user._id, request.body.fname, request.body.lname, request.body.hobby, request.body.pname).then(function(updatedUser){

			response.locals.userSession = request.cookies.currentSessionId;
			response.render("pages/profile", {'pageTitle': 'User Profile - Updated', 'error': '', 'user': updatedUser});
		}, function(errorMessage){
						response.locals.userSession = request.cookies.currentSessionId;

			response.render("./pages/profile", {'pageTitle': 'Error', 'error': errorMessage, 'user':''});
		});	
	}, function(errorMessage){
					response.locals.userSession = request.cookies.currentSessionId;

		response.render("./pages/profile", {'pageTitle': 'Error', 'error': errorMessage, 'user':''});
	})
	
});

app.all("/logout", function(request, response){
    
    var expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() - 50);
    response.cookie("currentSessionId", "", { expires: expiresAt });
    response.clearCookie("currentSessionId");

    response.locals.userSession = undefined;
    response.locals.res = undefined;
    response.redirect("/");
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
