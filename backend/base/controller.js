'use strict';
let Controller = function (init) {
    let __class = function () {
        this.init.apply(this, arguments);
    };
    __class.prototype.init = init;
    __class.create = function () {
        return new __class();
    };
    __class.include = function (obj) {
        for(var i in obj) {
            __class.prototype[i] = obj[i];
        }
    }
    return __class;
};
module.exports = Controller;