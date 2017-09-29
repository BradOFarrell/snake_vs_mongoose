const express = require('express')
const router = express.Router()
const Schema = require("../db/schema.js");

const UserModel = Schema.UserModel;

router.get('/', (request, response) => {
  UserModel.find({})
        .then((user) => {
            // Get random opponent from ghost data
            const opponent = user[Math.floor(Math.random()*user.length)];
            console.log(opponent);
            response.render('index', {
              opponent: opponent
            })
        })
        .catch((error) => {
            console.log(error)
        })
});


module.exports = router;