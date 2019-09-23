//管理员系统
const  { api } = require('../services/vii');
const { isBlank } = require('../util/utils');
const db = require('../db/index');
const logger = require('../services/log');
const passport = require('../services/passport')
// const Router = require('@koa/router');



function index(ctx){
  if(!ctx.isAuthenticated()) {
    ctx.response.redirect('/login')
    return
  }
  ctx.response.redirect('/admin');
}

async function login(ctx){
  await ctx.render('login')
}

// POST 接收登录
async function doLogin(ctx){
  return passport.authenticate('local',(err, user, info, status) => {
    if(!err && user){
      ctx.login(ctx.request.body).then(response => {
        ctx.response.redirect('/admin')
      }).catch(err => {
        ctx.response.redirect('/login')
      })
      
    }else{
      ctx.redirect('/login')
    }
  })(ctx)
}


//退出
async function logout(ctx){
  await ctx.logout()
  ctx.response.redirect('/login');
}

// dashboard, 展示当前创世区块信息，展示当前注册用户信息
async function dashboard(ctx){
  if(!ctx.isAuthenticated()) {
    ctx.redirect('/login')
    return
  }
  const genesis = await db.getGenesis()
  
  const user = ctx.session.passport.user;
  await ctx.render('dashboard', { genesis, user })

}

async function userpage(ctx){
  if(!ctx.isAuthenticated()) {
    ctx.redirect('/login')
    return
  }
  // 当前有多少个用户了
  const counts =  await db.getUserCount()
  //TODO 用户列表?
  let page = ctx.query.page
  if(page === null || page === undefined){
    page = 1
  }
  const pageSize = ctx.query.limt || 50
  const users = await db.getUserPage(page, pageSize)
  // let pages = counts / pageSize
  // if(counts % pageSize > 0){
  //   pages += 1
  // }
  ctx.body = {
    code: 0,
    count: counts,
    data: users
  }
}

// 重新生成创世code数据
async function genesis(ctx){
  if(!ctx.isAuthenticated()) {
    ctx.redirect('/login')
    return
  }
  await db.randomGenesis(11)
  ctx.body = {
    code: 0
  }
}

// 当前用户

module.exports = {
  index,
  login,
  doLogin,
  logout,
  dashboard,
  userpage,
  genesis
}