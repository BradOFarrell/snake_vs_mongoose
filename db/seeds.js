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
UserModel.remove({}, function (err) {
    console.log(err);
});
LogModel.remove({}, function (err) {
    console.log(err);
});
ResultsModel.remove({}, function (err) {
    console.log(err);
});

// Create sample logs: These represent a snake's movements
var exampleLog1 = new LogModel({log: "ssssseenwnwwssseeennnnwnnwswssss"});
var exampleLog2 = new LogModel({log: "ssssseennwwwseswseennnwnnwneeess"});
var exampleLog3 = new LogModel({log: "sssssennennnwwwssseeenneenesswss"});

// Create sample users: These contain a username and a log
var exampleUserAustin = new UserModel({username: "Austin", logs: [exampleLog1, exampleLog3]});
var exampleUserGlenn = new UserModel({username: "Glenn", logs: [exampleLog2, exampleLog2]});
var exampleUserJayme = new UserModel({username: "Jayme", logs: [exampleLog3, exampleLog1]});

// Create an example of a results file
var exampleResults = new ResultsModel({
    snakeUsername: exampleUserAustin.username,
    snakeScore: 7,
    mongooseUsername: exampleUserJayme.username,
    mongooseScore: 6, 
    timeStamp: new Date()
})
var exampleResults2 = new ResultsModel({
    snakeUsername: exampleUserAustin.username,
    snakeScore: 7,
    mongooseUsername: exampleUserGlenn.username,
    mongooseScore: 6, 
    timeStamp: new Date()
})
var exampleResults3 = new ResultsModel({
    snakeUsername: exampleUserJayme.username,
    snakeScore: 5,
    mongooseUsername: exampleUserGlenn.username,
    mongooseScore: 6, 
    timeStamp: new Date()
})

// create two arrays that we can iterate over
var exampleUsers = [exampleUserAustin, exampleUserGlenn, exampleUserJayme];

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
exampleResults2.save(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(exampleResults);
});
exampleResults3.save(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(exampleResults);
});

// Disconnect from database
db.close();