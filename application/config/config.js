{

}
module.exports = {

    ver: {
        proc: 'v0.1-alpha.20',
        srvr: 'v0.1-alpha.20'
    },

    sequel: {
        conlimt: '10',
        link: 'mysql8.db4free.net',
        baza: 'onewordengine',
        juzer: 'owwuser',
        lozinka: 'myscrtW0rd',
        prt: 3307
    },
    // sequel : {
    //     conlimt: '10',
    //     link : 'localhost',
    //     baza: 'onewordengine',
    //     juzer: 'root',
    //     lozinka: 'ou812id10t',
    //     prt: 3306
    // },


    evnt: {
        ins: 'INSERT INTO tperson (title, image, week_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tperson SET title=?, image=?, week_id=?;',
        del: 'DELETE FROM tperson WHERE person_id=?;',
        sel: '',
        lst: 'SELECT * FROM tevent ORDER BY event_id DESC LIMIT 5;'
    },
    ewrd: {
        ins: 'INSERT INTO teword (eword, ip, event_id) VALUES(?, ?, ?);',
        upd: 'UPDATE teword SET eword = ?, ip = ?, event_id = ?;',
        del: 'DELETE FROM teword WHERE eword_id=?;',
        sel: '',
        lst: 'SELECT eword a, COUNT(eword) c FROM teword GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5;'
    },
    lctn: {
        ins1: 'INSERT INTO tlocation (city, country, continent, visitor_id) VALUES (?, ?, ?, ?);',
        ins2: 'INSERT INTO tlocation (country, continent, visitor_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tlocation SET city = ?, country = ?, continent = ?, visitor_id = ?;',
        del: 'DELETE FROM tlocation WHERE location_id=?',
        sel: ''
    },
    pwrd: {
        ins: 'INSERT INTO tpword (pword, ip, person_id) VALUES(?, ?, ?);',
        upd: 'UPDATE tpword SET pword=?, ip=?, person_id=?;',
        del: 'DELETE FROM tpword WHERE pword_id=?;',
        sel: '',
        lst: 'SELECT pword a, COUNT(pword) c FROM tpword GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5;'
    },
    prsn: {
        ins: 'INSERT INTO tperson (title, image, week_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tperson SET title=?, image=?, week_id=?;',
        del: 'DELETE FROM tperson WHERE person_id=?;',
        sel: '',
        lst: 'SELECT * FROM tperson ORDER BY person_id DESC LIMIT 5;'
    },
    vstr: {
        ins: 'INSERT INTO tvisitor (ip_address, eword_id, pword_id) VALUES (?, ?, ?);',
        upd: 'UPDATE tvisitor SET eword_id = ?, pword_id = ?;',
        del: 'DELETE FROM tvisitor WHERE visitor_id=?;',
        sel: ''
    },
    week: {
        ins: 'INSERT INTO tweek (week, od_date, do_date) VALUES (?, ?, ?);',
        upd: 'UPDATE tweek SET week=?, od_date=?, do_date=?;',
        del: 'DELETE FROM tweek WHERE week_id=?;',
        sel: ''
    },

    poruke: {
        konNaBazu: 'Could not connect to the db. Check if the DB is running?',
        upitNijeOK: 'Error executing code on the db. Check if the DB is running?'
    }
};