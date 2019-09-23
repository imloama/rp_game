const koa = require('koa');
const staticservice = require('koa-static');
const bodyParser = require('koa-bodyparser');
const render = require('koa-ejs');
const logger = require('./services/log');
const passport = require('./services/passport')
const router = require('./router');
// var cp = require('child_process');
const session = require('koa-session')


const app = new koa()
app.experimental = true;

app.keys = ['1323424234sldfkjasf!232'];
app.use(bodyParser())
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));

app.use(staticservice('public'))

render(app, {
  root: 'templates',
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})

app.use(passport.initialize())
app.use(passport.session())

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err)
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: err.message || "Server internal error."
    }
  }
});

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

const port = process.env.PORT || 8005
app.listen(port)
logger.debug(`server running on port : ${port}`)

