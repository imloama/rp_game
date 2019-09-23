/**
 * api请求
 * 1. 新用户注册，需要邀请码，然后给用户激活账号
 */
const  { api } = require('../services/vii');
const { isBlank } = require('../util/utils');
const db = require('../db/index');
const logger = require('../services/log');
const config = require('../config');
const vii = require('../services/vii')

// 注册功能
async function register (ctx,next) {
//  const { accountid, invite, time, signature } = ctx.query
// console.log(ctx.request.body)
 const { accountid, invite, time, signature } = ctx.request.body
 // signature要base64编码
 if(isBlank(accountid) || isBlank(invite) || isBlank(time) || isBlank(signature)){
  ctx.body = {
    code: 400,
    msg: 'Error! need params: accountid, invite, time, signature'
  }
  return;
 }
 //时间要在5分钟内
 const now = new Date().getTime()
 const rtime = Number(time)
 if(now < rtime || now - rtime > 300000){
  ctx.body = {
    code: 400,
    msg: 'Error: time is invalid'
  }
  return;
 }

 // 校验签名是否正确
 const data = { accountid, invite, time: rtime }
 logger.debug(JSON.stringify(data))
 logger.debug(signature)
 const checked = vii.check(accountid, JSON.stringify(data), signature)
 if(!checked){

  ctx.body = {
    code: 400,
    msg: 'Error: signature is invalid'
  }
  return;
 } 

 const user = await doRegister({accountid, invite})
//  const user = await db.findUser(accountid)
 logger.debug(`用户注册成功：${JSON.stringify(user)}`)
 if(config.active.enable){
  logger.debug(`支持激活功能，进行激活操作！`)
  const txresp = await vii.active(accountid)
  if(txresp.ledger){
    await db.afterActiveUser(accountid, txresp.hash)
    logger.debug(txresp)
    logger.debug(`激活用户账户成功：${accountid}`)
    ctx.body = {
      code: 200,
      data: {
        accountid,
        code: user.code
      }
    }
  }
 }else{
  ctx.body = {
    code: 200,
    data: {
      accountid,
      code: user.code
    }
  }
 }
}

async function doRegister({ accountid, invite }){
  const isgenesis = await db.isgenesis(invite)
  if(isgenesis){
    logger.debug(`--- is genesis----${JSON.stringify(isgenesis)}`)
    if(isgenesis.usedby){
      throw new Error('invite code is used!')
    }else{
      // 使用该创世邀请码
      logger.debug(`--- is genesis-and use it---`)
      const result = await db.useGenesis(accountid, invite)
      logger.debug(`--- is genesis-and use it end-result:${JSON.stringify(result)}---`)
      return result
    }
  }else{// 不是创世
    logger.debug(`--- not genesis---`)
    const result = await db.register({address: accountid, invite})
    logger.debug(`--- not genesis- end -result:${JSON.stringify(result)}---`)
    return result
  }
}

async function info(ctx){
  const { accountid } = ctx.query
  if(isBlank(accountid)){
    ctx.body = {
      code: 400,
      msg: 'Error: no accountid'
    }
    return
  }
  const user = await db.findUser(accountid)
  if(user && user.address){
    ctx.body = {
      code: 200,
      data: user
    }
  }else{
    ctx.body = {
      code: 404,
      msg: 'Error: no data'
    }
  }
}

module.exports = {
  register,
  info
}