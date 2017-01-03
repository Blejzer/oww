// /* ******************************************************
//  *                ONE WORD WORLD PROCESOR               *
//  * ******************************************************
//  * Copyright (C) Nikola Kujaca - All Rights Reserved    *
//  * Unauthorized copying of this file, via any medium    *
//  * is strictly prohibited proprietary and confidential  *
//  * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
//  * 14th Nov 1972                                        *
//  ********************************************************/

// var ipInfoDB = 'a03bf41b7ef4583c8f2ce950ce24a48577649eabfe71f20bc3f4ceade99abea2';
var ver = 'owwProcesor v.0.1-alpha.20';
var json;
// var test;
var ipJson; // for maxmind GeoLite2-City result


// middleware loading
const net = require("net");
var mysql = require('mysql');
var maxmind = require('maxmind'); // GeoLite2-City.mmdb

// Pravimo konekciju na bazu podataka
var dbcon = mysql.createPool({
  connectionLimit : 10,
  host: 'mysql8.db4free.net',
  user: 'owwuser',
  password: 'myscrtW0rd',
  database : 'onewordengine',
  port     : 3307
});

// kreiramo konekciju na maxmind
var cityLookup = maxmind.openSync('data/maxmind/GeoLite2-City.mmdb');


// Create a simple server
var server = net.createServer(function (conn) {
  if(conn.address().address !="127.0.0.1"){
    console.log("Address is not localhost!!! You are invaded!!!", conn.address().address);
    conn.end();
  }
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
      console.log("DATA: should be object atributes data and ip: %s", conData.data, conData.ip);

      /* **************************************************************
      * starting cases with data requests sent to the Processor       *
      * First element (conData.data) represents navigation element    *
      * so switch will call different function to respond to          *
      * the call. Default should be unknown reqest so                 *
      * it should redirect to a new page that provides more info      *
      *************************************************************** */
      switch (conData.data) {
        case "newconn":
        {
          NewConnection(data, function(rezultat){
            console.log("DATA: end of NewConnection - result: ", rezultat);
            conn.write(rezultat);
          });

        }
          break;
          case "eventWord":
          {
            InsertEventWord(data, function(rezultat){
              console.log("DATA: end of InsertEventWord - result: ", rezultat);
              conn.write(rezultat);
            });

          }
            break;
            case "personWord":
            {
              InsertPersonWord(data, function(rezultat){
                console.log("DATA: end of InsertPersonWord - result: ", rezultat);
                conn.write(rezultat);
              });

            }
            break;
            case "eventPageLoaded":
            {
              EventPageLoaded(data, function(rezultat){
                console.log("DATA: end of EventPageLoaded - result: ", rezultat);
                conn.write(rezultat);
              });

            }
            break;
            case "personPageLoaded":
            {
              PersonPageLoaded(data, function(rezultat){
                console.log("DATA: end of PersonPageLoaded - result: ", rezultat);
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

  // getting back event list top 5 and person list top 5
  // so it can be pumped in to the lists after client connects
  // for the first time, on refresh, etc.

  dbcon.getConnection(function(err, connection) {

    // Use the connection
    connection.query('SELECT eword a, COUNT(eword) c FROM teword GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error("Processor: NewConnection: Event: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
      }
      eventList = rows;
      connection.query('SELECT pword a, COUNT(pword) c FROM tpword GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: NewConnection: Person: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        personList = rows;
        var ritrn = JSON.stringify({eventList, personList});
        callback(ritrn);
      });
      connection.release();
    });

  });

}

/* **********************************************
*         INSERT EVENT WORD function            *
* Preparing all gathered information and add    *
* geolocation of the IP address and save it     *
* to the tevent and tlocation databases         *
* = to add tlink information from row.insertId  *
* from both previous inserts.                   *
*************************************************/
function InsertEventWord(data, callback) {
  data = JSON.parse(data);
  ipJson = cityLookup.get('217.75.201.28');
  console.log("DATA: Event: Response from client: %s", ipJson.country.names.en, data.data, data.word, data.event_id);

  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {
    // Use the connection
      var teword_id;
    connection.query( 'INSERT INTO teword (eword, ip, event_id) VALUES(?, ?, ?);', [data.word, data.ip, data.event_id], function(err, rows) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error("Processor: Insert: Event: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
      };
        console.log("Insert teword ID: ", rows.insertId);
        teword_id = rows.insertId;
      if(!ipJson.city){
        connection.query('INSERT INTO `tlocation`(`country`, `continent`, `eword_id`) VALUES (?,?,?)', [ipJson.country.names.en, ipJson.continent.names.en, teword_id.valueOf()], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: Event: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }else {
        connection.query('INSERT INTO tlocation (city, country, continent, eword_id) VALUES(?,?,?,?)', [ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en, teword_id], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: Event: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }

          console.log("Insert location ID: ", rows.insertId);
        });
      }

      connection.query('SELECT eword a, COUNT(eword) c FROM teword GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: List: Event: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        ritrn = JSON.stringify(rows);
        callback(ritrn);
      });
    connection.release();
    });

  });
}

