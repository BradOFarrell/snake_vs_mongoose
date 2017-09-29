const mongoose = require('mongoose');
// Use ES6 native promises. We are specifying a Promise library to avoid a depreciation warning in the console.
mongoose.Promise = global.Promise;

// First, we instantiate a namespace for our Schema constructor defined by mongoose.
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    log: {
        type: String,
        required: true
    }
});

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    logs: [LogSchema]
});

const ResultsSchema = new Schema({
    snakeUsername: {
        type: String,
        required: true
    },
    snakeScore: {
        type: Number,
        required: true
    },
    mongooseUsername: {
        type: String,
        required: true
    },
    mongooseScore: {
        type: Number,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    }
});

const UserModel = mongoose.model('User', UserSchema);
const LogModel = mongoose.model('Log', LogSchema);
const ResultsModel = mongoose.model('Results', ResultsSchema);

module.exports = {
    UserModel: UserModel,
    LogModel: LogModel,
    ResultsModel: ResultsModel
};