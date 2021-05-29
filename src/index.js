const express = require('express');
const app = express();
require ("./DB/db")
// const auth = require('../src/middleware/auth');

app.use(express.urlencoded({extended:false}));   //for body parser

const user =require('./routes/userNecessaties')
    // logIN = require('./routes/login'),
    // logout = require('./routes/logout'),
    // signUp = require('./routes/signup')
    myWallet = require('./routes/wallet')

// app.use(logIN);
// app.use(logout);
// app.use(signUp);
app.use(user);
app.use(myWallet);


app.get('/test', function(req, res) {
    res.send('Hello World')
  })

app.listen(process.env.PORT, function() {
    console.log('listening on ',process.env.PORT)
  })