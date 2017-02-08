/********************************************************
 *                ONE WORD WORLD PROCESOR               *
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 1411972                                              *
 ********************************************************/


var json;
var ipJson; // for maxmind GeoLite2-City result


// middleware loading
const net = require("net");
var mysql = require("mysql");
var maxmind = require("maxmind"); // GeoLite2-City.mmdb
var Config = require("config-js"); // Da bi ucitali config.js file, moramo imati ovaj modul ???
var config = new Config("application/config/config.js");

// Pravimo konekciju na bazu podataka koristeci podatke iz config.js file
var dbcon = mysql.createPool({
    connectionLimit: config.get('sequel.conlimt'),
    host: config.get('sequel.link'),
    user: config.get('sequel.juzer'),
    password: config.get('sequel.lozinka'),
    database: config.get('sequel.baza'),
    port: config.get('sequel.prt')
});

// kreiramo konekciju na maxmind
var cityLookup = maxmind.openSync('data/maxmind/GeoLite2-City.mmdb');


// Kreiramo jednostavan server
var processor = net.createServer(function (conn) {

    // Provjeravamo da li su konekcije lokalne
    // Ukoliko nisu, gasimo konekciju

    if (conn.address().address != "127.0.0.1") {
        console.error("Address is not localhost!!! You are invaded!!!", conn.address().address);
        conn.end();
    }
    console.log("Processor: Server connected");


    // Kada se konekcija zatvori
    conn.on("end", function () {
        console.log('Processor: Server disconnected');
        conn.end();

        // ovako izgleda opcija da se procesor ubije ako postoji potreba za tim
        // conn.close();
        // End the process
        // process.exit(0);
    });

    // Rad sa podacima sa web servera
    conn.on("data", function (data) {
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
            case "newconn": {
                NewConnection(data, function (rezultat) {
                    console.log("DATA: end of NewConnection - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "eventWord": {
                InsertEventWord(data, function (rezultat) {
                    console.log("DATA: end of InsertEventWord - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "personWord": {
                InsertPersonWord(data, function (rezultat) {
                    console.log("DATA: end of InsertPersonWord - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "eventPageLoaded": {
                EventPageLoaded(data, function (rezultat) {
                    console.log("DATA: end of EventPageLoaded - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "eventCtnPageLoaded": {
                EventCntPageLoaded(data, function (rezultat) {
                    console.log("DATA: end of EventCtnPageLoaded - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "personPageLoaded": {
                PersonPageLoaded(data, function (rezultat) {
                    console.log("DATA: end of PersonPageLoaded - result: ", rezultat);
                    conn.write(rezultat);
                });

            }
                break;
            case "personCtnPageLoaded": {
                PersonCntPageLoaded(data, function (rezultat) {
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
processor.listen(3001, "localhost", function () {
    testDataBaseConnection();
    console.log(config.get('ver.proc'), "Processor is listening");
});

/////////////////////////////////////////////
//                                         //
//          RAZLICITE FUNKCIJE             //
// U nastavku su razlicite funkcije koje   //
// se koriste kod conn.on evenata na koje  //
// server slusa                            //
//                                         //
/////////////////////////////////////////////


/* ************************************************
 *           NEW CONNECTION function              *
 * What happens when the user first gets to       *
 * the website. We collect his information and    *
 * save it in the cookie, and send it here so     *
 * it can be processed at appropriate time        *
 * data is saved in tvisitor table                *
 *************************************************/
function NewConnection(data, callback) {
    var visitor = {};
    data = JSON.parse(data);
    console.log("NEWCONNECTION: Incomming message from client: %s", data.visitor.address);
    visitor = data.visitor;
    if (visitor.address != '::1'){
        ipJson = cityLookup.get(visitor.address); // data.visitor.address moscow russia: 46.188.121.120
    }else {
        visitor.address = '::ffff:24.201.206.226';
        ipJson = cityLookup.get(visitor.address);
    }

    // getting back event list top 5 and person list top 5
    // so it can be pumped in to the lists after client connects
    // for the first time, on refresh, etc.

    dbcon.getConnection(function (err, connection) {

        // Use the connection
        connection.query(config.get('ewrd.lst'), function (err, erows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: NewConnection: Event: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            connection.query(config.get('pwrd.lst'), function (err, rows) {
                if (err) {
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("Processor: NewConnection: Person: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                }
                console.log('data.visitor', visitor.address);
                connection.query(config.get('vstr.ins'),  [visitor.address, null, null], function (err, vrows) {
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: NewConnection: Visitor: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }
                    visitor.id = vrows.insertId;
                    if (!ipJson.city) {
                        connection.query(config.get('lctn.ins2'), [ipJson.country.names.en, ipJson.continent.names.en, visitor.id], function (err, rows) {
                            if (err) {
                                if (err.fatal) {
                                    throw err;
                                }
                                console.error("Processor: List: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                            }
                            console.log("Insert location ID: ", rows.insertId);
                        });
                    } else {
                        connection.query(config.get('lctn.ins1'), [ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en, visitor.id], function (err, rows) {
                            if (err) {
                                if (err.fatal) {
                                    throw err;
                                }
                                console.error("Processor: List: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                            }

                            console.log("Insert location ID: ", rows.insertId);
                        });
                    }

                    var ritrn = JSON.stringify({eventList: erows, personList: rows, visitorid : vrows.insertId});
                    callback(ritrn);
                });

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
    // ipJson = cityLookup.get('217.75.201.28');
    console.log("DATA: EventWord: Incoming message from client: %s", data.data, data.word, data.event_id, data.visitor);

    // working with database inserting new evet word
    // and getting back
    // new event list top 5
    dbcon.getConnection(function (err, connection) {
        // Use the connection
        var teword_id;
        connection.query(config.get('ewrd.ins'), [data.word, data.visitor.id, data.event_id], function (err, erows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: Insert: EventWord: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
            }
            console.log("Insert teword ID: ", erows.insertId);
            teword_id = erows.insertId;
            connection.query(config.get('ewrd.lst'), function (err, rows) {
                if (err) {
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("Processor: List: EventWord: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
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
    // ipJson = cityLookup.get('217.75.201.28');
    console.log("DATA: PersonWord: Incoming message from client: %s", data);
    // working with database inserting new evet word
    // and getting back
    // new event list top 5
    dbcon.getConnection(function (err, connection) {
        var tpword_id;
        // Use the connection
        connection.query(config.get('pwrd.ins'), [data.word, data.visitor.id, data.person_id], function (err, prows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: Insert: PersonWord: tpword ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
            }
            console.log("Processor: Insert: PersonWord: InsertID: ", prows.insertId);
            tpword_id = prows.insertId;

            connection.query(config.get('pwrd.lst'), function (err, rows) {
                if (err) {
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("Processor: List: PersonWord: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                }
                ritrn = JSON.stringify(rows);
                callback(ritrn);
            });
            connection.release();
        });

    });
}


/* **********************************************
 *     EVENT GLOBAL PAGE LOADED function         *
 * Running geolocation on the provided IP        *
 * address and saveing it in the tlocation       *
 * table. Returning list of 25 most used         *
 * words in the current event                    *
 *************************************************/
function EventPageLoaded(data, callback) {
    data = JSON.parse(data);
    ipJson = cityLookup.get(data.ip);
    console.log("DATA: EventPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('ewrd.lst'), function (err, rows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: List: EventWord: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }

            ritrn = JSON.stringify(rows);
            callback(ritrn);
        });
        connection.release();

    });
}

/* **********************************************
 *    EVENT CONTINENT PAGE LOADED function       *
 * Running geolocation on the provided IP        *
 * address and saveing it in the tlocation       *
 * table. Returning list of 25 most used         *
 * words in the current event                    *
 *************************************************/
function EventCntPageLoaded(data, callback) {
    data = JSON.parse(data);
    continents = [];
    results = [];
    ipJson = cityLookup.get(data.ip);
    console.log("DATA: EventPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('lctn.cnt'), function (err, crows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: List: EventWord: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            continents = crows;
            var item = 0;

            continents.forEach(function(cont, index, arr) {
                item++;
                var temp = [];
                console.log('index', index);
                connection.query(config.get('ewrd.lstpcnt'), [cont.continent], function (err, erows) {
                    // console.log('continent: ', cont.continent);
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: List: EventWord: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }

                    temp = {
                        cont: cont.continent,
                        ewords: erows
                    }
                    console.log('temp: ', temp);

                    results.push(temp);
                    console.log('results inside query: ', results);
                    if(index === arr.length-1) {
                        ritrn = JSON.stringify(results);
                        console.log('ritrn: ', ritrn);
                        callback(ritrn);
                    }
                })
                console.log('results inside loop: ', results);
                console.log(item);

            });
            console.log('results outside loop: ', results);
            // ritrn = JSON.stringify(results);
            // console.log('ritrn: ', ritrn);
            // callback(ritrn);
        })

        connection.release();
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
    ipJson = cityLookup.get(data.ip);
    console.log("DATA: PersonPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('pwrd.lst'), function (err, rows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: List: PersonWord: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            
            ritrn = JSON.stringify(rows);
            callback(ritrn);
        });
        connection.release();

    });
}


/* **********************************************
 *    EVENT CONTINENT PAGE LOADED function       *
 * Running geolocation on the provided IP        *
 * address and saveing it in the tlocation       *
 * table. Returning list of 25 most used         *
 * words in the current event                    *
 *************************************************/
function PersonCntPageLoaded(data, callback) {
    data = JSON.parse(data);
    continents = [];
    results = [];
    ipJson = cityLookup.get(data.ip);
    console.log("DATA: PersonPageLoaded: Response from client: %s", ipJson.country.names.en, data.data);

    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('lctn.cnt'), function (err, crows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: List: PersonWord: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            continents = crows;
            var item = 0;

            continents.forEach(function(cont, index, arr) {
                item++;
                var temp = [];
                console.log('index', index);
                connection.query(config.get('pwrd.lstpcnt'), [cont.continent], function (err, prows) {
                    // console.log('continent: ', cont.continent);
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: List: PersonWord: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }

                    temp = {
                        cont: cont.continent,
                        pwords: prows
                    }
                    console.log('temp: ', temp);

                    results.push(temp);
                    console.log('results inside query: ', results);
                    if(index === arr.length-1) {
                        ritrn = JSON.stringify(results);
                        console.log('ritrn: ', ritrn);
                        callback(ritrn);
                    }
                })
                console.log('results inside loop: ', results);
                console.log(item);

            });
            console.log('results outside loop: ', results);
        })

        connection.release();
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
    dbcon.query('SELECT 1+0 AS selection', function (err, rows) { //function (err, rows, fields)
        if (err) {
            if (err.fatal) {
                console.log("Processor: ", new Date(), 'Doslo je do prekida komunikacije sa bazom podataka');
                throw err;
            }
            console.error("Processor: ", new Date(), 'Could not connect to the db. Check if the DB is running?', err.code, err.fatal);
        } else {
            console.log("Processor: ", new Date(), 'Connection successful', rows[0].selection);
            console.log("Processor: Database is set.");
        }
    });
};


/** TODO prije deployment-a u ovom fileu
 * izmijeniti fixne ip adresse:
 * linija 125 - var fakeip = '45.57.216.254'; // socket.handshake.address;
 */