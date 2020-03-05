const EventEmitter = require('events');
const http = require('http');
const context = require('./context')
class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.context = context;
  }
  use(middlewares) {
    this.middlewares.push(middlewares)
  }
  listen(...args) {
    const server = http.createServer(this.callBack());
    server.listen(...args)
  }
  onerror(err,ctx){
    this.emit(err)
  }
  compose() {
    return async ctx => {
      function createNext(middlewares, oldNext) {
        return async () => {
          await middlewares(ctx, oldNext)
        }
      }
      let len = this.middlewares.length;
      //  将所有的middlewares 进行递归合并 
      for (let i = len - 1; i >= 0; i--) {
        let next = async () => {
          return Promise.resolve();
        }
        let currentMiddleWare = this.middlewares[i];
        next = createNext(currentMiddleWare, next)
      }
      await next()
    }
  }
  createContext(){
    let ctx = Onject.create(this.context)
  }
  callBack() {
    return (req, res) => {
      let fn = this.compose()
      const error = this.onerror;
      const ctx = this.createContext();
      return fn(ctx).then(() => {
        //还需要respond 容错处理
        res.end('hello ')
      }).catch(error)
    }
  }
}
module.exports = Application