const express = require('express');

const db = require('./database');
const router = require('./routers/router');

const UserModel = require('./models/UserModel');
const md5 = require('blueimp-md5');

//create a server
const app = express();

//get post parameters request.body
app.use(express.urlencoded({extended: true}));
// app.use(express.json())

app.use(router);


//start database
(async () => {
  try {
    //waiting database connection
    await db;
    //start server
    app.listen(5050, (err) => {
      if (!err) console.log('Server starts http://localhost:5050');
      else console.log('Cannot start server',err);
    });
  } catch (err) {
    console.log('Cannot connect database', err);
  }

  //await UserModel.create({username: 'admin', password: md5('admin')});

})();









