// config/database.js
module.exports = {
    'connection': {
        'host': process.env.DB_VAR_LINK,
        'user': process.env.DB_VAR_JUZER,
        'password': process.env.DB_VAR_LOZINKA,
        'port':process.env.DB_VAR_PORT
    },
	'database': process.env.DB_VAR_BAZA,
    'users_table': process.env.DB_VAR_TABELA
};