const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoosePort = process.env.mongooseURI;

Promise = require('bluebird');
mongoose.Promise = Promise;

//connect to the database, UrlParser is true, create Index for databse automaticaclly

require('mongoose').Promise = global.Promise
// mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('connected', console.log.bind(console, 'MongoDB connection :'));
mongoose.connect(mongoosePort,{
    'useNewUrlParser': true,
    'useFindAndModify':false,
    'useCreateIndex': true,
    'useUnifiedTopology': true,
   // server: serverOptions
}).then(()=>{

    console.log('successfull DB connection established ')

}).catch(error => {
    console.log('an error occured while establishing connection . ERROR : '+error.message)
});

console.log("Connected")