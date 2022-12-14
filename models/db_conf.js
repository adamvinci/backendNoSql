
const DataBase = require('better-sqlite3')

const db = DataBase('./models/identifier.sqlite', { verbose: console.log });
module.exports = db;