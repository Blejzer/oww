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
var app = express();
var http = require('http').Server(app);
var path = require('path');
var multer = require('multer')
var name;
var dotenv = require("dotenv"); // Environment variables
var port = 8089;
var uploadFileName="";

// const { error } = dotenv.config({ path: "/home/deploy/www/worldsword.com/current/" });

const myError = dotenv.config({path: "/Volumes/Projects/Internal/onewordworld/.env"}); // "/Volumes/Projects/Internal/onewordworld/.env"

if (myError.error) {
    throw myError.error
}

console.log('process.env', process.env);
var db = require(process.env.OWW_DEV_PATH+'/romanija/config/processing');
console.log("baza podataka: ", db.constructor);

// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/privkey.pem');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/cert.pem');
// var cacert = fs.readFileSync('/etc/letsencrypt/live/worldsword.com/chain.pem');
// var options = {
//     key: privateKey,
//     cert: certificate,
//     ca: cacert
// };
//
var privateKey  = fs.readFileSync(process.env.OWW_DEV_PATH+'/romanija/localhost-key.pem', 'utf8');
var certificate = fs.readFileSync(process.env.OWW_DEV_PATH+'/romanija/localhost-cert.pem', 'utf8');
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
        cb(null, process.env.OWW_DEV_PATH+'/images/upload');
    },
    filename: function (req, file, cb) {
        console.log("setting up filename");
        var datetimestamp = Date.now();
        name = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        uploadFileName = name;
        cb(null, name);
    }
});
console.log("File upload destination set to: "+process.env.OWW_DEV_PATH+"/images/upload");
console.log("*********************************************************************\n");

var upload = multer({ //multer settings
    storage: storage
}).single('file');




require(process.env.OWW_DEV_PATH+'/romanija/config/passport')(passport); // pass passport for configuration
// app.set('views', [__dirname, '/views', __dirname, '/joli']);
app.use('/joli', express['static'](process.env.OWW_DEV_PATH+'/romanija/joli'));
app.use('/scripts', express['static'](process.env.OWW_DEV_PATH+'/node_modules'));
app.use('/client', express['static'](process.env.OWW_DEV_PATH+'/romanija/client'));
app.use('/images', express['static'](process.env.OWW_DEV_PATH+'/images'));
app.set('views', path.join(process.env.OWW_DEV_PATH, '/romanija/views'));
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

        var stringa = res.req.file.path.substring(process.env.OWW_DEV_PATH.length+1);
        var data = {title: res.req.body.title, path: stringa, week: res.req.body.week};
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
        console.log(res.req.body.title);
        console.log(res.req.file.path);
        console.log(res.req.body.week);
        var stringa = res.req.file.path.substring(process.env.OWW_DEV_PATH.length+1);
        var data = {title: res.req.body.title, path: stringa, week: res.req.body.week};
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
require(process.env.OWW_DEV_PATH+'/romanija/app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// var httpsServer = https.createServer(options, app);

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

http.listen(port, function () {
    console.log(" Initialization sequence complete. ");
    console.log(new Date(), 'Started Secure TLS listening on port:8089');
});



/*
NOVI SERVER END
 */
