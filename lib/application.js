const EventEmitter = require('events');
const http = require('http');
const request = require('./request');
const response = require('./response');
const context = require('./context');
class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
  }
  use(middlewares) {
    this.middlewares.push(middlewares)
  }
  listen(...args) {
    const server = http.createServer(this.callBack());
    server.listen(...args)
  }
  onerror(err, ctx) {
    this.emit(err)
  }
  compose() {
    return async ctx => {
      function createNext(middlewares, oldNext) {
        return async () => {
          await middlewares(ctx, oldNext) // 传入下一个中间件 并执行
        }
      }
      let len = this.middlewares.length;
      //  将所有的middlewares 进行递归合并 
      for (let i = len - 1; i >= 0; i--) {
        let next = async () => {
          return Promise.resolve();
        }
        let currentMiddleWare = this.middlewares[i];
        next = createNext(currentMiddleWare, next) //闭包递归  middleware  ->next()方法执行下一个中间件
      }
      await next();
    }
  }
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.request = req;
    ctx.response = res;
    return ctx;
  }
  callBack() {
    return (req, res) => {
      let fn = this.compose();
      const error = this.onerror;
      const ctx = this.createContext();
      return fn(ctx).then(() => {
        //还需要respond 容错处理
        res.end('hello')
      }).catch(error)
    }
  }
}
module.exports = Application