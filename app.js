const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('req-flash');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const upload = require("express-fileupload");

// const expressValidator = require('express-validator');
// const validatorOptions = {};

// app.use(expressValidator(validatorOptions));
// Configuring the database
const Database = require('./db/database');

app.use(express.static(__dirname + '/public'));

//set post body
app.use(session({ cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false}));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(upload({
    useTempFiles: true,
    tempFileDir: './public/images',
}));
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

