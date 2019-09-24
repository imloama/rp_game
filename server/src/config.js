const path = require('path');
var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;
const models = require('./db/models');

module.exports = {
  // 数据库配置
  dbconfig: {
    type: "sqlite",
    database: path.resolve(__dirname, `../rpgame.db`),
    synchronize: true,
    logging: true,
    // logging: config.debug ? 'all': true,
    entities: [
        new EntitySchema(models.Admin),
        new EntitySchema(models.Assets),
        new EntitySchema(models.Balances),
        new EntitySchema(models.RPRoom),
        new EntitySchema(models.RPPart),
        new EntitySchema(models.RPTrans),
        new EntitySchema(models.RPSTrans),
        new EntitySchema(models.WeekFee),
        new EntitySchema(models.Rewards),
        new EntitySchema(models.Withdraws)
    ]
  },
  loglevel: 'debug',

  horizon: 'https://horizon.stellar.org',
  network: 'Public Global Stellar Network ; September 2015',



}