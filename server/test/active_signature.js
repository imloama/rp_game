const VIISdk = require('vii-sdk');
const vii = require('../src/services/vii')

/*
const secret = `IBJRLEPLJJ6SBPAHTLFAOLTAMU65FMKTOVIWGTOVZDA3QVIPEYYJWXW2`
const accountid = `VB56PFWJJ7UOK4CBOL4L2RNEKNQSKDC3NK3KPTQWAPSJGNS4IKGUQ2VU`

const time = new Date().getTime()
const data = { accountid, invite: 'e7T9Ch', time }
const signature = vii.signToBase64(secret, JSON.stringify(data))
console.log(`time:${time}, signature:${signature}`)

const hex = vii.base64ToHex(signature)
console.log(`hex:${hex}`)
const sig = vii.hexToBase64(hex)
console.log(`base64:${sig}`)
*/

/*
const invite = `QARUBX`
const secret = `IA4QQLQMS6XVL2LJZRKK3ENK4L6BAILB45P5L6E3AH4WAQDRB5QP6OB5`
const accountid = `VBIP5VZ7CZXTOVDKWTPGMORMSLDNYLCZQHQZHROD3ZAGDQFVNL6EPHFG`
*/
/*
const invite = `2bZ0mM`
const secret = `IB2X3IFN6VGQDQJK6AUNXPHAXAQR4RY67Y4K544QQ5XG6ZXZKY5GVANM`
const accountid = `VDGHDYPSRC7OCUS4OS4BNZBNWQQ7BZP7EHYJQL5E5OF7BD4Z5NQGSW7T`
*/

/*
const invite = `VrZvYE`
const secret = `IC3M57KYXYI5HYACAN2QJFEN7TKESZRAAQN5HLAT7C7IHHT6ZQ3VHOH2`
const accountid = `VBN2JLCMCIUWLFGANTDM4AC4DZBX2UMXZWTWKHMCDQI76WUQLJBABA7Q`
*/


const time = new Date().getTime()
const data = { accountid, invite, time }
const signature = vii.signToBase64(secret, JSON.stringify(data))
console.log(`time:${time}, signature:${signature}`)
console.log(JSON.stringify({accountid, invite, time, signature}))