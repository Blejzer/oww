/********************************************************
 *                ONE WORD WORLD PROCESSOR              *
 * ******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <www.bdslab.info>,          *
 * 1411972                                              *
 ********************************************************/

var json;
var ipJson; // for maxmind GeoLite2-City result

// middleware loading
const net = require("net");
var mysql = require("mysql");
var maxmind = require("maxmind"); // GeoLite2-City.mmdb
var Config = require("config-js"); // Da bi ucitali config.js file, moramo imati ovaj modul ???
var config = new Config(__dirname+ "/application/config/config.js");
var dotenv = require("dotenv"); // Environment variables

// const { error } = dotenv.config({ path: "/home/deploy/www/worldsword.com/current/" });

// var myError = dotenv.config({path: "/Volumes/Projects/Internal/onewordworld/.env"});
//
// if (myError.error) {
//     throw myError.error
// }

// Pravimo konekciju na bazu podataka koristeci podatke iz config.js file
var dbcon = mysql.createPool({
    connectionLimit: process.env.DB_VAR_CONN,
    host: process.env.DB_VAR_LINK,
    user: process.env.DB_VAR_JUZER,
    password: process.env.DB_VAR_LOZINKA,
    database: process.env.DB_VAR_BAZA,
    port: process.env.DB_VAR_PORT
});

// kreiramo konekciju na maxmind
var cityLookup = maxmind.openSync(__dirname+'/data/maxmind/GeoLite2-City.mmdb');

