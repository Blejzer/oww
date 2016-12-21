// /* ******************************************************
//  *                ONE WORD WORLD PROCESOR               *
//  * ******************************************************
//  * Copyright (C) Nikola Kujaca - All Rights Reserved    *
//  * Unauthorized copying of this file, via any medium    *
//  * is strictly prohibited proprietary and confidential  *
//  * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
//  * 14th Nov 1972                                        *
//  ********************************************************/
var ver = 'owwProcesor v.0.0.10';
var json;
var test;

// middleware loading
const net = require("net");
var mysql = require('mysql');

// Pravimo konekciju na bazu podataka
var dbcon = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  user: 'owwuser',
  password: 'myscrtW0rd',
  database : 'oneword',
  port     : 3306
});

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Processor: Client connected");
    // Let's response with a hello message
    // conn.write(
    //     JSON.stringify(
    //         { response: "Hey there client!" }
    //     )
    // );

    // If connection is closed
    conn.on("end", function() {
        console.log('Server: Client disconnected');
        conn.end();
        // Close the server
        // server.close();
        // End the process
        // process.exit(0);
    });

    // Handle data from client
    conn.on("data", function(data) {
      console.log("DATA: should be json: %s", data);
      var conData = JSON.parse(data);
      var jsonResponse;
      console.log("DATA: should be object atributes data and ip: %s", conData.data, conData.ip);
      switch (conData.data) {
        case "newconn":
        {
          NewConnection(data, function(rezultat){
            console.log("DATA: end of ConnectMe - result", rezultat);
            conn.write(rezultat);
          });

        }
          break;
        default:

      }

    });
  });


// Listen for connections
server.listen(3001, "localhost", function () {
    testDataBaseConnection();
    console.log(ver, "Server: Listening");
});



/////////////////////////////////////////////
//                                         //
//          RAZLICITE FUNKCIJE             //
// U nastavku su razlicite funkcije koje   //
// se koriste kod conn.on evenata na koje  //
// server slusa                            //
//                                         //
/////////////////////////////////////////////

function NewConnection(data, callback) {
  data = JSON.parse(data);
  console.log("NEWCONNECTION: Response from client: %s", data.ip);

  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {

    // Use the connection
    connection.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error("Processor: Person: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
      }
      eventList = rows;
      connection.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: Person: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        personList = rows;
        var ritrn = JSON.stringify({eventList, personList});
        callback(ritrn);
      });
      connection.release();
    });

  });
}

function InsertEventWord(data) {
  data = JSON.parse(data);
  console.log("DATA: Response from client: %s", data);

  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {
    // Use the connection
    connection.query( 'INSERT INTO tevent (eword) VALUES(?);', data.word, function(err, rows) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error("Processor: Insert: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
      };
      // console.log("rows: ", rows.insertId);
      // Don't use the connection here, it has been returned to the pool.
      connection.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: Event: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        test = JSON.stringify(rows);
        //console.log("Processor: ","Sad da vidimo da li je uradjen json: ", test);
        //var check =
        conn.write(
          JSON.stringify(test)
        );
        // console.log(check);
      });
    connection.release();
    });

  });
}
// Provjeravamo konekciju prema bazi:
function testDataBaseConnection() {
  dbcon.query('SELECT 1+0 AS selection', function (err, rows, fields) {
    if (err) {
      if(err.fatal){
        console.log("Processor: ",new Date(), 'Doslo je do prekida komunikacije sa bazom podataka');
        throw err;
      }
      console.error("Processor: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
    }else{
      console.log("Processor: ",new Date(), 'Connection successful', rows[0].selection);
      console.log("Processor: Database is set.");
    }
  });
};
