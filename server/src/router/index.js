const db = require('../db/index')
const Big = require('big.js')
const Router = require('@koa/router');
const passport = require('../services/passport')
const { register, info } = require('./api')
const admin = require('./admin');

var router = new Router()


router.post(`/api/v1/register`, register)
    .get(`/api/v1/info`, info)

// router.use([`/admin/*`], async (ctx, next) => {
//   if(ctx.isAuthenticated()) {
//     next()
//   } else {
//     ctx.response.redirect('/login');
//   }
// })


router.get(`/login`, admin.login)
    .post(`/login`, admin.doLogin)
    .get(`/logout`, admin.logout)
    .get('/', admin.index)
    .get('/admin', admin.dashboard)
    .get('/admin/users', admin.userpage)
    .get('/admin/genesis', admin.genesis)
    

module.exports = router