/* **********************************************
*       INSERT PERSON WORD function             *
* Preparing all gathered information and add    *
* geolocation of the IP address and save it     *
* to the tperson and tlocation databases        *
* = to add tlink information from row.insertId  *
* from both previous inserts.                   *
*************************************************/
function InsertPersonWord(data, callback) {
  data = JSON.parse(data);
  ipJson = cityLookup.get('217.75.201.28');
  console.log("DATA: Person: Response from client: %s", ipJson.country.names.en, data.data, data.word);
  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {
      var tpword_id;
    // Use the connection
    connection.query( 'INSERT INTO tperson (pword, ip, person_id) VALUES(?,?,?);', [data.word, data.ip, data.person_id], function(err, rows) {
      if (err) {
        if(err.fatal){
        throw err;
        }
        console.error("Processor: Insert: Person: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
      };
      tpword_id = rows.insertId;

      if(!ipJson.city){
        connection.query('INSERT INTO tlocation (`country`, `continent`, `pword_id`) VALUES (?,?,?)', [ipJson.country.names.en, ipJson.continent.names.en, tpword_id], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: Person: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }else {
        connection.query('INSERT INTO tlocation (city, country, continent, pword_id) VALUES(?,?,?,?)', [ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en, tpword_id], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: Person: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }
      connection.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: List: Person: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        ritrn = JSON.stringify(rows);
        callback(ritrn);
      });
    connection.release();
    });

  });
}


/* **********************************************
*         EVENT PAGE LOADED function            *
* Running geolocation on the provided IP        *
* address and saveing it in the tlocation       *
* table. Returning list of 25 most used         *
* words in the current event                    *
*************************************************/
function EventPageLoaded(data, callback) {
  data = JSON.parse(data);
  ipJson = cityLookup.get('217.75.201.28');
  console.log("DATA: EventPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {
    // Use the connection
      if(!ipJson.city){
        connection.query('INSERT INTO tlocation (ip, city, country, continent) VALUES(?,?,?,?)', [data.ip, null, ipJson.country.names.en, ipJson.continent.names.en], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: EventPageLoaded: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }else {
        connection.query('INSERT INTO tlocation (ip, city, country, continent) VALUES(?,?,?,?)', [data.ip, ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: EventPageLoaded: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }

      connection.query('SELECT eword a, COUNT(eword) c FROM tevent GROUP BY eword ORDER BY c DESC LIMIT 25', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: List: EventPageLoaded: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        ritrn = JSON.stringify(rows);
        callback(ritrn);

      connection.release();
      });

  });
}


/* **********************************************
*        PERSON PAGE LOADED function            *
* Running geolocation on the provided IP        *
* address and saveing it in the tlocation       *
* table. Returning list of 25 most used         *
* words in the current person                   *
*************************************************/
function PersonPageLoaded(data, callback) {
  data = JSON.parse(data);
  ipJson = cityLookup.get('217.75.201.28');
  console.log("DATA: PersonPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

  // working with database inserting new evet word
  // and getting back
  // new event list top 5
  dbcon.getConnection(function(err, connection) {
    // Use the connection
      if(!ipJson.city){
        connection.query('INSERT INTO tlocation (ip, city, country, continent) VALUES(?,?,?,?)', [data.ip, null, ipJson.country.names.en, ipJson.continent.names.en], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: PersonPageLoaded: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }else {
        connection.query('INSERT INTO tlocation (ip, city, country, continent) VALUES(?,?,?,?)', [data.ip, ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en], function (err, rows) {
          if (err) {
            if(err.fatal){
            throw err;
            }
            console.error("Processor: List: PersonPageLoaded: ",new Date(), 'Error executing code on the db. Check if the DB is running?', err.code, err.fatal);
          }
          console.log("Insert location ID: ", rows.insertId);
        });
      }

      connection.query('SELECT pword a, COUNT(pword) c FROM tperson GROUP BY pword ORDER BY c DESC LIMIT 25', function (err, rows) {
        if (err) {
          if(err.fatal){
          throw err;
          }
          console.error("Processor: List: PersonPageLoaded: ",new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        }
        ritrn = JSON.stringify(rows);
        callback(ritrn);

      connection.release();
      });

  });
}

/* **********************************************
*      TEST DATABASE CONNECTION function        *
* Incomplete function                           *
* Main purpose is to check connection to        *
* the database and return result of the         *
* connection. NOT IMPLEMENTED is the option to  *
* on fail try to reconnect to the database      *
*************************************************/
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
