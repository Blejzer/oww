var mysql = require("mysql");
var Config = require("config-js"); // Da bi ucitali config.js file, moramo imati ovaj modul ???
var config = new Config("./application/config/config.js");

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
        connection.query(config.get('evnt.ins'), [data.title, data.path, data.week], function (err, rows) {
            if (err) {
                if (err.fatal) {
                    throw err;
                }
                console.error("Processor: Insert: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
            }
            console.log("Insert event ID: ", rows.insertId);
            event_id = rows.insertId;
            callback(event_id);
            connection.release();
            });

        });
    },

    insertPerson: function(data, callback){
        console.log("DATA: Person: %s", data.title, data.path, data.week);

        // working with database inserting new person
        dbcon.getConnection(function (err, connection) {
            // Use the connection
            var person_id;
            connection.query(config.get('prsn.ins'), [data.title, data.path, data.week], function (err, rows) {
                if (err) {
                    if (err.fatal) {
                        throw err;
                    }
                    console.error("Processor: Insert: Event: ", new Date(), config.get('poruke.upitNijeOK'), err.code, err.fatal);
                }
                console.log("Insert tperson ID: ", rows.insertId);
                person_id = rows.insertId;
                callback(person_id);
                connection.release();
            });

        });
    },
    listEvents: function (data, callback) {


    },
    listPersons: function (data, callback) {


    }
}