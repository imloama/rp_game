/**
 * 数据库部分，采用内存记录的方式
 */
var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;
const models = require('./models');

const path = require('path');
const dayjs = require('dayjs');
const logger = require('../services/log');
const Big = require('big.js');
const config = require('../config');
const randomcode = require('../util/code');

let inited = false

async function connection(){
  if(inited)return typeorm.getConnection()
  await typeorm.createConnection(config.dbconfig)
  inited = true
  return typeorm.getConnection()
}

//1. 获取当前可用房间
async function getUseableRoom(){
  
}

//2. 加入某个房间

//3. 创建新的房间

//4. 发红包

//5. 开红包

//6. 结算




/**
 * 创建创世code
 * @param {int} len 一共需要创建几个code
 */
async function randomGenesis(len = 10){
  const con = await connection()
  const repo = con.getRepository(models.Genesis.name);
  // await repo.delete()
  await con.createQueryBuilder()
    .delete()
    .from(models.Genesis.name)
    .execute()
  //生成随机编码
  let datas = []
  let codes = []
  for(let i=0;i<len;i++){
    let code = randomcode()
    if(codes.indexOf(code) >= 0){
      code = randomcode()
    }
    codes.push(code)
    datas.push({code, created: new Date(), status: models.STATUS_DEFAULT, isteam: i === 0 })
  }
  await repo.save(datas)
}

async function useGenesis(accountid, invite){
  logger.debug(`----use genesis----`)
  return await typeorm.getManager().transaction(async txem => {
    const genesis = await txem.findOne( models.Genesis.name, {where: { code: invite }})
    const isteam = genesis && genesis.isteam
    logger.debug(`---is team or genesis--`)
    if(!isteam){
      const result = await txem.update(models.Genesis.name, { code: invite, usedby: null, status: models.STATUS_DEFAULT }, 
        {usedby: accountid, status: models.STATUS_USED, updated: new Date()}  )
      logger.debug(result)
      const g = await txem.findOneOrFail(models.Genesis.name, { where : { code: invite }})
      logger.debug(g)
      logger.debug(g.usedby)
      logger.debug(accountid)
      if (g.usedby!== accountid) {
        return Promise.reject(new Error('Not Updated'))
      }
    }
    const code = randomcode()
    const result = await txem.save(models.Users.name, {address: accountid, code, 
        invite: isteam ? models.INVITE_TEAM : models.INVITE_GENESIS, 
        created: new Date(),
        status: models.STATUS_DEFAULT})
    return result  
  })
}

module.exports = {
  randomGenesis,
  useGenesis,
  register,
  addAdmin,
  modifyAdmin,
  delAdmin,
  findAdminById,
  adminLogin,
  models,
  getGenesis,
  getUsers,
  getUserCount,
  isgenesis,
  getUserPage,
  afterActiveUser,
  findUser

}
