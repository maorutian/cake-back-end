const express = require('express');
const md5 = require('blueimp-md5');

const UserModel = require('../models/UserModel');

const router = express.Router();

//login
router.post('/login', (req, res) => {
  const {username, password} = req.body;

  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // success
        // cookie(userid: user._id)
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});

        user._doc.role = {menus: []};
        // return info(user)
        res.json({status: 0, data: user})

      } else {// failure
        res.json({status: 1, msg: 'Wrong username or password'})
      }
    })
    .catch(error => {
      console.error('login error', error)
      res.json({status: 1, msg: 'login err, please try again'})
    })

});

module.exports = router;