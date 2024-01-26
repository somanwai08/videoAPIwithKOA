const Koa = require('koa')
const app = new Koa()
const {koaBody}=require('koa-body')
const cors = require('@koa/cors')
const router = require('./router/index')


app.use(cors()).use(koaBody()).use(router.routes())
   .use(router.allowedMethods())
  

app.listen(3000,()=>{
    console.log('server running ');
})

