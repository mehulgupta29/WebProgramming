// We first require our express package
var express = require('express'), 
    bodyParser = require('body-parser'),
    Guid = require("Guid"),
    path = require('path'),
    bcrypt = require("bcrypt-nodejs"),
    cookieParser = require('cookie-parser'),
    myData = require('./data.js'),
    xss = require('xss'),
    passport = require('passport'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    flash = require('connect-flash'),
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth2').Strategy;


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


//Passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: "963214213775345",
    clientSecret: "5b4d273afc1bb5a2d5fa9925b92b9e95",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name"],
    passReqToCallback: true
  },
  function(request,accessToken, refreshToken, profile, done) {
    console.info("YOU MUST NOW PERFORM THE AUTH FOR FACEBOOK");
    console.log("This user has a facebook id of: ");
    console.log(profile.email);
    console.log(profile.name.givenName);
    console.log(profile.name.familyName);
    console.log(request.cookies.currentSessionId);
    //return done(null,profile);
    
    myData.usernameExists(profile.emails[0].value).then(function(userFlag){
        myData.createUser(profile.emails[0].value,"password",profile.name.givenName,profile.name.familyName,xss(request.cookies.currentSessionId),"facebook")
        .then(function(insertedUser){
            return done(null,insertedUser)
        },function(error){
            return done(error)
        });
    },function(result){
        myData.loginWithPassport(profile.emails[0].value,profile.provider,xss(request.cookies.currentSessionId))
        .then(function(result){
            return done(null,result)
        },function(error){
            return done(error)
        })
    }); 
}));

passport.use(new GoogleStrategy({
    clientID: "1052416287233-dkmicqlup9rsn5r1ea5nsi9ph0rif97i.apps.googleusercontent.com",
    clientSecret: "74ukwryGIAd4-mYXbj5fy8M-",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request,accessToken, refreshToken, profile, done) {
    console.info("YOU MUST NOW PERFORM THE AUTH FOR FACEBOOK");
    console.log("This user has a facebook id of: ");
    console.log(profile.email);
    console.log(profile.name.givenName);
    console.log(profile.name.familyName);
    console.log(request.cookies.currentSessionId);
    //return done(null,profile);
    
    myData.usernameExists(profile.email).then(function(userFlag){
        myData.createUser(profile.email,"password",profile.name.givenName,profile.name.familyName,xss(request.cookies.currentSessionId),"google")
        .then(function(insertedUser){
            return done(null,insertedUser)
        },function(error){
            return done(error)
        });
    },function(result){
        myData.loginWithPassport(profile.emails[0].value,profile.provider,xss(request.cookies.currentSessionId))
        .then(function(result){
            return done(null,result)
        },function(error){
            return done(error)
        })
    }); 
}));

//Middleware
app.use(function(request, response, next){
    //console.log("Middleware");
    if(xss(request.cookies.currentSessionId)){
        response.locals.userSession = xss(request.cookies.currentSessionId);
    }
    next();
});


//ROUTES
app.get("/", function (request, response) {
    //console.log("GET/");
    response.render("pages/index", { pageTitle: "Welcome to Travel Journal." });

});

//LOGIN
app.get("/login",function(request,response){
    //console.log("GET/login");
    if(!request.cookies.currentSessionId){
        var expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes()+50);
        var session = Guid.create().toString();
        response.cookie("currentSessionId", session, {expires: expiresAt});
    }
    response.render("pages/loginPage", { pageTitle: "Welcome to Travel Journal.",errorFlag:"0" });
});
app.post("/login", function(request,response){
    //console.log("POST/login");

    var UserName = xss(request.body.email);
    var Password = xss(request.body.pwd);
    console.log("response sent");
    
    myData.checkUser(UserName,Password,request.cookies.currentSessionId)
    .then(function(newUser){
        response.redirect('/landing');
    },function(error){
        response.status(500).render('pages/loginPage', {pageTitle: "Welcome to Travel Journal.", errorFlag:"1", errorMessage:error});
        console.log("Bad Input");
    });
});

//SIGNUP
app.get("/signup",function(request,response){
    //console.log("GET/signup");
    var expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes()+50);
    var session = Guid.create().toString();
    response.cookie("currentSessionId", session, {expires: expiresAt});

    response.render("pages/signupPage", { pageTitle: "Welcome to Travel Journal.", errorFlag:"0" });
});
app.post("/signup", function(request, response){
    //console.log("POST/signup");

    var UserName = xss(request.body.email);
    var Password = xss(request.body.passwd);
    var Fname = xss(request.body.fname);
    var Lname = xss(request.body.lname);
    
    var hashPassword = bcrypt.hashSync(Password);

    myData.usernameExists(UserName).then(function(UserFlag){
        return myData.createUser(UserName, hashPassword, Fname, Lname, xss(request.cookies.currentSessionId), "local");
    }).then(function(UserId){
        response.redirect('/landing');        
    },function(error){
        response.status(500).render('pages/signupPage', {pageTitle: "Welcome to Travel Journal.",errorFlag:"1", errorMessage:error});
    });
});

