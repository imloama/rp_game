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
  // await con.transaction(async transactionalEntityManager => {
  //   const genesis = await transactionalEntityManager.findOneOrFail({where: { code: invite }})
  //   const isteam = genesis.isteam
  // })



/*
  const con = await connection()
  const repo = con.getRepository(models.Genesis.name)
  const genesis = await repo.findOneOrFail({where: { code: invite }})
  const isteam = genesis.isteam
  if(!isteam){
    const result = await repo.update( { code: invite, usedby: null, status: models.STATUS_DEFAULT }, 
      {usedby: accountid, status: models.STATUS_USED, updated: new Date()}  )
    // const result = await con.createQueryBuilder().update(models.Genesis.name)
    //     .set({usedby: accountid, status: models.STATUS_USED, updated: new Date()})
    //     .where(" code=:invite and usedby is null and status=0 ", {invite})
    //     .execute()
    logger.debug(result)
    
    const g = await repo.findOneOrFail({ where : { code: invite }})
    logger.debug(g)
    logger.debug(g.usedby)
    logger.debug(accountid)
    if(g.usedby!== accountid){
      return Promise.reject(new Error('Not Updated'))
    }
    // const effects = result.raw.length
    // logger.debug(`-------update genesis, result: ${effects}`)
    // if(effects <= 0){
    //   return Promise.reject(new Error('Not Updated'))
    // }
  }
  const userrepo = await getRepo(models.Users.name)
  const code = randomcode()
  const result = await userrepo.save({address: accountid, code, 
      invite: isteam ? models.INVITE_TEAM : models.INVITE_GENESIS, 
      created: new Date(),
      status: models.STATUS_DEFAULT})
  return result  
  */
}

/**
 * 注册用户保存到数据库
 * @param {Object} user 
 */
async function register(user){
  if(user === null || typeof user === 'undefined' || !user.address || !user.invite){
    return Promise.reject('Data Failed')
  }
  const con = await connection()
  const repo = con.getRepository(models.Users.name);
  const code = randomcode()
  // 查询上级
  let invite = await repo.findOneOrFail({code: user.invite})
  logger.debug(`user invite:${JSON.stringify(invite)}`)
  if(invite === null){
    return Promise.reject('No Invite')
  }
  let count = repo.count({code})
  // TODO 调整
  if ( count > 0 ) {
    code = randomcode()
    count = repo.count({code})
    if (count > 0) {
      code = randomcode()
    }
  }
  const result = await repo.save(Object.assign({...user}, {code, invite: invite.address, 
    status: models.STATUS_DEFAULT, created: new Date()}))
  return result  
}


async function addAdmin(data){
  const con = await connection()
  const repo = con.getRepository(models.Admin.name);
  const result = await repo.save(Object.assign({}, data, { created: new Date(), status: models.STATUS_DEFAULT}))
  return result
}

async function modifyAdmin(id,data){
  const con = await connection()
  const repo = con.getRepository(models.Admin.name);
  const result = await repo.findOne({id})
  if(!result){
    return Promise.reject('No Data');
  }
  const entity = Object.assign({}, result, data, { updated: new Date()})
  const result = await repo.save(entity)
  return result
}

async function delAdmin(id){
  const con = await connection()
  const repo = con.getRepository(models.Admin.name);
  const result = await repo.delete(id)
  return result
}

async function findAdminById(id){
  const con = await connection()
  const repo = con.getRepository(models.Admin.name);
  const result = await repo.findOneOrFail(id)
  return result
}

async function adminLogin(username, pwd){
  const con = await connection()
  const repo = con.getRepository(models.Admin.name);
  const result = await repo.findOneOrFail({where: {username, pwd}})
  return result
}

// 返回当前的创世邀请码
async function getGenesis(){
  const con = await connection()
  const repo = con.getRepository(models.Genesis.name);
  const result = await repo.find()
  return result
}

// 返回当前平台用户
async function getUsers(){
  const con = await connection()
  const repo = con.getRepository(models.Users.name);
  const result = await repo.find()
  return result
}

async function getUserCount(){
  const con = await connection()
  const repo = con.getRepository(models.Users.name);
  const result = await repo.count()
  return result
}

async function getRepo(name){
  const con = await connection()
  const repo = con.getRepository(name);
  return repo;
}

async function isgenesis(code){
  const repo = await getRepo(models.Genesis.name)
  const result = await repo.findOne({where: {code}})
  return result
}

async function getUserPage(current, pageSize = 50){
  const repo = await getRepo(models.Users.name)
  const skip = (current - 1) * pageSize 
  const result = await repo.find({
    order: { created: 'DESC' },
    skip,
    take: pageSize
  })
  return result
}

async function afterActiveUser(address, hash){
  const repo = await getRepo(models.Users.name)
  await repo.update(address, { hash })
}

async function findUser(accountid){
  const repo = await getRepo(models.Users.name)
  const result = await repo.findOneOrFail(accountid)
  return result
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
