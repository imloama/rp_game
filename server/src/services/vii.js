/**
 * vii 业务操作
 * 1. 激活账户
 * 2. 用户买包？
 */
const VIISdk = require('vii-sdk');
const config = require('../config');
// var Buffer = require('buffer/').Buffer;

VIISdk.Config.setAllowHttp(true)
let _server  = null

function getServer () {
  if(_server)return _server
  VIISdk.Network.use(new VIISdk.Network(config.network));
  _server = new VIISdk.Server(config.horizon);
  return _server;
}

async function active(target){
  if(!config.active.enable){
    return Promise.reject('No Active Service');
  }
  const server = getServer()
  var createaccount = VIISdk.Operation.createAccount({destination: target, startingBalance: config.active.amount })
  const account = await server.loadAccount(config.active.accountid)
  var tx = new VIISdk.TransactionBuilder(account, { fee: 100 }).addOperation(createaccount).setTimeout(60).build();
  tx.sign(VIISdk.Keypair.fromSecret(config.active.secret));
  const result = await server.submitTransaction(tx);
  return result;
}

function check(accountid, data, signature){
  const buffer =  Buffer.from(signature, 'base64')
  return VIISdk.Keypair.fromPublicKey(accountid).verify(data,buffer)
}


function hexToBase64(str) {
  return Buffer.from(str, 'hex').toString("base64");
}

// Base64 to Hex
function base64ToHex(str) {
  // for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
  //     let tmp = bin.charCodeAt(i).toString(16);
  //     if (tmp.length === 1) tmp = "0" + tmp;
  //     hex[hex.length] = tmp;
  // }
  // return hex.join("");
  return Buffer.from(str, 'base64').toString('hex');
}

function signToBase64(secret, data){
  if(data === null || typeof data === 'undefined')throw new Error('sign data is null')
  let val = null
  if(typeof data === 'string'){
    val = data
  }else{
    val = JSON.stringify(data)
  }
  return VIISdk.Keypair.fromSecret(secret).sign(val).toString('base64')
}

module.exports = {
  active,
  check,
  signToBase64,
  hexToBase64,
  base64ToHex,
}