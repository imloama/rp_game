const log4js = require('log4js');
const config = require('../config');

log4js.configure({
    appenders: { console: { type: 'console' }, 
	  vii: { type: 'dateFile', filename: 'vii.log'  } 
  },
  categories: { default: { appenders: ['vii', 'console'], level: config.loglevel } }
})

module.exports =  log4js.getLogger('vii')
