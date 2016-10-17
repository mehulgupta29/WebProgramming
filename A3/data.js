var MongoClient = require('mongodb').MongoClient,
 settings = require('./config.js'),
 Guid = require('Guid'),
 bcrypt = require("bcrypt-nodejs"),
 runStartup = require("./startup.js");

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};

runStartup().then(function(allUsers) {
    console.log(allUsers);
   
});

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var userCollection = db.collection("users");
        
        exports.getAllUsers = function() {
            return userCollection.find().toArray();
        };

        exports.createUser = function(userName, password){
            
            if(!userName || userName.trim().length === 0) return Promise.reject("Missing userName");
            if(!password || password.trim().length === 0) return Promise.reject("Missing password");
            //if(!sessionId) return Promise.reject("Missing sessionId");

            var sessionId = Guid.create().toString();
        
            return userCollection.insertOne({'_id':Guid.create().toString(), 'username': userName, 'encryptedPassword': bcrypt.hashSync(password), 'currentSessionId': sessionId, 'profile':{}}).then(function(insertedUser){
                return insertedUser.insertedId;
            }).then(function(newUserId){
                return exports.getUserById(newUserId);
            });
        };

        exports.getUserById = function(userId){
      
            if(!userId || userId.trim().length === 0) return Promise.reject('Missing user Id');

            return userCollection.find({'_id':userId}).limit(1).toArray().then(function(usersLists){
                if(usersLists.length === 0) throw "Can not find user with id of "+userId;

                return usersLists[0];
            })
        };

        exports.updateUserProfile = function(id, firstName, lastName, hobby, petName){
            if(!id || id.trim().length === 0) return Promise.reject("Missing user Id");
            if(!firstName || firstName.trim().length === 0) return Promise.reject("Missing first name");
            if(!lastName || lastName.trim().length === 0) return Promise.reject("Missing last name");
            if(!hobby || hobby.trim().length === 0) return Promise.reject("Missing hobby");
            if(!petName || petName.trim().length === 0) return Promise.reject("Missing pet name");

            return userCollection.updateOne({'_id': id}, { $set: {'profile': {'firstName': firstName, 'lastName': lastName, 'hobby': hobby, 'petName': petName}}}).then(function(){
                return exports.getUserById(id);
            });
        };

        exports.usernameExists = function(uname){
            if(!uname || uname.trim().length === 0) return Promise.reject("Missing Uname");
            
            return userCollection.find({'username': uname}).limit(1).toArray().then(function(userList){
                if(userList.length === 0) return true;
                else return Promise.reject("Username already taken.");
            });
        };

        exports.generateUserCurrentSessionId = function(user){
            if(!user || user.trim().length === 0) return Promise.reject("Missing or Invalid User");
            var sessionId = Guid.create().toString();

            return userCollection.update({_id: user._id}, {$set: {currentSessionId: sessionId}}).then(function(){
                return exports.getUserBySessionId(sessionId);
            });
        };

        // we can still update our data module by adding properties here, even though it's inside a callback!
        exports.getUserBySessionId = function(sessionId) {
            if (!sessionId || sessionId.trim().length === 0) return Promise.reject("You must provide an ID");

            return userCollection.find({ 'currentSessionId': sessionId}).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) throw "Could not find user with sessionId of " + sessionId;

                return listOfUsers[0];
            });
        };

        exports.getUserByUsernamePassword = function(username, password){
        	if(!username || username.trim().length === 0) return Promise.reject("You must provide an Username");
        	if(!password ||password.trim().length === 0) return Promise.reject("You must provide an password");

        	return userCollection.find({"username": username}).limit(1).toArray().then(function(listOfUsers){
                if(listOfUsers.length === 0) {
                    return Promise.reject('could not find user with the username of '+username);
                }

                return listOfUsers[0];
            });
        }

    });
