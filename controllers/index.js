const express = require('express')
const router = express.Router()
const Schema = require("../db/schema.js");

const UserModel = Schema.UserModel;

router.get('/', (request, response) => {
  UserModel.find({})
      .then((user) => {

        // Get random opponent from ghost data
          const opponent = user[Math.floor(Math.random()*user.length)];
          const mongoosePath = opponent.logs[Math.floor(Math.random()*opponent.logs.length)].log;
          console.log(opponent);

          response.render('index', {
            opponentName: opponent.username,
            opponentLog: mongoosePath
          })
      })
      .catch((error) => {
          console.log(error)
      })
});

module.exports = router;