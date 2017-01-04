{

}
module.exports = {

    ver: {
        proc: 'v0.1-alpha.20',
        srvr: 'v0.1-alpha.20'
    },

    sequel : {
        conlimt: '10',
        link : 'mysql8.db4free.net',
        baza: 'onewordengine',
        juzer: 'owwuser',
        lozinka: 'myscrtW0rd',
        prt: 3307
    },

    que: {
        insEvnt: 'INSERT INTO tevent (title, image, week_id) VALUES(?, ?, ?);',
        insPrsn: 'INSERT INTO tperson (title, image, week_id) VALUES(?, ?, ?);',
        insEword: 'INSERT INTO teword (eword, ip, event_id) VALUES(?, ?, ?);',
        insPword: 'INSERT INTO tpword (pword, ip, person_id) VALUES(?, ?, ?);',
        insLocLe: 'INSERT INTO tlocation (city, country, continent, eword_id) VALUES(?,?,?,?)',
        insLoce: 'INSERT INTO `tlocation`(`country`, `continent`, `eword_id`) VALUES (?,?,?)',
        insLocLp: 'INSERT INTO tlocation (city, country, continent, pword_id) VALUES(?,?,?,?)',
        insLocp: 'INSERT INTO `tlocation`(`country`, `continent`, `pword_id`) VALUES (?,?,?)',
        eventList: 'SELECT eword a, COUNT(eword) c FROM teword GROUP BY eword HAVING c > 1 ORDER BY c DESC LIMIT 5',
        personList: 'SELECT pword a, COUNT(pword) c FROM tpword GROUP BY pword HAVING c > 1 ORDER BY c DESC LIMIT 5',
        evntLst: 'SELECT * FROM tevent ORDER BY event_id DESC LIMIT 5;',
        prsnLst: 'SELECT * FROM tperson ORDER BY person_id DESC LIMIT 5;',
        evntWeek: 'SELECT te.event_id, tw.week FROM tevent te LEFT JOIN tweek tw ON (te.week_id = tw.week_id) ORDER BY event_id DESC LIMIT 5;',
        prsnWeek: 'SELECT tp.person_id, tw.week FROM tperson tp LEFT JOIN tweek tw ON (tp.week_id = tw.week_id) ORDER BY person_id DESC LIMIT 5;'
    },

    poruke: {
        konNaBazu: 'Could not connect to the db. Check if the DB is running?',
        upitNijeOK: 'Error executing code on the db. Check if the DB is running?'
    }
};