var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require('Guid'),
    bcrypt = require("bcrypt-nodejs");

var plainTextPassword = "password";
var hash = bcrypt.hashSync(plainTextPassword);
var sessionId = Guid.create().toString();

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

function runSetup() {
    return MongoClient.connect(fullMongoUrl)
        .then(function(db) {
            return db.createCollection("users");
        }).then(function(userCollection) {

            return userCollection.count().then(function(theCount) {
                // the result of find() is a cursor to MongoDB, and we can call toArray() on it
                if (theCount > 0) {
                    return userCollection.find.toArray();
                }

                return userCollection.insertOne({_id: Guid.create().toString(), username: 'MG', encryptedPassword: hash, currentSessionId: sessionId, profile: { firstName: 'Mehul',lastName: 'Gupta', hobby: 'cooking', petName: 'tommy'}
                }).then(function() {
                    return userCollection.find().toArray();
                });
            });
        });
}

// By exporting a function, we can run 
var exports = module.exports = runSetup;