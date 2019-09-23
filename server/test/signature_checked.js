/*
{ accountid: 'VDVKXURWCZSHQI6WBQVES4UJ42E266GWZQRUJ3PMEYO7GOWO4UIKALC7',
  invite: 'nRkhvE',
  time: '1562313261521',
  signature:
   'XZQu89rUWk7lZYPDp+PH+L1boEzyrpO49lvbwwqU9RP88a3f9EKRl0a3XVwO+D5DdTqFgh3OpkvFi9Al+M+3BA==' }
*/

const vii = require('../src/services/vii')

const accountid = `VCCY3TQBIHAFVAD4KFL2HMHEP4HKFOSJ5KSMIK5SM55U34WH2H2TNVRK`
const time = 1562320189878
const invite = `4YTHME`
const signature = `Y5C787JP7CzJlartsaIP7uPm6Xsd6j7BS04CScvgZ5ONYKrZqja9Pa6e3fzLiGraWQ6PWbZMqhpQ1LOA9MAQBQ==`
// vii.check(accountid, JSON.stringify(data), signature)
const checked = vii.check(accountid, JSON.stringify({accountid, invite, time}), signature)
console.log(`checked:${checked}`)