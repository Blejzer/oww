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
var ver = 'owwAdminServer v.0.1-alpha.20f';
var express = require('express');
var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var io2 = require('socket.io')(http);
// var https = require('https').Server(credentials, app);
// var eventList;
// var personList;
// const net = require("net");
// var multer = require('multer')
// var bodyParser = require('body-parser');
// var filename;

// certificates for https
var fs = require('fs');
// var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('romanija/localhost-key.pem', 'utf8');
var certificate = fs.readFileSync('romanija/localhost-cert.pem', 'utf8');
var options = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false,
    passphrase: 'Id10ti'
};
// var credentials = {key: privateKey, cert: certificate};
// var express = require('express');
// var app = express();

// your express configuration here

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

// httpServer.listen(8080);
// httpsServer.listen(8443);






// ******************************************************
console.log(new Date());
console.log(ver, "starting with initialization sequence: ");
console.log("Loaded all required modules");
// ******************************************************

/* ******************************************************
 * Routing and landing page
 * static content required
 *
 * Also, permiting cross origin requests that are
 * required for image upload
 ********************************************************/
app.enable('trust proxy');
app.use('/admin', express.static('admin'));
app.use('/scripts', express.static('node_modules/'));
// app.use('/custom', express.static('custom'));
// app.use('/images', express.static('images'));
app.use('/joli', express.static('joli'));
console.log("All static routes are set");
console.log("*********************************************************************\n");

// serving index page on connection
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/joli/index.html');
});


console.log("login.html page prepped to be served");
console.log("*********************************************************************\n");


// cross origin requests - required for image upload!
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// app.use(bodyParser.json());


// console.log("cross origin request permited");
// console.log("*********************************************************************\n");
//
// console.log("*********************************************************************\n");
console.log("I guess we're all set.");
console.log("*********************************************************************\n");
console.log(ver, " is online and ready!");
console.log("*********************************************************************\n");


/* ******************************************************
 * Kreiranje socketa prilikom konekcije klijenta na
 * server. Kupimo IP adresu, povecavamo broj online
 * korisnika i emitujemo svima osvjezenu informacije:
 * broj korisnika, event, person.
 ********************************************************/
// io.sockets.on('connection', function (socket) {
//     socket.removeAllListeners();
//     // var fakeip = '24.201.206.226' // socket.handshake.address;
//     // console.log(new Date(), "Client IP Address - assuming remote: socket.handshake.address: ", fakeip);
//     //
//     // var visitor = {};
//     // visitor.address = fakeip;
//     // var data = {"data": "newconn", "visitor": visitor};
//     // jack = JSON.stringify(data);
//     //
//     //     io.emit("eventList", JSON.stringify(lists.eventList));
//     //     io.emit("personList", JSON.stringify(lists.personList));
//     //     //
//     //     io.sockets.emit('conn', io.engine.clientsCount);
//     //
//     // //
//     // socket.on('disconnect', function () {
//     //     console.log(new Date(), "Diskonekcija: Broj trenutnih korisnika: ", io.engine.clientsCount);
//     //     // console.log(socket.list());
//     //     io.sockets.emit('conn', io.engine.clientsCount);
//     //     socket.removeAllListeners();
//     //     socket.leaveAll();
//     // });
//     //
//     //
//     // // *********************************************************************
//     // // Socket u slucaju kada korisnik unese rijec u Event polje
//     // // pakuje ga i proslijedjuje ga Processoru na obradu i ceka povratnu
//     // // informaciju o uspjesnosti i listi eventList
//     // // *********************************************************************
//     // socket.on('event', function (newroom, eventWord, event_id) {
//     //
//     //     // console.log(new Date(), "Registrujem event socket ", eventWord);
//     //     var data = {"data": "eventWord", "visitor": visitor, "word": eventWord, "event_id": event_id};
//     //     jack = JSON.stringify(data);
//     //
//     //     // Create a socket (client) that connects to the server
//     //     var procSocket = new net.Socket();
//     //     procSocket.connect(3001, "localhost", function () {
//     //         console.log(new Date(), "Server: eword: Connected to processor", jack);
//     //         procSocket.write(jack);
//     //     });
//     //     // Emitujemo klijentu izmjenu na event
//     //     io.emit('eventWord', eventWord);
//     //
//     //     // Cekamo odgovor sa procesora i osvjezenu event listu
//     //     procSocket.on("data", function (data) {
//     //         var list = JSON.parse(data);
//     //         console.log('data: ', list);
//     //         io.emit('eventList', JSON.stringify(list));
//     //         procSocket.end();
//     //     });
//     // });
//     //
//
// });

