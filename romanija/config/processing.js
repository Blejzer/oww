var mysql = require("mysql");
var Config = require("config-js"); // Da bi ucitali config.js file, moramo imati ovaj modul ???
var config = new Config("./application/config/config.js");
console.log(config.configObj.sequel);

// Pravimo konekciju na bazu podataka koristeci podatke iz config.js file
var dbcon = mysql.createPool({
    connectionLimit: config.get('sequel.conlimt'),
    host: config.get('sequel.link'),
    user: config.get('sequel.juzer'),
    password: config.get('sequel.lozinka'),
    database: config.get('sequel.baza'),
    port: config.get('sequel.prt')
});


/* **********************************************
 *         INSERT EVENT WORD function            *
 * Preparing all gathered information and add    *
 * geolocation of the IP address and save it     *
 * to the tevent and tlocation databases         *
 * = to add tlink information from row.insertId  *
 * from both previous inserts.                   *
 *************************************************/
module.exports = {
    insertEvent: function(data, callback){
    console.log("DATA: Event: %s", data.title, data.path, data.week);

    // working with database inserting new event
    dbcon.getConnection(function (err, connection) {
        // Use the connection
        var event_id;
        var test = false;
        connection.query("SELECT * FROM tevent where week_id = ?", data.week, function (err,wrows) {
            if(err) throw err;
            console.log("wrows: ", wrows);
            if (wrows[0]){
                console.log("Event for the week: ", wrows[0].week_id, "already exists!");
                callback({weekcheck: test, event_id: null});
                connection.release();
            }else{
                test = true;
                connection.query(config.get('evnt.ins'), [data.title, data.path, data.week], function (err, rows) {
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("Processor: Insert: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err);
                    }
                    console.log("Insert event ID: ", rows.insertId);
                    event_id = rows.insertId;
                    callback({weekcheck: test, event_id: rows.insertId});
                    connection.release();
                })
            }


        });
        // connection.query(config.get('evnt.ins'), [data.title, data.path, data.week], function (err, rows) {
        //     if (err) {
        //         if (err.fatal) {
        //             throw err;
        //         }
        //         console.error("Processor: Insert: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
        //     }
        //     console.log("Insert event ID: ", rows.insertId);
        //     event_id = rows.insertId;
        //     callback(event_id);
        //     connection.release();
        //     });

        });
    },

    insertPerson: function(data, callback){
        console.log("DATA: Person: %s", data.title, data.path, data.week);

        // working with database inserting new person
        dbcon.getConnection(function (err, connection) {
            // Use the connection
            var person_id;
            var test = false;
            connection.query("SELECT * FROM tperson where week_id = ?", data.week, function (err,wrows) {
                if(err) throw err;
                console.log("wrows: ", wrows);
                if (wrows[0]){
                    console.log("Person for the week: ", wrows[0].week_id, "already exists!");
                    callback({weekcheck: test, event_id: null});
                    connection.release();
                }else{
                    test = true;
                    connection.query(config.get('prsn.ins'), [data.title, data.path, data.week], function (err, rows) {
                        if (err) {
                            if (err.fatal) {
                                throw err;
                            }
                            console.error("Processor: Insert: Person: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err);
                        }
                        console.log("Insert person ID: ", rows.insertId);
                        person_id = rows.insertId;
                        callback({weekcheck: test, person_id: person_id});
                        connection.release();
                    })
                }


            });

        });
    },
    mainLists: function (callback) {
        console.log("DATA: Main Page Lists");

        dbcon.getConnection(function (err, connection) {
            // Use the connection
            var persons, events = new Array(5);
            connection.query(config.get('prsn.lst'), function (err, prows) {
                if (err) {
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("DATA: Main Person List: %s: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                }
                connection.query(config.get('evnt.lst'), function (err, erows) {
                    if (err) {
                        if (err.fatal) {
                            throw err;
                        }
                        console.error("DATA: Main Event List: %s: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                    }
                    persons = prows;
                    events = erows;
                    var ritrn = ({eventList: erows, personList: prows});
                    callback(ritrn);
                    connection.release();
                })
            });
        });





    },
    listPersons: function (data, callback) {


    }
}