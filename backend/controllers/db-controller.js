'use strict';
let mysql  = require('mysql');
let q = require('q');
let Controller = require('../base/controller');
let DBController = new Controller(function() {
    this.dbConfig = {
        host     : '127.0.0.1',       //主机
        user     : 'root',            //MySQL认证用户名
        password : 'rD5053',
        port     : '3306',
        database : 'vcdb'
    };
    this.pool = mysql.createPool(this.dbConfig);
    console.log('[pool connect]  succeed!');
});
DBController.include({
    connect: function () {
        this.connection.connect(function(err){
            if(err){       
                console.log('[query] - :'+err);
                return;
            }
            console.log('[connection connect]  succeed!');
        });
    },
    query: function (sql, params = []) {
        let defer = q.defer();
        this.pool.getConnection(function (err, connection) {
            connection.query(sql, params,function(err, rows, fields) {
                if(err) {
                    defer.reject(err);
                    console.log(err);
                }
                defer.resolve(rows);
                connection.release();
            });
        });
        return defer.promise;
    },
    insert: function (sql, params) {
        let defer = q.defer();
        this.pool.getConnection(function (err, connection) {
            connection.query(sql, params,function(err, result) {
                if(err) {
                    defer.reject(err);
                    console.log('db insert failed: ' + err.message);
                    return;
                }
                console.log('db insert successed: ' + result.insertId);
                defer.resolve(result);
                connection.release();
            });
        });
        return defer.promise;
    },
    transaction: function ({sql, params, callback}) {
        let masterDefer = q.defer();
        this.pool.getConnection(function (err, connection) {
            connection.beginTransaction(function () {
                let defer = q.defer();
                console.log('start transaction...');
                connection.query(sql, params, function (err, result) {
                    if(err) {
                        defer.reject(err);
                    } else {
                        console.log('insert base successed!');
                        defer.resolve(result);
                    }
                });
                let defer2 = q.defer();
                defer.promise.then(function (result) {
                    console.log('start next insert...')
                    let sqlList = callback(result.insertId);
                    for(let i = 0, item; (item = sqlList[i]); i ++) {
                        console.log(item)
                        connection.query(item.sql, [item.params], function (err, result) {
                            if (err) {
                                defer2.reject(err);
                            } else {
                                console.log('insert child '+ i +' successed!');
                                if (i === sqlList.length - 1) {
                                    defer2.resolve(result);
                                }
                            }
                        });
                    }
                }, function (err) {
                    console.log('insert base failed');
                    console.log(err);
                    defer2.reject(err);
                });
                defer2.promise.then(function (result) {
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                masterDefer.reject(err);
                                connection.release();
                            });
                        } else {
                            masterDefer.resolve(true);
                            console.log('transaction successed!');
                            connection.release();
                        }
                    })
                }, function (err) {
                    console.log('insert child failed');
                    // console.log(err);
                    connection.rollback(function () {
                        console.log("transaction error: " + err);
                        masterDefer.reject(err);
                        connection.release();
                    });
                })
            })
        });
        return masterDefer.promise;
    },
    disconnect: function () {
        this.connection.end(function(err){
            if(err){       
                return;
            }
            console.log('[connection end] succeed!');
        });
    }
});
module.exports = DBController.create();
