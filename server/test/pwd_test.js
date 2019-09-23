const pwdencode = require('../src/util/crypto');

//0358567857924e93269e806f1f154570717d76aed4d94fa0e126d629257c80ce
const pwd = pwdencode.sha256(`admin`)
console.log(pwd)
