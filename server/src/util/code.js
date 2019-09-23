const cryptoRandomString = require('crypto-random-string');

const characters = `abcdefghgkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ1234567890`

function random(len = 6){
  return cryptoRandomString({length: len, characters});
}

module.exports = random