const pgp = require('pg-promise')()

const cn = {
    host: "localhost",
    port: "5432",
    database: "mr_coffee",
    user: "postgres",
    password: "admin"
}

const db = pgp(cn)

module.exports = db;
