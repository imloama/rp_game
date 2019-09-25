const path = require('path');
const knex = require('knex')
const bookshelf = require('bookshelf')

let dbconfig = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, `../rpgame.db`),
  }
}


module.exports = {
  db: bookshelf(knex(dbconfig)),
  loglevel: 'debug',
  horizon: 'https://horizon.stellar.org',
  network: 'Public Global Stellar Network ; September 2015',
}