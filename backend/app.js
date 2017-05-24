'use strict';
let app = require('express')();
let http = require('http').Server(app);
let bodyParser = require('body-parser');
let UserController = require('./controllers/user-controller');
let ProjectController = require('./controllers/project-controller');
let DbController = require('./controllers/db-controller');
let GroupController = require('./controllers/group-controller');
let httpService = require('./base/http-service');
let q = require('q');

let { dataJson: dataJson, http: _http, checkPower } = httpService;
const projectPowerMap = {
    'version.patch': 1,
    'version.minor': 2,
    'version.major': 4,
    'task': 8,
    'member': 16,
    'project': 32,
    'role': 64
}
app.use(bodyParser());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
// app.get('*', function (req, res) {
//     res.redirect('/');
// })
app.get('/', function(req, res){
	res.sendFile( __dirname + '/..' + "/frontend/src/index.html" );
});

app.post('/login', function (req, res) {
    let userInfo = req.body;
    userInfo.IP = req.ip;
    UserController.login(userInfo).then(function (user) {
        if(user) {
            res.end(dataJson(user));
        } else {
            res.end(dataJson(null, 1, 'login failed'));
        }
    }, function (err) {
        res.end(dataJson(null, 1, 'Invalid USER_NAME or PASSWORD'));
    });
});
app.post('/checkIdentity', _http(function (req, res, __user) {
    let userInfo = req.body || {};
    userInfo.IP = req.ip;
    userInfo.__user = __user;
    UserController.checkLogin(userInfo).then(function (user) {
        res.end(dataJson(user));
    }, function () {
        console.log('user check failed')
        res.end(dataJson(null, 1, 'Current user is out of date, please sign in again.'));
    });
}));
app.post('/checkprojectauth', _http(function (req, res, __user) {
    let projectId = req.body.id;
    UserController.checkProjectAuth(projectId, __user).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('project access denied');
        res.end(dataJson(null, 1, err));
    });
}));
app.post('/logout', _http(function (req, res, __user) {
    UserController.logout(__user);
    res.end(dataJson(true));
}));
app.get('/group/list', _http(function (req, res) {
    GroupController.getList().then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('get group list fail')
        res.end(dataJson(null, 1, 'info: ' + err));ß
    });
}));
app.post('/group/add', _http(function (req, res) {
    let params = req.body;
    GroupController.add(params).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('add group fail')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.get('/group/manage', _http(function (req, res) {
    let groudId = req.query.id;
    GroupController.getManage(groudId).then(function (data) {
        res.end(dataJson({
            projects: data[0]
        }));
    }, function (err) {
        console.log('get group manage failed')
        res.end(dataJson(null, 1, 'info: ' + err));ß
    })
}));
app.get('/user/list', _http(function (req, res) {
    let groudId = req.query.groupId;
    let params = {
        groupId: groudId
    };
    UserController.getList(params).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('get user list failed');
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.post('/user/add', _http(function (req, res) {
    let userInfo = req.body;
    UserController.add(userInfo).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('add user failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.post('/user/delete', _http(function (req, res) {
    let userId = req.body.id;
    UserController.deleteUser(userId).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('delete user failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.get('/project/list', _http(function (req, res) {
    ProjectController.getList().then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('get project list failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.get('/project/getlastestversion', function (req, res) {
    let projectId = req.query.id;
    ProjectController.getLastestVersion(projectId).then(function (data) {
        res.end(dataJson(data[0]));
    }, function (err) {
        console.log('get lastest version failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
});
app.post('/project/add', _http(function (req, res, __user) {
    let project = req.body;
    project.$hash = __user.$hash;
    ProjectController.add(project).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('add project failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.get('/project/manage', _http(function (req, res) {
    let projectId = req.query.id;
    ProjectController.getManage(projectId).then(function (data) {
        res.end(dataJson({
            project: data[0],
            members: data[1],
            tasks: data[2],
            versions: data[3],
            roles: data[4],
            powers: data[5]
        }));
    }, function (err) {
        console.log('get project manage failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, function(__user, req) {
    return (__user) && (__user.projectAccess) && (__user.projectAccess.projectId === req.query.id);
}));
app.get('/project/role/list', _http(function (req, res) {
    let projectId = req.query.id;
    ProjectController.getRoleList(projectId).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('get project role list fail');
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, function($hash, req) {
    let userId = UserController.getUserIDFromHash($hash);
    let __user = UserController.loginUser.findByAttr('ID', userId);
    return (__user) && (__user.projectAccess) && (__user.projectAccess.projectId === req.query.id);
}));
app.post('/project/role/update', _http(function (req, res, __user) {
    let {roleId, value} = req.body;
    ProjectController.updateRole(roleId, value, __user).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('update project role failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, projectPowerMap['role']));
app.post('/project/role/delete', _http(function (req, res) {
    let {roleId, projectId} = req.body;
    ProjectController.deleteRole(roleId, projectId).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('delete project failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, projectPowerMap['role']));
app.post('/project/role/add', _http(function (req, res) {
    let {roleName, value, projectId} = req.body;
    ProjectController.addRole(roleName, value, projectId).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('add project role failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}));
app.post('/project/user/add', _http(function (req, res) {
    let userInfo = req.body;
    ProjectController.addUser(userInfo).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('add user to project failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, projectPowerMap['member']));
app.post('/project/user/delete', _http(function (req, res) {
    let userId = req.body.userId,
        projectId = req.body.projectId;
    ProjectController.deleteUser(userId, projectId).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('delete user from project failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    })
}, projectPowerMap['member']));
app.post('/project/version/update', _http(function (req, res, __user) {
    let {major, minor, patch, projectId, repoCode, log, ID, release, type} = req.body;
    let userID = __user.ID;
    ProjectController.updateVersion(major, minor, patch, projectId, repoCode, log, userID, ID, release, type).then(function (data) {
        res.end(dataJson(data));
    }, function (err) {
        console.log('update project version failed')
        res.end(dataJson(null, 1, 'info: ' + err));
    });
}, function(__user, req) {
    let defer = q.defer();
    let {major, minor, patch, projectId} = req.body;
    DbController.query('select V_MAJOR,V_MINOR,V_PATCH from PRJ_VERSION where PRJ_FK=? order by ID desc limit 0,1', [projectId])
    .then(function(data) {
        if (data && data.length > 0) {
            data = data[0];
        } else {
            data = {};
        }
        let updateType = [];
        if (data.V_PATCH !== patch) {
            updateType.push('version.patch');
        }
        if (data.V_MINOR !== minor) {
            updateType.push('version.minor');
        }
        if (data.V_MAJOR !== major) {
            updateType.push('version.major');
        }
        let flag = true;
        updateType.forEach(function(item) {
            flag = (flag && checkPower(projectPowerMap[item], __user.$hash));
        });
        if (flag) {
            defer.resolve(true);
        } else {
            defer.reject(false);
        }
    }, err => {
        console.log(err);
        defer.reject(err);
    });
    return defer.promise;
}));

http.listen(8000, function(){
	console.log('listening on *:8000');
});
