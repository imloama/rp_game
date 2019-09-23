const VIISdk = require('vii-sdk');

let accountid = `VCJFCHMATYYKHCCKJGE7RK7D2LMTG3ZANAT3AHROVOYCOSR7ALS2GKBW`

let kp = VIISdk.Keypair.fromPublicKey(accountid)
console.log(kp)