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
var ver = 'owwServer v.0.1-alpha.20f';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var ioToProcessor = require('socket.io-client');
var eventList;
var personList;
const net = require("net");
var multer  = require('multer')
// var upload = multer({ dest: 'images/upload/' })
var bodyParser = require('body-parser');
var filename;

console.log(new Date());
console.log(ver, "starting with initialization sequence: ");
console.log("Loaded all required modules");
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
//allow cross origin requests - required for image upload!
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

console.log("All routes are set");
console.log("*********************************************************************\n");
console.log("Setting file upload destination to: /images/upload");
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("setting up destination");
        cb(null, 'images/upload');
    },
    filename: function (req, file, cb) {
        console.log("setting up filename");
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
   storage: storage
  }).single('file');
/** API path that will upload the files */
app.post('/newevent', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
});
console.log("*********************************************************************\n");
console.log("*********************************************************************");
console.log("I guess we're all set.");
console.log("*********************************************************************\n");
console.log(ver, " is online and ready!");
console.log("*********************************************************************\n");


  // Brojac online korisnika
  var room = ['person', 'event']

  /* ******************************************************
  * Kreiranje socketa prilikom konekcije klijenta na
  * server. Kupimo IP adresu, povecavamo broj online
  * korisnika i emitujemo svima osvjezenu informacije:
  * broj korisnika, event, person.
  ********************************************************/
io.sockets.on('connection', function (socket) {
  var fakeip = socket.handshake.address;
  console.log("IP Adresa klijenta - pretpostavljam remote: socket.handshake.address: ", fakeip);

  console.log(new Date(), "Broj trenutnih korisnika: ", io.engine.clientsCount);
  io.sockets.emit('newconn', io.engine.clientsCount);

  socket.on('add-customer', function(customer) {

      customer.name = fakeip;
      console.log("customer.name = fakeip: ", customer)

      io.emit('notification', {
          message: 'new customer',
          customer: customer
      });
  });

// testni podaci. trebace ove podatke kreirati
// iz neke funkcije i proslijediti ih u
// socket.on.data
  var data = {"data": "newconn",  "ip":fakeip};
  jack = JSON.stringify(data);

  // Create a socket (client) that connects to the server
  var procSocket = new net.Socket();
  procSocket.on('error', function(error) {
    console.error("Greska u konekciji prema procesoru. gasim server...", error);
    procSocket.end();
    process.exit(0);
  });
  procSocket.connect(3001, "localhost", function () {
      console.log("Server: Connected to procesor");
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
    console.log(new Date(), "Broj trenutnih korisnika: ", io.engine.clientsCount);
    socket.leave(socket.room);
    io.sockets.emit('newconn', io.engine.clientsCount);
  });


  // *********************************************************************
  // Socket u slucaju kada korisnik unese rijec u Event polje
  // pakuje ga i proslijedjuje ga Processoru na obradu i ceka povratnu
  // informaciju o uspjesnosti i listi eventList
  // *********************************************************************
  socket.on('event', function (newroom, eventWord, event_id) {

    console.log("Registrujem event socket ", eventWord);
    // *********************************************************************
    var data = {"data": "eventWord", "ip":fakeip, "word":eventWord, "event_id":event_id};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var procSocket = new net.Socket();
    procSocket.connect(3001, "localhost", function () {
        console.log("Client: eventWord: Connected to server", jack);
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
  socket.on('person', function (newroom, personWord, person_id) {

    console.log("Registrujem person socket ", personWord);

    var data = {"data": "personWord", "ip":fakeip, "word":personWord, "person_id": person_id};
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

  // *********************************************************************
  // Socket u slucaju kada korisnik otvori stranicu Event
  // pa je potrebno dostaviti duzi spisak rijeci po nekoj
  // kvalifikaciji
  // *********************************************************************
  socket.on('eventPageLoaded', function () {

    console.log("Registrujem eventPageLoaded socket ");
    // *********************************************************************
    var data = {"data": "eventPageLoaded", "ip":fakeip};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var procSocket = new net.Socket();
    procSocket.connect(3001, "localhost", function () {
        console.log("Client: eventPageLoaded: Connected to server");
        procSocket.write(jack);
    });
    // Emitujemo klijentu izmjenu na event
    // io.emit('eventWord', eventWord);

    // Cekamo odgovor sa procesora i osvjezenu event listu
    procSocket.on("data", function (data) {
      var list=JSON.parse(data);
      io.emit('eventPageSuccess', JSON.stringify(list));
      procSocket.end();
    });
  });

  // *********************************************************************
  // Socket u slucaju kada korisnik otvori stranicu Person
  // pa je potrebno dostaviti duzi spisak rijeci po nekoj
  // kvalifikaciji
  // *********************************************************************
  socket.on('personPageLoaded', function () {

    console.log("Registrujem personPageLoaded socket ");
    // *********************************************************************
    var data = {"data": "personPageLoaded", "ip":fakeip};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the server
    var procSocket = new net.Socket();
    procSocket.connect(3001, "localhost", function () {
        console.log("Client: personPageLoaded: Connected to server");
        procSocket.write(jack);
    });
    // Emitujemo klijentu izmjenu na event
    // io.emit('eventWord', eventWord);

    // Cekamo odgovor sa procesora i osvjezenu event listu
    procSocket.on("data", function (data) {
      var list=JSON.parse(data);
      io.emit('personPageSuccess', JSON.stringify(list));
      procSocket.end();
    });
  });

});




/* ****************************************************************
* Palimo server na portu 3000. Ovo je dev verzija. za produkciju  *
* potrebno je unijeti i IP adresu na kojoj ce server slusati      *
* http.listen(3000, xxx.xxx.xxx.xxx, function(){...               *
*******************************************************************/
http.listen(3000, function(){
  console.log(ver, " Initialization sequence complete. ");
  console.log(new Date(), 'Started listening on port:3000');
});
