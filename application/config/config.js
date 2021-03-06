{

}
module.exports = {

    /*************************************
     * versioning information
     *************************************/
    ver: {
        proc: 'v1.1-beta.50',
        srvr: 'v2.1-beta.12'
    },


    /**************************************
     *
     *   Database configuration parameters
     *
     *   contains two versions:
     *   - db4free.net testing version
     *   - production version (localhost)
     *     - TRYING TO MOVE THIS TO .ENV FILE
    ***************************************/
    // sequel: {
    //     conlimt: '10',
    //     link: 'mysql8.db4free.net',
    //     baza: 'onewordengine',
    //     juzer: 'owwuser',
    //     lozinka: 'myscrtW0rd',
    //     prt: 3307
    // },
    // sequel : {
    //     conlimt: '10',
    //     link : 'localhost',
    //     baza: 'onewordengine',
    //     juzer: 'root',
    //     lozinka: 'ou812id10t',
    //     prt: 3306
    // },
    /**************************************
     * END OF Database configuration parameters
     **************************************/



    /**************************************
     * List of MySQL queries required for
     * normal work of the application
     * *************************************/

    /*  ======================
    *   events queries
    *   ======================*/
    evnt: {
        ins: 'INSERT INTO tevent (title, image, week_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tevent SET title=?, image=?, week_id=?;',
        del: 'DELETE FROM tevent WHERE event_id=?;',
        sel: '',
        lst: 'SELECT * FROM tevent ORDER BY event_id DESC LIMIT 5;',
        cur: 'SELECT * FROM tevent WHERE week_id=?;'
    },
    /*  ======================
     *   event word queries
     *   ======================*/
    ewrd: {
        ins: 'INSERT INTO teword (eword, visitor_id, event_id) VALUES(?, ?, ?);',
        upd: 'UPDATE teword SET eword = ?, visitor_id = ?, event_id = ?;',
        del: 'DELETE FROM teword WHERE eword_id=?;',
        sel: '',
        lst:    'SELECT veword.eword a, COUNT(veword.eword) c FROM ' +
                '(select * from teword WHERE event_id=?) as veword ' +
                'GROUP BY veword.eword HAVING c > 1 ORDER BY c DESC LIMIT 5;',
        flst:   'SELECT veword.eword a, COUNT(veword.eword) c FROM ' +
        '(select * from teword WHERE event_id=?) as veword ' +
        'GROUP BY veword.eword HAVING c > 1 ORDER BY c DESC;',
        lstpcnt: 'SELECT t.a a, count(t.a) c FROM (SELECT e.eword a,l.continent b FROM teword e LEFT JOIN tlocation l ON e.visitor_id = l.visitor_id WHERE l.continent LIKE ? AND event_id=?) t GROUP BY a HAVING c > 1 ORDER BY c DESC LIMIT 5;'
    },
    /*  ======================
     *   location queries
     *   ======================*/
    lctn: {
        ins1: 'INSERT INTO tlocation (city, country, continent, visitor_id) VALUES (?, ?, ?, ?);',
        ins2: 'INSERT INTO `tlocation`(`country`, `continent`, `visitor_id`) VALUES (?,?,?);',
        upd: 'UPDATE tlocation SET city = ?, country = ?, continent = ?, visitor_id = ?;',
        del: 'DELETE FROM tlocation WHERE location_id=?',
        cont: 'select count(*) from tlocation where continent LIKE ?;',
        coun: 'SELECT count(*) FROM tlocation WHERE country LIKE ?;',
        city: 'SELECT count(*) FROM tlocation WHERE tlocation.city LIKE ?;',
        cnt: 'SELECT DISTINCT continent FROM tlocation;'
    },
    /*  ======================
     *   person word queries
     *   ======================*/
    pwrd: {
        ins: 'INSERT INTO tpword (pword, visitor_id, person_id) VALUES(?, ?, ?);',
        upd: 'UPDATE tpword SET pword=?, visitor_id=?, person_id=?;',
        del: 'DELETE FROM tpword WHERE pword_id=?;',
        sel: '',
        lst:    'SELECT vpword.pword a, COUNT(vpword.pword) c FROM ' +
                '(select * from tpword WHERE person_id=?) as vpword ' +
                'GROUP BY vpword.pword HAVING c > 1 ORDER BY c DESC LIMIT 5;',
        flst:    'SELECT vpword.pword a, COUNT(vpword.pword) c FROM ' +
        '(select * from tpword WHERE person_id=?) as vpword ' +
        'GROUP BY vpword.pword HAVING c > 1 ORDER BY c DESC;',
        lstpcnt: 'SELECT t.a a, count(t.a) c FROM (SELECT e.pword a,l.continent b FROM tpword e LEFT JOIN tlocation l ON e.visitor_id = l.visitor_id WHERE l.continent LIKE ? AND person_id=?) t GROUP BY a HAVING c > 1 ORDER BY c DESC LIMIT 5;'
    },
    /*  ======================
     *   persons queries
     *   ======================*/
    prsn: {
        ins: 'INSERT INTO tperson (title, image, week_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tperson SET title=?, image=?, week_id=?;',
        del: 'DELETE FROM tperson WHERE person_id=?;',
        sel: '',
        lst: 'SELECT * FROM tperson ORDER BY person_id DESC LIMIT 5;',
        cur: 'SELECT * FROM tperson WHERE week_id=?;'
    },
    /*  ======================
     *   visitor queries
     *   ======================*/
    vstr: {
        ins: 'INSERT INTO `tvisitor`(`ip_address`, `eword_id`, `pword_id`) VALUES (?,?,?);',
        upde: 'UPDATE tvisitor SET eword_id = ? WHERE visitor_id=?;',
        updp: 'UPDATE tvisitor SET pword_id = ?;',
        del: 'DELETE FROM tvisitor WHERE visitor_id=?;',
        sel: ''
    },
    /*  ======================
     *   weeks queries
     *   ======================*/
    week: {
        ins: 'INSERT INTO tweek (week, od_date, do_date) VALUES (?, ?, ?);',
        upd: 'UPDATE tweek SET week=?, od_date=?, do_date=?;',
        del: 'DELETE FROM tweek WHERE week_id=?;',
        sel: ''
    },
    /**************************************
     * END OF MySQL queries
     **************************************/



    /**************************************
     * Application messages
     **************************************/
    /*  ======================
     *   database mess
     *   ======================*/
    poruke: {
        konNaBazu: 'Could not connect to the db. Check if the DB is running?',
        upitNijeOK: 'Error executing code on the db. Check if the DB is running?'
    }
};