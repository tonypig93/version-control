'use strict';
let UserController = require('../controllers/user-controller');
let q = require('q');

function http(response, powerGuard) {
    return function (req, res) {
        let $hash = req.header('authorization');
        let pass = false;
        if (!$hash) {
            res.end(dataJson(null, 1, 'Unauthorized: invalid user.'));
            return;
        }
        let userId = UserController.getUserIDFromHash($hash);
        let __user = UserController.loginUser.findByAttr('ID', userId);
        if (__user && (__user.$hash !== $hash)) {
            res.end(dataJson(null, 1, 'Unauthorized: invalid user.'));
            return;
        }
        if (typeof powerGuard === 'function') {
            pass = powerGuard.call(null, __user, req, res);
            if (q.isPromise(pass)) {
                pass.then(function(data) {
                    if (data) {
                        response.call(null, req, res, __user);
                    }
                }, err => {
                    res.end(dataJson(null, 1, 'Unauthorized: access permission required!(async)'));
                });
                return;
            }
        } else {
            pass = checkPower(powerGuard, $hash);
        }
        if (pass) {
            response.call(null, req, res, __user);
        } else {
            res.end(dataJson(null, 1, 'Unauthorized: access permission required!'));
        }
    }
}
function checkPower(powerGuard, $hash) {
    if (powerGuard) {
        let userId = UserController.getUserIDFromHash($hash);
        let __user = UserController.loginUser.findByAttr('ID', userId);
        return (__user) && (__user.projectAccess) && ((__user.projectAccess.power & powerGuard) === powerGuard);
    }
    return true;
}
function dataJson(obj, error = 0, msg = '') {
    return JSON.stringify({
        error: error,
        data: obj,
        msg: msg
    });
}
module.exports = {
    http: http,
    dataJson: dataJson,
    checkPower: checkPower
};