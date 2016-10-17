var MongoClient = require('mongodb').MongoClient,
settings = require('./config.js'),
Guid = require('Guid'),
bcrypt = require("bcrypt-nodejs"),
runStartup = require("./startup.js");

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};



//trips Collection
MongoClient.connect(fullMongoUrl)
.then(function(db) {
    
    db.createCollection("users");
    db.createCollection("trip");
    db.createCollection("activities");


    //ACTIVITIES - START
    var allActivity = db.collection("activities");

    exports.getAllRecentActivities = function(){
        console.log("getAllRecentActivities");
        
        return allActivity.find().toArray();
    };
    exports.createActivity = function(tripId, activityDescription, creatorId, creatorFName, creatorLName, creatorEmailId) {
 
    if(!tripId) return Promise.reject("tripId is blank.");
    var timestampActivity = new Date().toString();

    console.log("1")
    return allActivity.insertOne(
        {
            '_id'         :   Guid.create().toString(), 
            'tripId'      :   tripId,
            'description' :   activityDescription,
            'timestamp'   :   timestampActivity,
            'creator'     :{
                
                            '_id'         :   creatorId,
                            'firstName'   :   creatorFName,
                            'lastName'    :   creatorLName,
                            'emailId'     :   creatorEmailId
                        }
        }).then(function(createdActivity){
            console.log("Activity Created Successfully.");
            return true;
        });
    };

    //ACTIVITIES - END


    //TRIPS - START
    var tripCollection = db.collection("trip");
    exports.getAllTrips = function() {
        console.log("getAllTrips");
        return tripCollection.find().toArray();
    };

    exports.deleteTripById = function(tripId){
        console.log(tripId)
        return tripCollection.remove({_id:tripId});
    }
    
    exports.createTrip = function(tripName, tripLocation, timestamp, tripMembers){
        console.log("In createTrip()");

        if(!tripName) return Promise.reject("Missing trip name");
        if(!tripLocation) return Promise.reject("Missing trip Location");
        if(!timestamp) return Promise.reject("Missing trip date");
        if(!tripMembers) return Promise.reject("Enter atleast one trip member");

        console.log("In createTrip()1");

        return tripCollection.insertOne({'_id': Guid.create().toString(),
            'trip_name': tripName,
            'trip_location': tripLocation,
            'timestamp': timestamp,
            'trip_members': tripMembers,
            'experience':[],
            'photos':[],
            'comments':[]})
        .then(function(insertedTrip){
            return insertedTrip.insertedId;
        }).then(function(newTripId){
            console.log("createTrip, new Trip Id = "+newTripId);
            return exports.getTripById(newTripId);
        });
        console.log("In createTrip()3");
    };

    exports.getTripById = function(tripId){
        console.log("In getTripById");
        if(!tripId) return Promise.reject('Missing Trip Id');
        return tripCollection.find({'_id': tripId}).limit(1).toArray().then(function(tripLists){
            if(tripLists.length === 0) throw "Can not find trip with id of "+tripId;
            return tripLists[0];
        });
    };

    exports.getAllTripsByUserId = function(userId){
        console.log("In getAllTripsByUserId");
        if(!userId) return Promise.reject("Missing User Id");

        return tripCollection.find({'trip_members._id': userId}).toArray().then(function(tripLists){
            //if(tripLists.length === 0) throw "Can not find trips with member id of "+userId;

            console.log('getAllTripsByUserId, tripLists = '+tripLists.length);
            return tripLists;
        });
    };


    exports.createPhoto = function(tripId, imgPath, caption, creatorId, creatorFName, creatorLName, creatorEmailId){
        console.log("In trip createPhoto()");

        if(!tripId) return Promise.reject("Invalid Trip ID");        
        if(!imgPath) return Promise.reject("Invalid Image Path");
        if(!creatorId) return Promise.reject("Invalid creator Id");
        if(!creatorFName) return Promise.reject("Invalid creator First Name");
        if(!creatorLName) return Promise.reject("Invalid creator Last Name");
        if(!creatorEmailId) return Promise.reject("Invalid creator Email ID");

        console.log("In createPhoto()1");

        var today = new Date();
        console.log("In createPhoto()2");

        return tripCollection.update({ '_id':tripId}, {$push:{"photos":{'_id': Guid.create().toString(),
            'imgPath': imgPath,
            'creator': {'_id': creatorId, 'firstName': creatorFName, 'lastName': creatorLName, 'emailId': creatorEmailId},
            'timestamp': today.toString(),
            'caption': caption} 
        }}).then(function(insertedPhoto){
            console.log("createPhoto, insertedPhoto id");
            return "Successfully uploaded Photo";
        });
        console.log("In createPhoto()3");
    };

    exports.updatePhotoCaption = function(id, caption){
        console.log('In updatePhotoCaption');
        if(!id) return Promise.reject("Missing Photo Id");
        if(!caption) return Promise.reject("Missing Caption");
        console.log("In updatePhotoCaption, id="+id+" ,caption="+caption);

        return tripCollection.updateOne({'photos._id': id}, { $set: {'photos.$.caption': caption}}).then(function(){
            //return exports.getPhotoById(id);
            console.log("In updatePhotoCaption");
            console.log(caption);
            return caption;
        });
    };

    exports.addComment = function(photoId, posterId, posterFname, posterLname, posterEmailid, comment){
        console.log("addComment()");
        if(!photoId || photoId.trim().length === 0) return Promise.reject("Missing Photo Id");
        if(!posterId || posterId.trim().length === 0) return Promise.reject("Missing Poster Id");
        if(!posterFname || posterFname.trim().length === 0) return Promise.reject("Missing first name");
        if(!posterLname || posterLname.trim().length === 0) return Promise.reject("Missing last name");
        if(!posterEmailid || posterEmailid.trim().length === 0) return Promise.reject("Missing Email Id");
        if(!comment || comment.trim().length === 0) return Promise.reject("Missing Comment");

        console.log("addComment, after checks");
        return tripCollection.updateOne({'photos._id': photoId}, { $push: {'comments': {'_id': Guid.create().toString(), 'photoId': photoId, 'poster': {'_id': posterId, 'firstName': posterFname, 'lastName': posterLname, 'emailId': posterEmailid}, 'comment': comment}}})
        .then(function(){
            return exports.getPhotoById(photoId);
        });
    };

    //EXPERIENCE
    exports.addExperience = function(tripId, creatorId, creatorFname, creatorLname, creatorEmailid, experience){
        console.log("addExperience  ()");
        if(!tripId) return Promise.reject("Missing experience Id");
        if(!creatorId) return Promise.reject("Missing creator Id");
        if(!creatorFname) return Promise.reject("Missing first name");
        if(!creatorLname) return Promise.reject("Missing last name");
        if(!creatorEmailid) return Promise.reject("Missing Email Id");
        if(!experience ) return Promise.reject("Missing Comment");

        console.log("addExperience, after checks");
        var today = new Date;

        return tripCollection.updateOne({'_id': tripId}, { $push: {'experience': {'_id': Guid.create().toString(), 'creator': {'_id': creatorId, 'firstName': creatorFname, 'lastName': creatorLname, 'emailId': creatorEmailid}, 'timestamp': today.toString(), 'experience': experience}}})
        .then(function(){
            console.log("addExperience, Successfully added experience");
            return experience;
        });
    };
    exports.getAllExperience = function(tripId){
        console.log("getAllExperience()");
                console.log("getAllExperience(), tripID="+tripId);

        if(!tripId) return Promise.reject("Missing experience Id");

        return tripCollection.find({'_id':tripId}).toArray().then(function(tripLists){
            if(tripLists.length === 0) throw "Can not find trips with trip id of "+tripId;

            console.log('getAllExperience(), tripLists = '+tripLists.length);
            return tripLists[0].experience;
        });
    };

    exports.getPhotoById = function(imageid){
        console.log("In getPhotoById, imageid = "+imageid);
        if(!imageid) return Promise.reject('Missing PhotoId');
        //if(!tripid) return Promise.reject('Missing tripid');
        
        //return tripCollection.find({ $and: [{ '_id': tripid }, { 'photos._id': imageid }] }).limit(1).toArray()
        return tripCollection.find({ 'photos._id': imageid }).limit(1).toArray()
        .then(function(tLists){
            if(tLists.length === 0) throw "Can not find image with id of "+imageid;

            console.log("getPhotoById,  before return statement, "+tLists.length);
            return tLists[0];
        });
    };

    //TRIPS - END



    //USERS
    var userCollection = db.collection("users");
    

    exports.checkUser = function(UserName,Password,userSessionId) {
    if(!UserName) return Promise.reject("Missing UserName");
    if(!Password) return Promise.return("Missing Password");
    if (UserName == "" || Password == "")  return Promise.reject("You must enter all the fields.");
        console.log("checking user");

        return userCollection.find({'profile.emailId': UserName}).limit(1).toArray()
        .then(function(User) {
            if(User.length === 0) {
                return Promise.reject('Username '+UserName+' does not exist');
            }
            if(User[0].provider == "local"){
                if(bcrypt.compareSync(Password, User[0].hashedPassword)){
                    userCollection.update({'profile.emailId':UserName},{$set:{'sessionId':userSessionId}});
                    console.log("sessionId updated");
                    return User[0];
                }else{
                    return Promise.reject("UserName and Password you entered does not correspond to a registered user");
                }
            }else{
                return Promise.reject("The combination of field UserName and the field Password you entered does not correspond to a registered user");
            }
            
        });
    };

    exports.loginWithPassport = function(UserName,provider,userSessionId) {
    if(!UserName) return Promise.reject("Missing UserName");
    if(!userSessionId) return Promise.return("Missing SessionId");
    if (UserName == "" || userSessionId == "")  return Promise.reject("You must enter all the fields.");
        console.log("checking user");
        return userCollection.find({'profile.emailId': UserName}).limit(1).toArray().then(function(User) {
            if(User.length === 0) {
                return Promise.reject('Username '+UserName+' does not exist');
            }
            if(User[0].provider == provider){
                userCollection.update({'profile.emailId':UserName},
                    {
                        $set:
                            {
                                sessionId:userSessionId
                            }
                    
                })
                console.log("sessionId updated")
                return User[0];
            }else
                return Promise.reject("Username is not registered with facebook/gmail");
        });
    };
    
    exports.updateProfile = function(userId, FirstName,LastName,passwd) {
    console.log(FirstName+LastName+passwd)
    console.log("checking user");
    userCollection.update({'_id': userId},
        {
            $set:
                {
                    'profile.firstName':FirstName,
                    'profile.lastName':LastName,
                    'hashedPassword':passwd
                }
        
        })
        console.log("User updated");
    };
        
    exports.clearSessionId = function(sessionId){
        console.log("In ClearSessionId");

        if(!sessionId) return Promise.reject("Missing Session Id");
        
        return userCollection.updateOne({'sessionId': sessionId}, {$set: {'sessionId': ''}})
        .then(function(){
            console.log("In clearSessionId");
            return "success";
        });
    };
    exports.addSessionId = function(sessionId){
        console.log("In addSessionId - "+sessionId);

        if(!sessionId) return Promise.reject("Missing Session Id");

        return userCollection.updateOne({'sessionId': sessionId}, {$set: {'sessionId': sessionId}})
        .then(function(){
            console.log("In addSessionId");
            return sessionId;
        });
    };

    exports.createUser = function(UserName, Password, Fname, Lname, sessionId, provider) {
    if (!UserName || UserName == "")  return Promise.reject("User name is blank");
    if (!Password || Password == "") return Promise.reject("You must provide a password.");
    if (!Fname || Fname == "") return Promise.reject("You must provide first name.");
    if (!Lname || Lname == "") return Promise.reject("You must provide first name.");
    if(!sessionId) return Promise.reject("sessionId is blank.");
    if(!provider) return Promise.reject("Provider is blank.");
    
    console.log(UserName+Password+Fname+Lname);
    return userCollection.insertOne(
        {
            _id:Guid.create().toString(), 
            hashedPassword: Password, 
            sessionId: sessionId,
            provider: provider,
            profile:{
                    _id:Guid.create().toString(), 
                    firstName: Fname, 
                    lastName: Lname,
                    emailId: UserName           
                }      
        }).then(function(insertedUser){
            console.log("User Created Successfully.");
            return insertedUser.insertedId;
        });
    };
    
    exports.usernameExists = function(uname){
    if(!uname) return Promise.reject("Must provide username.");
            
        return userCollection.find({'profile.emailId': uname}).limit(1).toArray().then(function(userList){
            if(userList.length === 0) return true;
                else return Promise.reject("Username already taken.");
        });
    };

    exports.getAllUsers = function() {
        return userCollection.find().toArray();
    };

    exports.getUserById = function(userId){

        if(!userId || userId.trim().length === 0) return Promise.reject('Missing user Id');

        return userCollection.find({'_id':userId}).limit(1).toArray().then(function(usersLists){
            if(usersLists.length === 0) throw "Can not find user with id of "+userId;

            return usersLists[0];
        })
    };
    
    exports.getUserBySessionId = function(sessionId) {
        console.log("getUserBySessionId(), sessionId="+sessionId);

        if (!sessionId) return Promise.reject("You must provide an ID");

        return userCollection.find({ 'sessionId': sessionId}).limit(1).toArray().then(function(listOfUsers) {
            if (listOfUsers.length === 0) throw "Could not find user with sessionId of " + sessionId;

            console.log("getUserBySessionId(), user name="+listOfUsers[0].profile.emailId);
            return listOfUsers[0];
        });
    };

    exports.getUserByUsernamePassword = function(username, password){
        if(!username || username.trim().length === 0) return Promise.reject("You must provide an Username");
        if(!password || password.trim().length === 0) return Promise.reject("You must provide an password");

        return userCollection.find({"profile.emailId": username}).limit(1).toArray().then(function(listOfUsers){
            if(listOfUsers.length === 0) {
                return Promise.reject('could not find user with the username of '+username);
            }

            return listOfUsers[0];
        });
    };

    exports.getUserByUsernameArray = function(usernames){
        if(!usernames) return Promise.reject("NO usernames");

        return userCollection.find({ "profile.emailId": { $in: usernames } }).toArray();
    };
});