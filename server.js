var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



// Routing i landing page
app.use('/bootstrap', express.static('bootstrap'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/application', express.static('application'));

app.use('/views', express.static('views'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

// Pravimo konekciju na bazu podataka
var mysql = require('mysql')
var dbcon = mysql.createConnection({
  host: 'localhost',
  user: 'owwuser',
  password: 'myscrtW0rd',
  database : 'oneword'
})
var json;
// dbcon.connect()
var connection = false;
var connCounter = 0;
var errorMsg;
testDbConn();

function testDbConn() {
  var connCounter = 0;
  dbcon.connect()
  dbcon.query('SELECT 1+0 AS selection', function (err, rows, fields) {
    if (err) {
      console.error('Could not connect to the db. Check if the DB is running?', err);
      throw err;
    }
      console.log('Connection successful', rows[0].selection);
    });
  };

// Brojac korisnika online:
var brojacKorisnika = 0;
var room = ['person', 'event']
console.log(brojacKorisnika);

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
  console.log("Broj trenutnih korisnika: ", brojacKorisnika);
  io.emit('newconn', brojacKorisnika);

  setTimeout(function(){}, 2000);
  dbcon.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
    if (err) {
      throw err
    }
    json = JSON.stringify(rows);
    console.log(json);
    setTimeout(function(){}, 2000);
    io.emit('eventList', json);
  });
  dbcon.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
    if (err) {
      throw err
    }
    json = JSON.stringify(rows);
    console.log(json);
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
        var d = new Date();
        throw err
      };
      console.log('result of insert is: ', rows)
    });
    // Emitujemo klijentu izmjenu na event
  	io.emit('eventWord', word);
    dbcon.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
      if (err) {
        throw err
      }
      json = JSON.stringify(rows);
      console.log(json);
      io.emit('eventList', json);
    });
  });

  socket.on('person', function (newroom, personWord) {
    var word = personWord;
    console.log("Registrujem person socket ", word);
    dbcon.query('INSERT INTO tperson (pword) VALUES(?);', word, function (err, rows, fields) {
      if (err){
        throw err
      };
    });
    // Emitujemo klijentu izmjenu na person
  	io.emit('personWord', personWord);
    dbcon.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows, fields) {
      if (err) {
        throw err
      }
      json = JSON.stringify(rows);
      console.log(json);
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
    console.log("Broj trenutnih korisnika: ", brojacKorisnika);
    socket.leave(socket.room);
    io.emit('newconn', brojacKorisnika);
    //dbcon.end();
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
