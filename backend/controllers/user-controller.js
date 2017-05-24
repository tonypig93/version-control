'use strict';
let Controller = require('../base/controller');
let DBController = require('./db-controller');
let encrypt = require('crypto-js/md5');
let dataService = require('../base/data-service');
let q = require('q');
let UserController = new Controller(function() {
    this.loginUser = new dataService([]);
});
UserController.include({
    getList: function ({groupId: groupId}) {
        let defer = q.defer();
        DBController.query('select * from USER where GROUP_FK=?', [groupId]).then((data) => {
            defer.resolve(this.basicInfo(data));
        }, err => {
            defer.reject(err);
        });
        return defer.promise;
    },
    add: function ({userName: userName, email: email, password: password, groupId: groupId}) {
        let defer = q.defer();
        console.log(userName,password,email,groupId)
        DBController.query('CALL add_user(?,?,?,?)', [userName, password, email, groupId])
        .then(function (res) {
            defer.resolve(true);
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    deleteUser: function (id) {
        let defer = q.defer();
        DBController.query('CALL delete_user(?)', [id])
        .then(function (res) {
            defer.resolve(true);
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    findByName: function(name) {
        let defer = q.defer();
        DBController.query('select * from USER where USER_NAME=? limit 0,1', [name])
        .then(function (data) {
            if (data && data.length > 0) {
                // console.log(data)
                defer.resolve(data[0]);
            }
        }, err => {
            defer.reject(err);
            console.log(err);
        });
        return defer.promise;
    },
    login: function ({userName: userName, password: password, IP: IP}) {
        let defer = q.defer();
        this.findByName(userName).then((user) => {
            if(user && (user.PASSWORD === password)){
                let __loginUser = user;
                let __now = (new Date()).getTime();
                __loginUser.expireTime = __now + 86400000; // 1 day
                /**
                 * you cannot login with the same account on two browsers ,
                 * unless you can login twice at the exactly same time, accurate to ms.
                 */
                __loginUser.$hash = this.getMD5(userName + password + IP + __now) + 'x' + user.ID;
                this.loginUser.insert(__loginUser);
                defer.resolve(this.basicInfo(user));
            } else {
                defer.reject(false);
            }
        }, (err) => {
            defer.reject(err);
            console.log(err);
        });
        return defer.promise;
    },
    checkLogin: function ({__user, IP}) {
        let defer = q.defer();
        if (__user) {
            if (__user.expireTime > (new Date().getTime())) {
                defer.resolve(true);
            } else {
                this.loginUser.deleteByAttr('ID', __user.ID); // user out of date.
                defer.reject(false);
            }

        } else {
            defer.reject(false);
        }
        
        return defer.promise;
    },
    checkProjectAuth: function(projectId, __user) {
        let defer = q.defer();
        if (__user) {
            DBController.query('select ROLE_NAME,POWER from PRJ_MEMBER as a left join PRJ_ROLE as b on b.ID = a.ROLE_FK where a.PRJ_FK=? and a.USER_FK=? limit 0,1', [projectId, __user.ID])
            .then(function(data) {
                if (data && data.length > 0) {
                    __user.projectAccess = {
                        projectId: projectId,
                        power: data[0].POWER
                    };
                    defer.resolve(data);
                } else {
                    defer.reject('Current user is not a member of this project');
                }
            }, err => {
                console.log(err);
                defer.reject(err);
            });
        } else {
            defer.reject(false);
        }
        
        return defer.promise;
    },
    logout: function (__user) {
        let userID = __user.ID;
        let res = this.loginUser.deleteByAttr('ID', userID);
        return res ? true : false;
    },
    getUserIDFromHash: function ($hash) {
        return Number($hash.split('x')[1]);
    },
    basicInfo: function (users) {
        let isArray = users instanceof Array;
        if(!isArray) {
            users = [users];
        }
        let tmp = [];
            for(let i = 0; i < users.length; i ++) {
                let user = users[i];
                tmp.push({
                    ID: user.ID,
                    userName: user.USER_NAME,
                    expireTime: user.expireTime,
                    $hash: user.$hash,
                    GroupID: user.GROUP_FK,
                    email: user.EMAIL
                })
            }
        return isArray ? tmp : tmp[0];
    },
    roleInfo: function (users) {
        let isArray = users instanceof Array;
        if(!isArray) {
            users = [users];
        }
        let tmp = [];
            for(let i = 0; i < users.length; i ++) {
                let user = users[i];
                tmp.push({
                    ID: user.ID,
                    userName: user.USER_NAME,
                    expireTime: user.expireTime,
                    $hash: user.$hash,
                    GroupID: user.GROUP_FK,
                    email: user.EMAIL,
                    roleName: user.ROLE_NAME,
                    power: user.POWER,
                    projectID: user.PRJ_FK
                });
            }
        return isArray ? tmp : tmp[0];
    },
    getMD5: function (str) {
        return encrypt(str).toString();
    },
    onChange: function () {
        this.userList = DBController.query('select * from USER');
    }
});
module.exports = UserController.create();