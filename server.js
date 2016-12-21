/* ******************************************************
 *                ONE WORD WORLD SERVER
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 14th Nov 1972                                        *
 ********************************************************/

 /* ******************************************************
 * Loading all required middleware
 ********************************************************/
var ver = 'owwServer v.0.0.10';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioToProcessor = require('socket.io-client');
var eventList;
var personList;
const net = require("net");

console.log(new Date());
console.log("loaded all required modules");
// ******************************************************

/* ******************************************************
* Routing i landing page - still need to see if it is
* necessary as angular will take over the routing...
********************************************************/
app.enable('trust proxy');
app.use('/bootstrap', express.static('bootstrap'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/application', express.static('application'));
app.use('/views', express.static('views'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
console.log("all routes are set");
// ******************************************************


console.log("I guess we're all set.");
console.log("*********************************************************************");
console.log(ver, " is online and ready!");

console.log("*********************************************************************");



  // Brojac online korisnika
  var brojacKorisnika = 0;
  var room = ['person', 'event']

  /* ******************************************************
  * Kreiranje socketa prilikom konekcije klijenta na
  * server. Kupimo IP adresu, povecavamo broj online
  * korisnika i emitujemo svima osvjezenu informacije:
  * broj korisnika, event, person.
  ********************************************************/
io.sockets.on('connection', function (socket) {
  var fakeip = socket.handshake.address;
  console.log("socket.handshake.address: ", fakeip);
  /////////////////////////////////////////////
  //                                         //
  //         FAZA  PRIJAVLJIVANJE            //
  // Odmah nakon konekcije idemo sa prijavom //
  // korisnika i povecanjem broja korisnika  //
  // za jedan                                //
  //                                         //
  /////////////////////////////////////////////

  brojacKorisnika++;
  console.log(new Date(), "Broj trenutnih korisnika: ", brojacKorisnika);
  io.emit('newconn', brojacKorisnika);

// testni podaci. trebace ove podatke kreirati
// iz neke funkcije i proslijediti ih u
// socket.on.data
  var data = {"data": "newconn",  "ip":fakeip};
  jack = JSON.stringify(data);

  // Create a socket (client) that connects to the server
  var socket = new net.Socket();
  socket.connect(3001, "localhost", function () {
      console.log("Client: Connected to server");
      socket.write(jack);
  });

// Ovdje treba upumpati podatke iz funkcija
// ili na drugi nacin pripremiti podatke
// objekat koji sadrzi elemente:
// data, ip, word, type?, other
  socket.on("data", function (data) {
    console.log("Client: lists functional");
    console.log("Client: Response from server: %s", data);
    var lists = JSON.parse(data);

    io.emit("eventList", JSON.stringify(lists.eventList));
    io.emit("personList", JSON.stringify(lists.personList));
    socket.end();
});


  /////////////////////////////////////////////
  //                                         //
  //    FAZA DRUGA KONEKTOVANJE ELEMENATA    //
  // Odmah nakon ucitavanja home stranice    //
  // ucitava se person i event dio, te se    //
  // oba moraju zasebno registrovati         //
  //                                         //
  /////////////////////////////////////////////
  socket.on('event', function (newroom, eventWord) {

    console.log("Registrujem event socket ", eventWord);
    // *********************************************************************
    var data = {"ip":fakeip, "word":eventWord, "type":"event"};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var socket = new net.Socket();
    socket.connect(3001, "localhost", function () {
        console.log("Client: Connected to server");
        socket.write(jack);
    });
    // Emitujemo klijentu izmjenu na event
    io.emit('eventWord', eventWord);

    // Cekamo odgovor sa procesora i osvjezenu event listu
    socket.on("data", function (data) {
      console.log("data functional");
      data = JSON.parse(data);
      console.log("Response from server: %s", data);
      socket.end();
  });
});

  // socket.on('person', function (newroom, personWord) {
  //   var word = personWord;
  //   console.log("Registrujem person socket ", word);
  //   dbcon.query('INSERT INTO tperson (pword) VALUES(?);', word, function (err, rows, fields) {
  //     if (err){
  //       if(err.fatal){
  //       throw err;
  //       }
  //       console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
  //
  //     };
  //   });
  //   // Emitujemo klijentu izmjenu na person
  // 	io.emit('personWord', personWord);
  //   dbcon.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 6', function (err, rows, fields) {
  //     if (err) {
  //       if(err.fatal){
  //       throw err;
  //       }
  //       console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
  //
  //     }
  //     json = JSON.stringify(rows);
  //     // console.log(json);
  //     io.emit('personList', json);
  //   });
  // });

  /////////////////////////////////////////////
  //                                         //
  //           FAZA N ODJAVLJIVANJE          //
  //    Odmah nakon zatvaranja socketa,      //
  //     prijavljujemo diskonektovanje       //
  //                                         //
  /////////////////////////////////////////////
  socket.on('disconnect', function () {
    if(brojacKorisnika>0){
    brojacKorisnika = brojacKorisnika-1;
    }
    console.log(new Date(), "Broj trenutnih korisnika: ", brojacKorisnika);
    socket.leave(socket.room);
    io.emit('newconn', brojacKorisnika);
    //dbcon.end();
  })
});

http.listen(3000, function(){
  console.log(new Date(), 'Started listening on port:3000');
});
