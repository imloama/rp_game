const path = require('path');
var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;
const models = require('./db/models');

module.exports = {
  // 数据库配置
  dbconfig: {
    type: "sqlite",
    database: path.resolve(__dirname, `../vii.db`),
    synchronize: true,
    logging: true,
    // logging: config.debug ? 'all': true,
    entities: [
        new EntitySchema(models.Users),
        new EntitySchema(models.Genesis),
        new EntitySchema(models.Admin),
    ]
  },
  loglevel: 'debug',

  horizon: 'http://13.125.42.154:8000',
  network: 'Public Global VIICoin Network ; July 2019',


  active: {
    enable: true,
    // 激活账户最少余额
    amount: '0.001',
    // 用哪个账户给用户激活
    secret: 'IAV3NTLJZSNPLM5Y3ZVHP6WGIFQ2UUX5RB3XYNUUCVBRYP2753ZHCJJ4',
    //
    accountid: 'VA7MWV4O24JDIFIHQLZ6YPQ27KNCI4YX2ZLVGTN4C2PWSCCNYPP526TF'
  }

}