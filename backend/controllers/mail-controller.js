'use strict';
const q = require('q');
const fs = require('fs');
const mailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const exphbs  = require('express-handlebars');

let Controller = require('../base/controller');
let DBController = require('./db-controller');

let MailController = new Controller(function() {
    
});
MailController.include({
    send (subject, context, receivers, template) {
        // create reusable transporter object using the default SMTP transport
        let transporter = mailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // secure:true for port 465, secure:false for port 587
            auth: {
                user: 'hayden.zhu@ytwoformative.com',
                pass: 'Zhu98370'
            }
        });

        transporter.use('compile', hbs({
            viewEngine: exphbs.create({ }),
            viewPath: 'templates'
        }));

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Version Control" <hayden.zhu@ytwoformative.com>', // sender address
            to: receivers.join(','), // list of receivers
            subject: subject, // Subject line
            template: template,
            context: context
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    },
    sendVersionAlert(projectId, __user) {
        try {
            let p1 = DBController.query('select EMAIL from user where ID in (select USER_FK from prj_member where PRJ_FK=?)', [projectId]),
                p2 = DBController.query('select ID,PRJ_NAME,CURRENT_VERSION,CURRENT_D_VERSION from project where ID=?', [projectId]),
                p3 = DBController.query('select CLOSE_DATE,REPO_CODE,LOG_BUG,LOG_FEATURE,LOG_GENERAL from prj_version where prj_version.PRJ_FK=? order by ID desc limit 0,1', [projectId])
            let receivers;
            let context = {};
            context.user = __user;
            p1.then(data => {
                receivers = data.map(item => item.EMAIL);
                return p3;
            }).then(data => {
                Object.assign(context, data[0]);
                return p2;
            }).then(data => {
                Object.assign(context, data[0]);
                context.CLOSE_DATE = context.CLOSE_DATE.toLocaleTimeString() + ' ' + context.CLOSE_DATE.toLocaleDateString();
                const subject = `Version Control: Project [${context.PRJ_NAME}] #${context.ID} version has been updated`;
                const template = 'version-alert';
                this.send(subject, context, receivers, template);
            });
        } catch(e) {
            console.log(e);
        }
    }
});
module.exports = MailController.create();