/********************************************************
 *            ONE WORD WORLD AUTHENTICATION
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 1411972                                              *
 ********************************************************/

/* ******************************************************
 * Loading all required middleware
 ********************************************************/


/*
 NOVI SERVER START
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var passport = require('passport');
var fs = require('fs');
var https = require('https');
var path = require('path');
var multer = require('multer')
var name;
var db = require('./config/processing');
var app = express();
var port = 443;

console.log("baza podataka: ", db);

// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/privkey.pem');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/cert.pem');
// var cacert = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/chain.pem');
// var options = {
//     key: privateKey,
//     cert: certificate,
//     ca: cacert
// };
//
var privateKey  = fs.readFileSync('./romanija/localhost-key.pem', 'utf8');
var certificate = fs.readFileSync('./romanija/localhost-cert.pem', 'utf8');
var options = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false,
    passphrase: 'Id10ti'
};

// Upload file location settings
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("setting up destination");
        cb(null, './images/upload');
    },
    filename: function (req, file, cb) {
        console.log("setting up filename");
        var datetimestamp = Date.now();
        name = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, name);
    }
});
console.log("File upload destination set to: romanija/images/upload");
console.log("*********************************************************************\n");

var upload = multer({ //multer settings
    storage: storage
}).single('file');




require('../romanija/config/passport')(passport); // pass passport for configuration
// app.set('views', [__dirname, '/views', __dirname, '/joli']);
app.use('/joli', express['static']('./romanija/joli'));
app.use('/scripts', express['static']('./node_modules'));
app.use('/client', express['static']('./romanija/client'));
app.use('/images', express['static']('./images'));
app.set('views', path.join(__dirname, '../romanija/views'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('view options', { layout: false });
app.set('trust proxy', 1);  // trust first proxy
app.use(flash());           // use connect-flash for flash messages stored in session
app.use(morgan('dev'));     // log every request to the console
app.use(cookieParser());    // read cookies (needed for auth)
// app.use(session({
//     secret: 'example',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//     }));
app.use(bodyParser.urlencoded({
    extended: true
    }));
app.use(bodyParser.json());
app.use(checkAuth);
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
    })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// =====================================
// UPLOAD SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
/** API path that will upload the event data */
app.post('/event', isLoggedIn, function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: "TEST: "+err});
            return;
        }

        // samo naziv filea
        // console.log(res.req.body.title);
        // console.log(res.req.file.path);
        // console.log(res.req.body.week);

        var data = {title: res.req.body.title, path: res.req.file.path, week: res.req.body.week};
        db.insertEvent(data, function (rezultat) {
            console.log("DATA: end of InsertEventWord - result: ", rezultat);

            if(rezultat.weekcheck){
                res.json({error_code: 0, err_desc: "Event successfully created"});
            }else{
                res.json({error_code: 1, err_desc: "Event for this week already created. Please check the date!"});
            }

        });


    });
});

/** API path that will upload the person data */
app.post('/person', isLoggedIn, function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }

        // samo naziv filea
        // console.log(res.req.body.title);
        // console.log(res.req.file.path);
        // console.log(res.req.body.week);

        var data = {title: res.req.body.title, path: res.req.file.path, week: res.req.body.week};
        db.insertPerson(data, function (rezultat) {
            console.log("DATA: end of InsertPerson - result: ", rezultat);
            if(rezultat.weekcheck){
                res.json({error_code: 0, err_desc: "Person successfully created"});
            }else{
                res.json({error_code: 1, err_desc: "Person for this week already created. Please check the date!"});
            }

        });


    });
});

// =====================================
// MAIN SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/main', isLoggedIn, function(req, res, next) {

    console.log('Request Type:', req.method);
    var events = [];
    var persons = [];
    db.mainLists(function (rezultat){

        events = rezultat.eventList;
        persons = rezultat.personList;
        console.log("test: ", persons);

        return res.render('main.ejs', {
            user : req.user,
            eventList: events,
            personList: persons
        });
    });

});


// cross origin requests - required for image upload!
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "https://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


console.log("multer settings set!");
console.log("*********************************************************************\n");


// routes ======================================================================
require('../romanija/app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var httpsServer = https.createServer(options, app);

function checkAuth (req, res, next) {
    console.log('checkAuth ' + req.url);

    // don't serve /secure to those not logged in
    // you should add to this list, for each and every secure url
    if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
        res.render('unauthorised', { status: 403 });
        return;
    }

    next();
}

httpsServer.listen(port, function () {
    console.log(" Initialization sequence complete. ");
    console.log(new Date(), 'Started Secure TLS listening on port:443');
});



/*
NOVI SERVER END
 */
