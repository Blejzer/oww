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
var ver = 'owwServer v.0.8-beta.20f';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');
var eventList;
var personList;
const net = require("net");
// var multer = require('multer')
var bodyParser = require('body-parser');


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
app.use('/bootstrap', express['static'](__dirname+'/bootstrap'));
app.use('/scripts', express['static'](__dirname+'/node_modules/'));
app.use('/custom', express['static'](__dirname+'/custom'));
app.use('/images', express['static'](__dirname+'/images'));
app.use('/application', express['static'](__dirname+'/application'));
app.use('/views', express['static'](__dirname+'/views'));
app.use('/.well-known', express['static']('/.well-known'));
app.set('view engine', 'ejs'); // set up ejs for templating

console.log("All static routes are set");
console.log("*********************************************************************\n");


// Serving event sharing
app.get('/sociale', function (req, res) {
    var str = req.headers['user-agent'];
    console.log('This is SOCIALE req.url: ', req.url);
    var fakeip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(new Date(), "Client IP Address - assuming remote: socket.handshake.address: ", fakeip);
    const regexList = [/facebookexternalhit\/[0-9]/, /Faceboot/, /Twitterbot\/[0-9]/];
    const isMatch = regexList.some(function(rx) { return rx.test(str); });
    console.log('User-Agent: ' + str);
    console.log('isMatch: ', isMatch);

    if(!isMatch){
        console.log ("FB or Twitter visitor: Redirecting...");
        res.redirect('/');
    }else {
        console.log('serving bots');

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
            console.log(new Date(), "Server: Connected to processor");
            procSocket.write(jack);
        });

        // passing data to the processor
        procSocket.on("data", function (data) {
            var lists = JSON.parse(data);
            lists.num = io.engine.clientsCount;
            console.log(new Date(), "Server: Response from the processor: %s", lists.event[0]);

            res.render('social/event.ejs', {'event': lists.event[0]}, function (err, html) {
                res.send(html);
            });

            visitor.id = lists.visitorid;

            procSocket.end();
        });
    }

});
// Serving person sharing
app.get('/socialp', function (req, res) {
    var str = req.headers['user-agent'];
    console.log('This is SOCIALP req.url: ', req.url);
    var fakeip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(new Date(), "Client IP Address - assuming remote: socket.handshake.address: ", fakeip);
    const regexList = [/facebookexternalhit\/[0-9]/, /Faceboot/, /Twitterbot\/[0-9]/];
    const isMatch = regexList.some(function(rx) { return rx.test(str); });
    console.log('User-Agent: ' + str);
    console.log('isMatch: ', isMatch);

    if(!isMatch){
        console.log ("FB or Twitter visitor: Redirecting...");
        res.redirect('/');
    }else {
        console.log('serving bots');

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
            console.log(new Date(), "Server: Connected to processor");
            procSocket.write(jack);
        });

        // passing data to the processor
        procSocket.on("data", function (data) {
            var lists = JSON.parse(data);
            lists.num = io.engine.clientsCount;
            console.log(new Date(), "Server: Response from the processor: %s", lists.person[0]);

            res.render('social/person.ejs', {'event': lists.person[0]});


            visitor.id = lists.visitorid;


            procSocket.end();
        });
    }

});




// serving index page on connection
// unless it is bot
// then we are serving cashed index.html
app.get('/home', function (req, res) {
    var str = req.headers['user-agent'];
    console.log('This is HOME req.url: ', req.url);
    var fakeip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
        console.log(new Date(), "Server: Connected to processor");
        procSocket.write(jack);
    });

    // passing data to the processor
    procSocket.on("data", function (data) {
        var lists = JSON.parse(data);
        lists.num = io.engine.clientsCount;
        console.log(new Date(), "Server: Response from the processor: %s", lists.event[0]);
        res.send(lists);
        // socket.emit('test', lists.event[0], lists.person[0]);


        visitor.id = lists.visitorid;

        // io.sockets.emit('conn', io.engine.clientsCount);

        // io.emit("eventList", JSON.stringify(lists.eventList));
        // io.emit("personList", JSON.stringify(lists.personList));


        procSocket.end();
    });

});

