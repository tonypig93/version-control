'use strict';
let q = require('q');
let Controller = require('../base/controller');
let DBController = require('./db-controller');
let LogController = new Controller(function() {
});
LogController.include({
    log(userID, action, target, IP, projectId, groupId) {
        DBController.insert('insert into VC_LOG (USER_FK, ACTION, TARGET, IP, PRJ_FK, GROUP_FK) values (?,?,?,?,?,?)'
        , [userID, action, target, IP, projectId, groupId])
        .then(function(){
            console.log(`${userID}: ${action} ${target}`);
        }, function(err) {
            console.log('log error: ' + err);
        });
    },
    login(userID, IP){
        DBController.insert('insert into VC_LOGIN_LOG (USER_FK, IP) values (?,?)', [userID, IP])
        .then(function(){
            console.log(`${userID}: login`);
        }, function(err) {
            console.log('log error: ' + err);
        });
    }
});
module.exports = LogController.create();