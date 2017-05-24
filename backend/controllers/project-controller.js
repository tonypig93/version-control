'use strict';
let q = require('q');
let Controller = require('../base/controller');
let DBController = require('./db-controller');
let UserController = require('./user-controller');
let ProjectController = new Controller(function() {
});
ProjectController.include({
    getList: function () {
        return DBController.query('select * from PROJECT where MARK_DELETE=0');
    },
    getRoleList: function (id) {
        return DBController.query('select * from PRJ_ROLE where PRJ_FK=?', [id]);
    },
    getLastestVersion(projectId) {
        return DBController.query('select CURRENT_D_VERSION as Development,CURRENT_VERSION as Production from PROJECT where ID=?', [projectId]);
    },
    updateRole: function (roleId, value, __user) {
        let defer = q.defer();
        DBController.query('update PRJ_ROLE set POWER=? where ID=?', [value, roleId])
        .then(function() {
            DBController.query('select POWER from PRJ_ROLE where ID=?', [roleId])
            .then(function (data) {
                if (data && data.length > 0) {
                    __user.projectAccess.power = data[0].POWER;
                }
                defer.resolve(true);
            }, err => {
                defer.reject(err);
            })
        }, err => {
            defer.reject(err);
        });
        return defer.promise;
    },
    deleteRole: function (roleId, projectId) {
        let defer = q.defer();
        DBController.query('delete from PRJ_ROLE where ID=? and PRJ_FK=?', [roleId,projectId])
        .then((res) => {
            this.getRoleList(projectId).then( data => {
                defer.resolve(data);
            });
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    addRole: function (roleName, value, projectId) {
        let defer = q.defer();
        DBController.insert('insert into PRJ_ROLE (ROLE_NAME,POWER,PRJ_FK) values (?,?,?)', [roleName,value,projectId])
        .then((res) => {
            this.getRoleList(projectId).then( data => {
                defer.resolve(data);
            });
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    add: function ({projectName, description, visibility,groupId, $hash}) {
        let userId = UserController.getUserIDFromHash($hash);
        return DBController.insert('insert into project (PRJ_NAME,GROUP_FK,VISIBILITY,DESCRIPTION,USER_FK) values (?,?,?,?,?)',
        [projectName, groupId, visibility, description,userId]);
    },
    addUser: function ({role, user, projectId}) {
        let defer = q.defer();
        DBController.insert('insert into PRJ_MEMBER (USER_FK,PRJ_FK,ROLE_FK) values (?,?,?)', [user, projectId, role])
        .then((res) => {
            this.getUser(projectId).then( data => {
                defer.resolve(data);
            })
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    deleteUser: function (userId, projectId) {
        let defer = q.defer();
        DBController.query('delete from PRJ_MEMBER where USER_FK=? and PRJ_FK=?', [userId, projectId])
        .then((res) => {
            this.getUser(projectId).then( data => {
                defer.resolve(data);
            });
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    updateVersion: function (major, minor, patch, projectId, repoCode, log, userId, ID, release, type) {
        let defer = q.defer();
        let sql = '';
        let params;
        release = Number(release);
        if (ID) {
            sql = `update PRJ_VERSION set 
            PRJ_FK=?,V_MAJOR=?,V_MINOR=?,V_PATCH=?,REPO_CODE=?,LOG_BUG=?,LOG_GENERAL=?,LOG_FEATURE=?,STATUS=?
            where PRJ_VERSION.ID=? and PRJ_VERSION.STATUS=0`;
            params = [projectId, major, minor, patch, repoCode, log.bug, log.general, log.feature, release, ID];
        } else {
            sql = `insert into PRJ_VERSION 
            (PRJ_FK,V_MAJOR,V_MINOR,V_PATCH,USER_FK,REPO_CODE,LOG_BUG,LOG_GENERAL,LOG_FEATURE,STATUS,TYPE) 
            values (?,?,?,?,?,?,?,?,?,?,?)`;
            params = [projectId, major, minor, patch, userId, repoCode, log.bug, log.general, log.feature, release, type];
        }
        DBController.insert(sql, params)
        .then((res) => {
            this.getOneVersion(res.insertId || ID).then( data => {
                defer.resolve(data);
            });
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    },
    getManage: function (id) {
        let all = q.all([this.getProject(id), this.getUser(id), this.getTask(id), this.getVersion(id), this.getRoleList(id), this.getPowerList()]);
        return all;
    },
    getProject(id) {
        return DBController.query('select * from PROJECT where ID=?', [id]);
    },
    getUser(id) {
        return DBController.query(`select user.ID,user.USER_NAME,GROUP_FK,EMAIL,prj_member.PRJ_FK,ROLE_FK,ROLE_NAME,POWER from user 
                            left join prj_member on prj_member.USER_FK=user.ID 
                            left join prj_role on prj_member.ROLE_FK=prj_role.ID 
                            where prj_member.PRJ_FK=? and prj_role.PRJ_FK=?`, [id,id]);
    },
    getTask(id) {
        return DBController.query('select * from PRJ_TASK where PRJ_FK=?', [id]);
    },
    getVersion(id) {
        return DBController.query('select * from PRJ_VERSION where PRJ_FK=?', [id]);
    },
    getRoles(id) {
        return DBController.query('select * from PRJ_ROLE where PRJ_FK=?', [id]);
    },
    getPowerList() {
        return DBController.query('select * from PRJ_POWER');
    },
    getOneVersion: function (id) {
        return DBController.query('select * from PRJ_VERSION where ID=?', [id]);
    }
});
module.exports = ProjectController.create();