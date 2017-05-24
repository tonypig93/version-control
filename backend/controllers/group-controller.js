'use strict';
let q = require('q');
let Controller = require('../base/controller');
let DBController = require('./db-controller');
let UserController = require('./user-controller');
let GroupController = new Controller(function() {
});
GroupController.include({
    getList: function () {
        return this.groupList = DBController.query('select * from GROUPS');
    },
    add: function ({groupName: groupName, description: description, pid: pid}) {
        let defer = q.defer();
        DBController.insert('insert into GROUPS (GROUP_NAME,DESCRIPTION,PARENT_ID) values (?,?,?)', [groupName, description, pid])
        .then(function (res) {
            defer.resolve(true);
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    getManage: function (id) {
        let defer2 = q.defer();
        DBController.query('select * from PROJECT where GROUP_FK=?', [id])
        .then(function (res) {
            defer2.resolve(res);
        }, function (err) {
            defer2.reject(err);
        });

        let all = q.all([defer2.promise]);
        return all;
    }
});
module.exports = GroupController.create();