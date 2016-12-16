/* ******************************************************
 *                ONE WORD WORLD SERVER
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 14th Nov 1972                                        *
 ********************************************************/
var ver = 'owwServer v.0.0.10';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
console.log(new Date());
console.log("loaded all required modules");

// Routing i landing page
app.use('/bootstrap', express.static('bootstrap'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/application', express.static('application'));

app.use('/views', express.static('views'));
app.get('/', function(req, res){
  var ip = req.headers['x-forwarded-for'];
  var ip1 = req.connection.remoteAddress;
  var ip2 = req.headers['x-real-ip'];
  var ip3 = req.ip;
  console.log('User-Agent: ' + ip, ip1, ip2, ip3);
  res.sendFile(__dirname + '/views/index.html');
});
console.log("all routes are set");

// Pravimo konekciju na bazu podataka
var mysql = require('mysql')
var dbcon = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'owwuser',
  password: 'myscrtW0rd',
  database : 'oneword',
  port     : 3306

});
// var dbcon  = require('./middleware/oowdb.js');

var json;


dbcon.query('SELECT 1+0 AS selection', function (err, rows, fields) {
  if (err) {
    if(err.fatal){
      console.log(new Date(), 'Doslo je do prekida komunikacije sa bazom podataka');
      throw err;
    }
    console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

  }else{
    console.log(new Date(), 'Connection successful', dbcon.threadId);
    console.log("Database is set.");
  }
});

  console.log("I guess we're all set.");
  console.log("----------------------");
  console.log(ver, " is online and ready!");

// Brojac korisnika online:
var brojacKorisnika = 0;
var room = ['person', 'event']

io.sockets.on('connection', function (socket) {

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

  setTimeout(function(){}, 2000);
  dbcon.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
    if (err) {
      throw err
    }
    json = JSON.stringify(rows);
    // console.log(json);
    setTimeout(function(){}, 2000);
    io.emit('eventList', json);
  });
  dbcon.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 6', function (err, rows, fields) {
    if (err) {
      if(err.fatal){
      throw err;
      }
      console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

    }
    json = JSON.stringify(rows);
    // console.log(json);
    io.emit('personList', json);
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
    var word = eventWord;
    console.log("Registrujem event socket ", word);
    dbcon.query('INSERT INTO tevent (eword) VALUES(?);', word, function (err, rows, fields) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

      };
      // console.log('result of insert is: ', rows)
    });
    // Emitujemo klijentu izmjenu na event
  	io.emit('eventWord', word);
    dbcon.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

      }
      json = JSON.stringify(rows);
      // console.log(json);
      io.emit('eventList', json);
    });
  });

  socket.on('person', function (newroom, personWord) {
    var word = personWord;
    console.log("Registrujem person socket ", word);
    dbcon.query('INSERT INTO tperson (pword) VALUES(?);', word, function (err, rows, fields) {
      if (err){
        if(err.fatal){
        throw err;
        }
        console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

      };
    });
    // Emitujemo klijentu izmjenu na person
  	io.emit('personWord', personWord);
    dbcon.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 6', function (err, rows, fields) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error(new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);

      }
      json = JSON.stringify(rows);
      // console.log(json);
      io.emit('personList', json);
    });
  });

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
