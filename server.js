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
dbcon.connect()
dbcon.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('Connection is successful: ', rows[0].solution)
})

// mysql queries

var pInsert1 = "INSERT INTO tperson (pword) VALUES('";
var pInsert3 = "');";
var eInsert1 = "INSERT INTO tevent (eword) VALUES('";
var eInsert3 = "');";



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
    dbcon.query(eInsert1+word+eInsert3, function (err, rows, fields) {
      if (err) {
        var d = new Date();
        throw err
      };
      console.log('result of insert is: ', rows)
    });
    // Emitujemo klijentu izmjenu na event
  	io.emit('eventWord', word);
  });

  socket.on('person', function (newroom, personWord) {
    var word = personWord;
    console.log("Registrujem person socket ", word);
    dbcon.query(pInsert1+word+pInsert3, function (err, rows, fields) {
      if (err) throw err

      console.log('result of insert is: ', rows)
    });
    // Emitujemo klijentu izmjenu na person
  	io.emit('personWord', personWord);
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
    dbcon.end();
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
