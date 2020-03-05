const MyKoa = require('./lib/application');

const app = new MyKoa();

app.use(async (ctx,next)=>{
  await next();
})

app.listen(3001,()=>{
    console.log('my koa server start')
})