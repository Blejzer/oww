/********************************************************
 *                ONE WORD WORLD SERVER                 *
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <www.bdslab.info>,          *
 * 1411972                                              *
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
var multer = require('multer')
// var upload = multer({ dest: 'images/upload/' })
var bodyParser = require('body-parser');
var filename;


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
app.use('/bootstrap', express.static('bootstrap'));
app.use('/scripts', express.static('node_modules/'));
app.use('/custom', express.static('custom'));
app.use('/images', express.static('images'));
app.use('/application', express.static('application'));
app.use('/views', express.static('views'));
app.use('/.well-known', express.static('/.well-known'));
console.log("All static routes are set");
console.log("*********************************************************************\n");

// serving index page on connection
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


console.log("index.html page prepped to be served");
console.log("*********************************************************************\n");

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("setting up destination");
        cb(null, 'images/upload');
    },
    filename: function (req, file, cb) {
        console.log("setting up filename");
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
console.log("File upload destination set to: /images/upload");
console.log("*********************************************************************\n");

var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/newevent', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    });
});
console.log("multer settings set!");
console.log("*********************************************************************\n");

// cross origin requests - required for image upload!
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());


console.log("cross origin request permited");
console.log("*********************************************************************\n");

console.log("*********************************************************************\n");
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
io.sockets.on('connection', function (socket) {
    socket.removeAllListeners();
    var fakeip = socket.handshake.address;
    console.log(new Date(), "Client IP Address - assuming remote: socket.handshake.address: ", fakeip);

    var visitor = {};
    visitor.address = fakeip;
    var data = {"data": "newconn", "visitor": visitor};
    jack = JSON.stringify(data);

    // Create a socket (client) that connects to the processor
    var procSocket = new net.Socket();

    // if connection is not successful
    procSocket.on('error', function (error) {
        console.error(new Date(), "Error connecting to the processor. shutting down the server...", error);
        procSocket.end();
        process.exit(0);
    });

    // if connection is successful
    procSocket.connect(3001, "localhost", function () {
        // console.log(new Date(), "Server: Connected to processor");
        procSocket.write(jack);
    });

    // passing data to the processor
    procSocket.on("data", function (data) {
        // console.log(new Date(), "Server: Response from the processor: %s", data);
        var lists = JSON.parse(data);

        socket.emit('test', lists.event[0], lists.person[0]);


        visitor.id = lists.visitorid;

        io.sockets.emit('conn', io.engine.clientsCount);

        io.emit("eventList", JSON.stringify(lists.eventList));
        io.emit("personList", JSON.stringify(lists.personList));

        procSocket.end();
    });

    //
    socket.on('disconnect', function () {
        console.log(new Date(), "Diskonekcija: Broj trenutnih korisnika: ", io.engine.clientsCount);
        // console.log(socket.list());
        io.sockets.emit('conn', io.engine.clientsCount);
        socket.removeAllListeners();
        socket.leaveAll();
    });


    // *********************************************************************
    // Socket u slucaju kada korisnik unese rijec u Event polje
    // pakuje ga i proslijedjuje ga Processoru na obradu i ceka povratnu
    // informaciju o uspjesnosti i listi eventList
    // *********************************************************************
    socket.on('event', function (newroom, eventWord, event_id) {

        console.log(new Date(), "Registrujem event socket ", event_id);
        var data = {"data": "eventWord", "visitor": visitor, "word": eventWord, "event_id": event_id};
        jack = JSON.stringify(data);

        // Create a socket (client) that connects to the server
        var procSocket = new net.Socket();
        procSocket.connect(3001, "localhost", function () {
            console.log(new Date(), "Server: eword: Connected to processor", jack);
            procSocket.write(jack);
        });
        // Emitujemo klijentu izmjenu na event
        io.emit('eventWord', eventWord);

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            console.log('data: ', list);
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

        // console.log(new Date(), "Registrujem person socket ", personWord);

        var data = {"data": "personWord", "visitor": visitor, "word": personWord, "person_id": person_id};
        jack = JSON.stringify(data);

        // Create a socket (client) that connects to the server
        var procSocket = new net.Socket();
        procSocket.connect(3001, "localhost", function () {
            console.log("Server: pword: Connected to processor", jack);
            procSocket.write(jack);
        });
        // Emitujemo klijentu izmjenu na event
        io.emit('personWord', personWord);

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            io.emit('personList', JSON.stringify(list));
            procSocket.end();
        });
    });

   // *********************************************************************
    // Socket u slucaju kada korisnik otvori stranicu Results -> Person
    // pa je potrebno dostaviti duzi spisak rijeci po nekoj
    // kvalifikaciji
    // *********************************************************************
    socket.on('newPersonPageLoaded', function (person_id) {

        console.log("Registrujem personPageLoaded socket ", person_id);
        // *********************************************************************
        var data = {"data": "newPersonPageLoaded", "person_id" : person_id}; // "ip": fakeip,
        jack = JSON.stringify(data);

        // Create a socket (client) that connects to the server
        var procSocket = new net.Socket();
        procSocket.connect(3001, "localhost", function () {
            console.log("Client: newPersonPageLoaded: Connected to server");
            procSocket.write(jack);
        });
        // Emitujemo klijentu izmjenu na event
        // io.emit('eventWord', eventWord);

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            socket.emit('personCtnPageSuccess', list[1].continent);
            socket.emit('personPageSuccess', list[0].global);
            procSocket.end();
        });
    });

    // *********************************************************************
    // Socket u slucaju kada korisnik otvori stranicu Results -> Person
    // pa je potrebno dostaviti duzi spisak rijeci po nekoj
    // kvalifikaciji
    // *********************************************************************
    socket.on('newEventPageLoaded', function (event_id) {

        console.log("Registrujem newEventPageLoaded socket ", event_id);
        // *********************************************************************
        var data = {"data": "newEventPageLoaded", "event_id" : event_id}; // "ip": fakeip,
        jack = JSON.stringify(data);

        // Create a socket (client) that connects to the server
        var procSocket = new net.Socket();
        procSocket.connect(3001, "localhost", function () {
            console.log("Server: newEventPageLoaded: Connected to Processor");
            procSocket.write(jack);
        });

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            console.log("list", list);
            console.log("list[0]", list[0]);
            console.log("test",list[0].global);
            console.log("list[1]", list[1].continent);
            socket.emit('eventCtnPageSuccess', list[1].continent);
            socket.emit('eventPageSuccess', list[0].global);
            procSocket.end();
        });
    });

});



/* ****************************************************************
 * Palimo server na portu 3000. Ovo je dev verzija. za produkciju  *
 * potrebno je unijeti i IP adresu na kojoj ce server slusati      *
 * http.listen(3000, xxx.xxx.xxx.xxx, function(){...               *
 *******************************************************************/
http.listen(80, function () {
    console.log(ver, " Initialization sequence complete. ");
    console.log(new Date(), 'Started listening on port:80');
});


/** TODO prije deployment-a u ovom fileu
 * izmijeniti fixne ip adresse:
 * linija 118 - var fakeip = '45.57.216.254'; // socket.handshake.address;
 */