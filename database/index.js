const mongoose = require('mongoose');
mongoose.set('useCreateIndex',true);

const DB_NAME = 'myadmin';
const DB_URL = 'localhost:27017';

const dbPromise = new Promise((resolve,reject)=>{
  //connect database
  mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`,{useNewUrlParser:true });

  //listen for error events on the connection
  mongoose.connection.on('open',(err)=>{
    if(!err){
      console.log(`connect successfully! URL: ${DB_URL} database: ${DB_NAME}`);
      resolve();
    }else{
      reject(err);
    }
  })
});

module.exports = dbPromise;