//startup.js
var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require('Guid'),
    bcrypt = require("bcrypt-nodejs");

var plainTextPassword = "password";
var hash = bcrypt.hashSync(plainTextPassword);
var sessionId = Guid.create().toString();

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

function runSetup() {
    MongoClient.connect(fullMongoUrl).
    then(function(db){
        db.createCollection("trip");
        db.createCollection("photos");
        db.createCollection("activities");

    }).then(function(){
        return true;
    });
}

// By exporting a function, we can run 
var exports = module.exports = runSetup;
