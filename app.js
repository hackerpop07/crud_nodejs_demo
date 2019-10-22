const express = require('express');
const app = express();
var path = require('path');
const bodyParser = require('body-parser');

// const expressValidator = require('express-validator');
const validatorOptions = {};

// app.use(expressValidator(validatorOptions));
// Configuring the database
const Database = require('./db/database');

//set post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//routers import
const user = require('./routers/user.router');
app.use('/users', user);
app.use('*', (req, res) => {
    res.send('status:  404')
});

let port = 3000;

app.listen(port, () => {
    console.log(" Serve is up and running on port: " + port)
});
