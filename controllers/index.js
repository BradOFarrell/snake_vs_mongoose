const express = require('express')
const router = express.Router()
const Schema = require("../db/schema.js");

const LogModel = Schema.LogModel;
const UserModel = Schema.UserModel;
const ResultsModel = Schema.ResultsModel;

// Sends data to the page
router.get('/', (request, response) => {
  UserModel.find({})
      .then((user) => {

        // Get random opponent from ghost data
          const opponent = user[Math.floor(Math.random()*user.length)];
          const mongoosePath = opponent.logs[Math.floor(Math.random()*opponent.logs.length)].log;
          console.log(opponent);

          ResultsModel.find({mongooseUsername: opponent.username})
            .then((results) => {
              response.render('index', {
              opponentName: opponent.username,
              mongoosePath: mongoosePath,
              results: results            
            }).catch((error) => {
              console.log(error)
            })
          })
      })
      .catch((error) => {
          console.log(error)
      })
});

// Recieves data from the page
router.post('/', (request, response) => {
  console.log(request.body);

  const newResults = new ResultsModel({
    snakeUsername: request.body.username,
    snakeScore: request.body.myScore,
    mongooseUsername: request.body.opponentName,
    mongooseScore: request.body.opponentScore, 
    timeStamp: new Date()
  });
  const newLog = new LogModel({
    log: request.body.log,
  });
  const newUser = new UserModel({
    username: request.body.username,
    logs: [newLog]
  });

  console.log(request.body);

  newResults.save(err => { if (err) { console.log(err); return; } console.log(newResults);});
  newUser.save(err => { if (err) { console.log(err); return; } console.log(newUser);});  
  
});

module.exports = router;