//Facebook AUTHENTICATION
app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/landing',
                                      failureRedirect: '/login' }));

//GOOGLE AUTHENTICATION
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }
));

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/landing',
                                      failureRedirect: '/login' }));

//Delete Trip
app.get("/deleteTrip/:id", function(request,response){
    //console.log("GET/deleteTrip/:id");
    var tripId = xss(request.params.id);
    myData.deleteTripById(tripId).then(function(message){
        response.redirect('/landing');
    },function(err){
        console.log("Error deleting trip: "+err);
        response.status(500).redirect('/landing');
    });
});

//PROFILE
app.get("/profile", function(request,response){
    
    if(xss(request.cookies.currentSessionId)){
        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            response.render('pages/profilePage', {'user':user});
        })
    }else{
        response.redirect("/");
    }
});
app.post("/profile",function(request,response){
    if(xss(request.cookies.currentSessionId)){
        var firstName = xss(request.body.fname);
        var lastName = xss(request.body.lname);
        var passwd = xss(request.body.passwd);

        console.log(firstName+lastName+passwd)
        
        var hashedPassword = bcrypt.hashSync(passwd);
        
        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            console.log("Updating profile")
            
            myData.updateProfile(user._id,firstName,lastName,hashedPassword);
            response.redirect('/profile');

        },function(error){
            console.log(error);
            response.status(500).render('pages/profilePage', {'user':user});
        });
    }else{
        response.redirect("/");
    }
});


//LANDING
app.get("/landing", function(request,response){

    if(xss(request.cookies.currentSessionId)){

        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            myData.getAllTripsByUserId(user._id)
            .then(function(trips){
                myData.getAllRecentActivities().then(function(activities){  
                    console.log("Act==");
                    var errorFlagTrips = 0;
                    var errorFlag = 0;
                    if(trips.length == 0){
                        errorFlagTrips = 1;
                    }
                    if(activities.length == 0){
                        errorFlag = 1;
                    }
                    console.log("1");
                    response.render('pages/landingPage',{'errorFlag':errorFlag, 'errorFlagTrips':errorFlagTrips, 'trips':trips, 'activities':activities,'User':user.profile.firstName});
console.log("2");
                },function(err){
                    //console.log("GET/landing getAllRecentActivities, "+err);
                    response.status(500).render('pages/landingPage',{errorFlagTrips:"1", errorFlag:"1"});   
                });
                
            },function(errorMessage){
                //console.log("Error message displayed");
                response.status(500).render('pages/landingPage', {errorFlag:errorMessage, trips:""});
            }); 
        });
    }else{
        response.redirect("/");
    }
});


//multiple file upload using formidable
app.post('/upload/:id', function (req, res){
    var form = new formidable.IncomingForm();
    form.hash ='md5';
    form.multiples = true;

    function parseForm(err) {
        if (err) console.error(err);
        res.status(500).redirect('/allPhotos');
    }

    function formEnd() {
        var static = 'static';
        var uploads = '/uploads';
        this.openedFiles.forEach(function(file) {
            var ext = file.name.split('.').slice(-1)[0];
            console.log("ext = "+ext+" ,in toLowerCase="+ext.toLowerCase());
                
            if(ext.toLowerCase() === 'png' || ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg'){
                var name = file.hash + '.' + (file.name.split('.').slice(-1)[0]).toLowerCase();

                var src  = file.path;
                var temp = path.join(static, uploads);
                var dest = path.join(temp, name);

                fs.copy(src, dest, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("[INFO] Uploaded: %s as %s", file.name, name);

                        myData.getUserBySessionId(xss(req.cookies.currentSessionId))
                        .then(function(user){    
                            return user;
                        }).then(function(userData){

                            myData.createPhoto(xss(req.params.id), "assets/"+uploads+"/"+name, 'Test caption', userData._id, userData.profile.firstName, userData.profile.lastName, userData.profile.emailId);

                            myData.createActivity(xss(req.params.id), "uploaded a photo", userData._id, userData.profile.firstName, userData.profile.lastName, userData.profile.emailId);

                        }, function(errorMessage){
                            res.status(500).render("pages/allPhotos", {'pageTitle':'Error', 'error': errorMessage, 'trips':''});
                        });
                    }
                });

            }else{
                res.status(500).end();
            }
        });
    }

    form.parse(req, parseForm);
    form.on('end', formEnd);
});


//AllPhotos
app.get("/allPhotos", function(request, response){

    if(xss(request.cookies.currentSessionId)){
        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            return user._id;
        }).then(function(userId){
            return myData.getAllTripsByUserId(userId);
        }).then(function(trips){

            if(trips.length > 0){
                response.render("pages/allPhotos", {'pageTitle':'Photos', 'error':'' , 'trips':trips});
            }else{
                response.render("pages/allPhotos", {'pageTitle':'No Trips Available', 'error':'' , 'trips':trips});
            }
        }, function(errorMessage){
            response.status(500).render("pages/allPhotos", {'pageTitle':'Photos', 'error':errorMessage, 'trips':''});
        });    
    }else{
        response.redirect("/");
    }
    
});