app.get('*', function (req, res) {
    console.log('req.headers', req.headers);
    var str = req.headers['user-agent'];
    console.log('This is * req.url: ', req.url);
    const regexList = [/person/, /event/];
    const isMatch = regexList.some(function(rx) { return rx.test(req.url); });
    console.log('isMatch: ', isMatch);
    if(isMatch){
        res.redirect('/');
    }else{

        res.sendFile(__dirname + '/views/index.html');

    }


});

console.log("index.html page prepped to be served");
console.log("*********************************************************************\n");

console.log("*********************************************************************\n");
console.log("I guess we're all set.");
console.log("*********************************************************************\n");
console.log(ver, " is online and ready!");
console.log("*********************************************************************\n");


/* ******************************************************
 * Kreiranje socketa prilikom konekcije klijenta na     *
 * server. Kupimo IP adresu, povecavamo broj online     *
 * korisnika i emitujemo svima osvjezenu informacije:   *
 * broj korisnika, event, person.                       *
 ********************************************************/
io.sockets.on('connection', function (socket) {
    socket.removeAllListeners();
    var fakeip = socket.handshake.address;
    var nowDate = new Date();
    console.log(nowDate, "Client IP Address - assuming remote: socket.handshake.address: ", fakeip);

    var visitor = {};
    visitor.address = fakeip;
    visitor.nowDate = nowDate;
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
        console.log(new Date(), "Diskonekcija: Broj trenutnih korisnika: ", io.engine.clientsCount); // this is just a test
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
            console.log("Server: newPersonPageLoaded: Connected to Processor");
            procSocket.write(jack);
        });
        // Emitujemo klijentu izmjenu na event
        // io.emit('eventWord', eventWord);

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            var list = JSON.parse(data);
            console.log("list", list);
            console.log("list[0]", list[0]);
            console.log("test",list[0].global);
            console.log("list[1]", list[1].continent);
            socket.emit('personCtnPageSuccess', list[1].continent);
            socket.emit('personPageSuccess', list[0].global);
            procSocket.end();
        });
    });

    // *********************************************************************
    // Socket u slucaju kada korisnik otvori stranicu Results -> Event
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
            console.log("newEventPageLoaded list: ", list);
            console.log("newEventPageLoaded list[0]: ", list[0]);
            console.log("test",list[0].global);
            console.log("list[1]", list[1].continent);
            socket.emit('eventCtnPageSuccess', list[1].continent);
            socket.emit('eventPageSuccess', list[0].global);
            procSocket.end();
        });
    });




    // *********************************************************************
    // Socket u slucaju kada korisnik otvori stranicu Results -> Event
    // pa je potrebno dostaviti duzi spisak rijeci po nekoj
    // kvalifikaciji
    // *********************************************************************
    socket.on('checkarchive', function (type, week) {

        console.log("Registrujem checkarchive socket ", type, week);
        // *********************************************************************
        var data = {"data": type, "week" : week}; // "ip": fakeip,
        jack = JSON.stringify(data);

        // Create a socket (client) that connects to the server
        var procSocket = new net.Socket();
        procSocket.connect(3001, "localhost", function () {
            console.log("Server: checkarchive: Connected to Processor");
            procSocket.write(jack);
        });

        // Cekamo odgovor sa procesora i osvjezenu event listu
        procSocket.on("data", function (data) {
            var list = JSON.parse(data);
            console.log("checkarchive list: ", list);
            socket.emit('checkOK', JSON.stringify(list));
            console.log('checkOK emitted! ', list);
            procSocket.end();
        });
    });

});



/* *****************************************************************
 *                  Palimo server na portu 80.                     *
 * *****************************************************************/
http.listen(8088, function () {
    console.log(ver, " Initialization sequence complete. ");
    console.log(new Date(), 'Started listening on port:80');
});


/** TODO prije deployment-a u ovom fileu
 * izmijeniti fixne ip adresse:
 * linija 118 - var fakeip = '45.57.216.254'; // socket.handshake.address;
 */