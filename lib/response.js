// 遍历response request
module.exports = {
    get body() {
        return this._body
    },
    set body(data) {
        this._body = data
    },
    get status() {
        return this.response.statusdCode
    },
    set status(code) {
        this.response.statusCode = code
    }
}