//COMMENT
app.get("/comment", function(request, response){

    if(xss(request.cookies.currentSessionId)){

        myData.getPhotoById(xss(request.query.id)).then(function(trip){
            
            response.locals.photoId = xss(request.query.id);
            response.render("pages/comment", {'pageTitle':'Trips', 'error':'' , 'trip':trip});
        }, function(errorMessage){
            response.status(500).render("pages/allPhotos", {'pageTitle':"Photos", 'error':errorMessage, 'trips':''});
        });
    }else{
        response.redirect("/");
    }

});
app.get("/api/comment", function(request, response){
    if(xss(request.cookies.currentSessionId)){
        myData.getPhotoById(xss(request.query.id)).then(function(trip){
            response.json({success:true, 'trip':trip});
        }, function(errorMessage){
            response.status(500).render("pages/allPhotos", {'pageTitle':'Photos', 'error':errorMessage, 'trips':''});
        });
    }else{
        response.redirect("/");
    }
});
app.post("/api/comment", function(request, response){
    if(xss(request.cookies.currentSessionId)){
        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            return user;
        }).then(function(user){
            return myData.addComment(xss(request.body.photoId), user._id, user.profile.firstName, user.profile.lastName, user.profile.emailId, xss(request.body.comment));
        }).then(function(updatedTrip){
            response.json({success: true, 'trip': updatedTrip});
        }, function(errorMessage){
            response.status(500).render("pages/allPhotos", {'pageTitle': 'Photos', 'error': errorMessage});
        });
    }else{
        response.redirect("/");
    }
});

//Caption
app.post("/api/caption", function(request, response){
    if(xss(request.cookies.currentSessionId)){

        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            return user;
        }).then(function(user){
            return myData.updatePhotoCaption(xss(request.body.photoId), xss(request.body.caption));
        }).then(function(updatedCaption){
            response.json({success: true, 'updatedCaption': updatedCaption});
        }, function(errorMessage){
            response.status(500).render("pages/allPhotos", {'pageTitle': 'Photos', 'error': errorMessage});
        });

    }else{
        response.redirect("/");
    }
});



//EXPERIENCE module
app.post("/experience", function(request, response){
    //console.log("POST/experience");
    if(xss(request.cookies.currentSessionId)){

        myData.getUserBySessionId(xss(request.cookies.currentSessionId))
        .then(function(user){
            return user;
        }).then(function(user){
            myData.createActivity(xss(request.body.tripId), "shared his experience", xss(user._id), xss(user.profile.firstName), xss(user.profile.lastName), xss(user.profile.emailId), xss(request.body.experience));

            return myData.addExperience(xss(request.body.tripId), xss(user._id), xss(user.profile.firstName), xss(user.profile.lastName), xss(user.profile.emailId), xss(request.body.experience));
        }).then(function(message){
            response.status(500).redirect("/allPhotos");
        });
    }else{
        response.redirect("/");
    }
});

//TRIPS
app.get("/createTrip", function(request, response){
    //console.log("GET/createTrip");   

    if(request.cookies.currentSessionId){
        myData.getAllUsers().then(function(users){
                response.render("pages/trips", {'pageTitle': 'Create Trip', 'error': '', 'users':users});
        },function(errorMessage){
                response.status(500).render("pages/trips", {'pageTitle': 'Error - TRIP', 'error': errorMessage, 'users':''});
        });
    }else{
        response.redirect("/");
    }
});

app.post("/createTrip", function(request, response){
    console.log("POST/createTrip");

    if(xss(request.cookies.currentSessionId)){

        var tripMembers = xss(request.body.tripMembers.toString());        
        var tripMember = tripMembers.split(',');

        myData.getUserBySessionId(xss(request.cookies.currentSessionId)).then(function(currentUser){

            if(tripMember.indexOf(currentUser.profile.emailId) === -1){
                tripMember.push(currentUser.profile.emailId);
            }

            return tripMember;

        }).then(function(tripMember){

            return myData.getUserByUsernameArray(tripMember);

        }).then(function(userMembers){
            return myData.createTrip(xss(request.body.tripName), xss(request.body.tripLocation), xss(request.body.tripDate), userMembers);
        }).then(function(newTrip){
            response.redirect("/landing");
        }, function(errorMessage){
            response.status(500).render("pages/trips", {'pageTitle': 'Error - TRIP', 'error': errorMessage, 'users':''});
        });

    }else{
        response.redirect("/");
    }
});


//LOGOUT
app.all("/logout", function(request, response){
    console.log("all/logout");
    myData.clearSessionId(xss(request.cookies.currentSessionId))
    .then(function(reply){
        var expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() - 60);
        response.cookie("currentSessionId", "", { expires: expiresAt });
        response.clearCookie("currentSessionId");
        response.locals.userSession = undefined;
        response.locals.res = undefined;
        response.redirect("/");
    });
});

app.get("*", function(request, response){
    response.status(404).render("pages/error", {'pageTitle': "Something went wrong!!", 'error':""});
})

// We can now navigate to localhost:3000
app.listen(3000,'0.0.0.0', function () {

    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
