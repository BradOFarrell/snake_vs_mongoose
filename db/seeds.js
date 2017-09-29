require('dotenv').config();

var mongoose = require('mongoose');
var Schema = require("./schema.js");

// ???????????????
mongoose.connect(process.env.MONGODB_URI); 
const db = mongoose.connection;

// Will log an error if db can't connect to MongoDB
db.on('error', function (err) {
    console.log(err);
});

// Will log "database has been connected" if it successfully connects.
db.once('open', function () {
    console.log("database has been connected!");
});

// Define schema we're working with
var UserModel = Schema.UserModel;
var LogModel = Schema.LogModel;
var ResultsModel = Schema.ResultsModel;

// First we clear the database of existing students and projects.
/*
UserModel.remove({}, function (err) {
    console.log(err);
});
LogModel.remove({}, function (err) {
    console.log(err);
});
ResultsModel.remove({}, function (err) {
    console.log(err);
});
*/

// Create sample logs: These represent a snake's movements
var exampleLog1 = new LogModel({log: "nnneeeswnewnnns"});
var exampleLog2 = new LogModel({log: "newnnnsnnneeesw"});
var exampleLog3 = new LogModel({log: "eeswnewnnnsnnne"});

// Create sample users: These contain a username and a log
var exampleUserBrad = new UserModel({username: "BradOFarrell", logs: [exampleLog1, exampleLog2]});
var exampleUserGlenn = new UserModel({username: "GlennBrown", logs: [exampleLog2, exampleLog3]});
var exampleUserJayme = new UserModel({username: "JaymeMarshall", logs: [exampleLog1, exampleLog2]});

// Create an example of a results file
var exampleResults = new ResultsModel({
    snakeUsername: exampleUserBrad.username,
    snakeScore: 8,
    mongooseUsername: exampleUserJayme.username,
    mongooseScore: 6, 
    timeStamp: new Date()
})

// create two arrays that we can iterate over
var exampleUsers = [exampleUserBrad, exampleUserGlenn, exampleUserJayme];

// Before we attempt to save, console log examples

console.log("SAMPLE DATA (not yet saved)");
console.log(exampleUsers);
console.log(exampleResults);

// Use a loop to save each user as a log
exampleUsers.forEach(function (user, i) {
    user.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(user);
    });
});

// Save the results on their own
exampleResults.save(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(exampleResults);
});

// Disconnect from database
db.close();