// io2.sockets.on('connection', function (socket) {
//     socket.removeAllListeners();
// });


/* ****************************************************************
 * Palimo server na portu 8443. Ovo je dev verzija. za produkciju  *
 * potrebno je unijeti i IP adresu na kojoj ce server slusati      *
 * http.listen(3000, xxx.xxx.xxx.xxx, function(){...               *
 *******************************************************************/
// httpServer.listen(8080, function () {
//     console.log(ver, " Initialization sequence complete. ");
//     console.log(new Date(), 'Started listening on port:8080');
// });


httpsServer.listen(8443, function () {
    console.log(ver, " Initialization sequence complete. ");
    console.log(new Date(), 'Started TLS listening on port:8443');
})







// var LocalStrategy   = require('passport-local').Strategy;
// var Config = require("config-js"); // Da bi ucitali config.js file, moramo imati ovaj modul ???
// var config = new Config("application/config/config.js");
// var mysql = require('mysql');
//
// var connection = mysql.createConnection({
//     host     : config.get('sequel.link'),
//     user     : config.get('sequel.juzer'),
//     password : config.get('sequel.lozinka'),
//     database: config.get('sequel.baza'),
//     port: config.get('sequel.prt')
// });
//
//
// // expose this function to our app using module.exports
// module.exports = function(passport) {
//
//     // =========================================================================
//     // passport session setup ==================================================
//     // =========================================================================
//     // required for persistent login sessions
//     // passport needs ability to serialize and unserialize users out of session
//
//     // used to serialize the user for the session
//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//     });
//
//     // used to deserialize the user
//     passport.deserializeUser(function(id, done) {
//         connection.query("select * from users where id = "+id,function(err,rows){
//             done(err, rows[0]);
//         });
//     });
//
//
//     // =========================================================================
//     // LOCAL SIGNUP ============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'
//
//     passport.use('local-signup', new LocalStrategy({
//             // by default, local strategy uses username and password, we will override with email
//             usernameField : 'email',
//             passwordField : 'password',
//             passReqToCallback : true // allows us to pass back the entire request to the callback
//         },
//         function(req, email, password, done) {
//
//             // find a user whose email is the same as the forms email
//             // we are checking to see if the user trying to login already exists
//             connection.query("select * from users where email = '"+email+"'",function(err,rows){
//                 console.log(rows);
//                 console.log("above row object");
//                 if (err)
//                     return done(err);
//                 if (rows.length) {
//                     return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
//                 } else {
//
//                     // if there is no user with that email
//                     // create the user
//                     var newUserMysql = new Object();
//
//                     newUserMysql.email    = email;
//                     newUserMysql.password = password; // use the generateHash function in our user model
//
//                     var insertQuery = "INSERT INTO users ( email, password ) values ('" + email +"','"+ password +"')";
//                     console.log(insertQuery);
//                     connection.query(insertQuery,function(err,rows){
//                         newUserMysql.id = rows.insertId;
//
//                         return done(null, newUserMysql);
//                     });
//                 }
//             });
//         }));
//
//     // =========================================================================
//     // LOCAL LOGIN =============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'
//
//     passport.use('local-login', new LocalStrategy({
//             // by default, local strategy uses username and password, we will override with email
//             usernameField : 'email',
//             passwordField : 'password',
//             passReqToCallback : true // allows us to pass back the entire request to the callback
//         },
//         function(req, email, password, done) { // callback with email and password from our form
//
//             connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
//                 if (err)
//                     return done(err);
//                 if (!rows.length) {
//                     return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
//                 }
//
//                 // if the user is found but the password is wrong
//                 if (!( rows[0].password == password))
//                     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
//
//                 // all is well, return successful user
//                 return done(null, rows[0]);
//
//             });
//
//
//
//         }));
//
// };