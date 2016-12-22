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

  brojacKorisnika++;
  console.log(new Date(), "Broj trenutnih korisnika: ", brojacKorisnika, io.engine.clientsCount);
  io.sockets.emit('newconn', brojacKorisnika);

// testni podaci. trebace ove podatke kreirati
// iz neke funkcije i proslijediti ih u
// socket.on.data
  var data = {"data": "newconn",  "ip":fakeip};
  jack = JSON.stringify(data);

  // Create a socket (client) that connects to the server
  var procSocket = new net.Socket();
  procSocket.connect(3001, "localhost", function () {
      console.log("Client: Connected to server");
      procSocket.write(jack);
  });

  // Ovdje treba upumpati podatke iz funkcija
  // ili na drugi nacin pripremiti podatke
  // objekat koji sadrzi elemente:
  // data, ip, word, type?, other
  procSocket.on("data", function (data) {
    console.log("Client: lists functional");
    console.log("Client: Response from server: %s", data);
    var lists = JSON.parse(data);

    io.emit("eventList", JSON.stringify(lists.eventList));
    io.emit("personList", JSON.stringify(lists.personList));
    procSocket.end();
  });

  socket.on('disconnect', function () {
    brojacKorisnika--;
    console.log(new Date(), "Broj trenutnih korisnika: ", brojacKorisnika, io.engine.clientsCount);
    // socket.leave(socket.room);
    io.sockets.emit('newconn', brojacKorisnika);
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
    var data = {"data": "eventWord", "ip":fakeip, "word":eventWord};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var procSocket = new net.Socket();
    procSocket.connect(3001, "localhost", function () {
        console.log("Client: eventWord: Connected to server");
        procSocket.write(jack);
    });
    // Emitujemo klijentu izmjenu na event
    io.emit('eventWord', eventWord);

    // Cekamo odgovor sa procesora i osvjezenu event listu
    procSocket.on("data", function (data) {
      var list=JSON.parse(data);
      io.emit('eventList', JSON.stringify(list));
      procSocket.end();
    });
  });


// *********************************************************************
// Socket u slucaju kada korisnik unese rijec u Person polje
// pakuje ga i proslijedjuje ga Processoru na obradu i ceka povratnu
// informaciju o uspjesnosti i listi personList
// *********************************************************************
  socket.on('person', function (newroom, personWord) {

    console.log("Registrujem person socket ", personWord);

    var data = {"data": "personWord", "ip":fakeip, "word":personWord};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var procSocket = new net.Socket();
    procSocket.connect(3001, "localhost", function () {
        console.log("Client: personWord: Connected to server");
        procSocket.write(jack);
    });
    // Emitujemo klijentu izmjenu na event
    io.emit('personWord', personWord);

    // Cekamo odgovor sa procesora i osvjezenu event listu
    procSocket.on("data", function (data) {
      var list=JSON.parse(data);
      io.emit('personList', JSON.stringify(list));
      procSocket.end();
    });
  });

  /////////////////////////////////////////////
  //                                         //
  //           FAZA N ODJAVLJIVANJE          //
  //    Odmah nakon zatvaranja socketa,      //
  //     prijavljujemo diskonektovanje       //
  //                                         //
  /////////////////////////////////////////////

});

http.listen(3000, function(){
  console.log(new Date(), 'Started listening on port:3000');
});
