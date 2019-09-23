const passport = require('koa-passport')
var LocalStrategy = require('passport-local').Strategy
const { findAdminById, adminLogin } = require('../db/index');
const { sha256 } = require('../util/crypto');


// 序列化ctx.login()触发
passport.serializeUser((user, done) => {
  console.log('serializeUser: ', user)
  done(null, user)
})
// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(async function(id, done) {
  console.log('deserializeUser: ', id)
  findAdminById(id).then(user  => {
    done(null, {id, ...user })
  }).catch(err => {
    done(err, false);
  })
})
// 提交数据(策略)
passport.use(new LocalStrategy( {
  usernameField: "username",  
  passwordField: "password"
},
(username, password, done) => {
  console.log(`----username:${username}, password:${password}--`)
  if(!username || !passport){
    done(new Error('No Data'), false)
    return;
  }
  const pwd = sha256(passport)
  adminLogin(username, pwd).then(user => {
    done(null, user)
  }).catch(err => {
    done(err, false)
  })
}))


module.exports = passport