// Kreiramo jednostavan server
var processor = net.createServer(function (conn) {

    // Provjeravamo da li su konekcije lokalne
    // Ukoliko nisu, gasimo konekciju

    if (conn.address().address != "127.0.0.1") {
        console.error(new Date(), "Address is not localhost!!! You are invaded!!!", conn.address().address);
        console.error("Processor: Performing immediate security shutdown.");
        conn.end();
    }



    // Kada se konekcija zatvori
    conn.on("end", function () {
        console.log(new Date(), 'Processor: Server disconnected');
        conn.end();
    });

    // Rad sa podacima sa web servera
    conn.on("data", function (data) {
        var conData = JSON.parse(data);
        console.log(new Date(), "DATA: should be json: %s", conData);

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
                    conn.write(rezultat);
                });

            }
                break;
            case "eventWord": {
                InsertEventWord(data, function (rezultat) {
                    conn.write(rezultat);
                });

            }
                break;

            case "personWord": {
                InsertPersonWord(data, function (rezultat) {
                    conn.write(rezultat);
                });
            }
                break;

            case "newPersonPageLoaded": {
                var rezultati = [];

                function pushToAry(name, val) {
                    var obj = {};
                    obj[name] = val;
                    rezultati.push(obj);
                }

                PersonPageLoaded(data, function (rezultatg) {

                    PersonCntPageLoaded(data, function (rezultatc) {

                        pushToAry('global', rezultatg);
                        pushToAry('continent', rezultatc);
                        // rezultati.push(['continent'],rezultatc);
                        conn.write(JSON.stringify(rezultati));

                    })
                });


            }
                break;

            case "person": {
                CheckEventID(data, function (rezultat) {
                    console.log('rezultat: ', rezultat);
                    conn.write(rezultat);
                });
            }
                break;

            case "event": {
                CheckEventID(data, function (rezultat) {
                    console.log('rezultat: ', rezultat);
                    conn.write(rezultat);
                });
            }
                break;

            case "newEventPageLoaded": {
                var rezultati = [];
                function pushToAry(name, val) {
                    var obj = {};
                    obj[name] = val;
                    rezultati.push(obj);
                }

                EventPageLoaded(data, function (rezultatg) {
                    console.log("DATA: newEventPageLoaded: end of EventPageLoaded - result: ", rezultatg);

                    EventCntPageLoaded(data, function (rezultatc) {
                        console.log("DATA: newEventPageLoaded: end of EventCntPageLoaded - result: ", rezultatc);

                        pushToAry('global', rezultatg);
                        pushToAry('continent', rezultatc);
                        conn.write(JSON.stringify(rezultati));

                    });
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
    console.log(config.get('ver.proc'), "Processor is listening and Database is online!");
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

    var moment = require('moment');
    var week = moment().format('YYYYWW');

    data = JSON.parse(data);
    console.log(new Date(), "NEWCONNECTION: Incomming message from server.js: %s", data.visitor.address);
    visitor = data.visitor;
    if ((visitor.address !== '::1') && (visitor.address !== '::ffff:127.0.0.1') && (visitor.address !=='fe80::1')){
        ipJson = cityLookup.get(visitor.address);
        console.log('pronadjena adresa izgleda ovako: ', ipJson.country.names.en);
    }else {
        visitor.address = '::ffff:24.201.206.226';
        ipJson = cityLookup.get(visitor.address);
        console.log(new Date(), 'Failed IP address lookup. Using fake ::ffff:24.201.206.226: ', visitor.address);
    }


    /*  getting back event list top 5 and person list *
     * top 5 so it can be pumped in to the lists     *
     * after client connects for the first time,     *
     * on refresh, etc.                              */
    dbcon.getConnection(function (err, connection) {

        // Use the connection
        connection.query(config.get('prsn.cur'), week, function (err,prsn) {
            if(err){
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: NewConnection: Event: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            // console.log('prsn', prsn[0].person_id);
            connection.query(config.get('evnt.cur'), week, function (err, wrows) {
                if(err){
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("Processor: NewConnection: Event: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                }
                // console.log('wrows', wrows[0].event_id);
                connection.query(config.get('ewrd.lst'), wrows[0].event_id, function (err, erows) {
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: NewConnection: Event: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }
                    connection.query(config.get('pwrd.lst'), prsn[0].person_id, function (err, prows) {
                        if (err) {
                            if (err.fatal) {
                                throw err;
                            }
                            console.error("Processor: NewConnection: Person: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                        }
                        // console.log('data.visitor', visitor.address);
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
                                        console.error("Processor: List: Insert location without city: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                                    }
                                    // console.log("Insert location ID: ", rows.insertId);
                                    visitor.location = rows.insertId;
                                });
                            } else {
                                connection.query(config.get('lctn.ins1'), [ipJson.city.names.en, ipJson.country.names.en, ipJson.continent.names.en, visitor.id], function (err, rows) {
                                    if (err) {
                                        if (err.fatal) {
                                            throw err;
                                        }
                                        console.error("Processor: List: Insert location with city: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                                    }

                                    // console.log("Insert location ID: ", rows.insertId);
                                    visitor.location = rows.insertId;
                                });
                            }
                            var ritrn = JSON.stringify({eventList: erows, personList: prows, visitorid : vrows.insertId, event : wrows, person : prsn, week : week});
                            callback(ritrn);
                        });
                    });
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
    console.log("DATA: EventWord: Incoming message from server.js: %s", data.data, data.word, data.event_id, data.visitor);

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
            teword_id = erows.insertId;
            connection.query(config.get('ewrd.lst'), data.event_id, function (err, rows) {
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
    console.log("DATA: PersonWord: Incoming message from client: %s", JSON.stringify(data));
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
            tpword_id = prows.insertId;
            connection.query(config.get('pwrd.lst'), data.person_id, function (err, rows) {
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
 *     CHECKING EVENT_ID if we know week_id      *
 * function Running geolocation on the provided  *
 * IP address and saving it in the tlocation     *
 * table. Returning list of 25 most used         *
 * words in the current event                    *
 *************************************************/
function CheckEventID(data, callback) {
    data = JSON.parse(data);
    console.log("DATA: CheckEventID: Response from client: %s", data.data, data.week);
    var query;

    if(data.data=='event'){
        query = config.get('evnt.cur');
    }else{
        query = config.get('prsn.cur');
    }
    console.log("DATA: CheckEventID: Query looks like: %s", query);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {
        console.log('initializing connection to the database: ', query);

        connection.query(query, data.week, function (err, rows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: List: CheckEventID: ", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            ritrn = JSON.stringify(rows);
            console.log('CheckEventID: ', ritrn);
            callback(ritrn);
        });
        connection.release();

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
    console.log("DATA: EventPageLoaded: Response from client: %s", data.data, data.event_id);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('ewrd.flst'), data.event_id, function (err, rows) {
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
    console.log("DATA: EventPageLoaded: Response from client: %s", data.data);

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('lctn.cnt'), function (err, crows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: EventCntPageLoaded: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            continents = crows;
            var item = 0;

            continents.forEach(function(cont, index, arr) {
                item++;
                var temp = [];
                // console.log('index', index);
                connection.query(config.get('ewrd.lstpcnt'), [cont.continent, data.event_id], function (err, erows) {
                    // console.log('continent: ', cont.continent);
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: EventCntPageLoaded: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }

                    temp = {
                        cont: cont.continent,
                        ewords: erows
                    }
                    // console.log('temp: ', temp);

                    results.push(temp);
                    // console.log('results inside query: ', results);
                    if(index === arr.length-1) {
                        ritrn = JSON.stringify(results);
                        console.log('ritrn: ', ritrn);
                        callback(ritrn);
                    }
                })
                // console.log('results inside loop: ', results);
                // console.log(item);

            });
            // console.log('results outside loop: ', results);
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
    // ipJson = cityLookup.get(data.ip);
    console.log("DATA: PersonPageLoaded: Response from client: %s", data.data, data.person_id); // ipJson.country.names.en,

    // working with database requesting full list of words for the given person
    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('pwrd.flst'), data.person_id, function (err, rows) {
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
    console.log("DATA: PersonCntPageLoaded: Response from client: %s", data.data); // ipJson.country.names.en,

    dbcon.getConnection(function (err, connection) {

        connection.query(config.get('lctn.cnt'), function (err, crows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: PersonCntPageLoaded: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
            }
            continents = crows;
            var item = 0;

            continents.forEach(function(cont, index, arr) {
                item++;
                var temp = [];
                connection.query(config.get('pwrd.lstpcnt'), [cont.continent, data.person_id], function (err, prows) {
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: PersonCntPageLoaded: ContinentList", new Date(), config.get('poruke.konNaBazu'), err.code, err.fatal);
                    }

                    temp = {
                        cont: cont.continent,
                        pwords: prows
                    }

                    results.push(temp);
                    if(index === arr.length-1) {
                        ritrn = JSON.stringify(results);
                        callback(ritrn);
                    }
                })

            });
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