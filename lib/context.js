// 访问 ctx.body 自动 访问 response.body
// 访问 ctx.query 自动 访问 request.query


// proxy，Object.defineProp
// __defineGetter__

// var o = {};
// o.__defineGetter__('body', function() { return 'response.body'; });
// console.log(o.gimmeFive);

// ctx

const proto = {}

function delegrateGet(type, prop) {
    proto.__defineGetter__(prop, function () {
        return this[type][prop]
    })
}

function delegrateSet(type, prop) {
    proto.__defineSetter__(prop, function (data) {
        this[type][prop] = data
    })
}
//需要定义代理的字段

const requestGetArray = ["query"];
const requestSetArray = [];
const responseSetArray = ['status', 'body'];
const responseGetArray = ['status', 'body'];

requestSetArray.forEach(prop => {
    delegrateSet('request', prop)
})

responseSetArray.forEach(prop => {
    delegrateSet('response', prop)
})

requestGetArray.forEach(prop => {
    delegrateGet('request', prop)
})

responseGetArray.forEach(prop => {
    delegrateGet('response', prop)
})

module.exports = proto;