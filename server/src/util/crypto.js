/**
 * 密码处理
 */
var SHA256 = require("crypto-js/sha256");

const DEFAULT_KEY = `ViiC0In2o19!`

function sha256(pwd){
  const sha = SHA256(pwd).toString()
  return SHA256(`${DEFAULT_KEY}-${sha}`).toString()
}

module.exports = {
  sha256
}