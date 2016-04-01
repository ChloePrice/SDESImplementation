"use strict";

var des = require('./encryption.js');
var vorpal = require('vorpal')();



vorpal
    .command('encrypt', 'Encrypt a message with simplified DES".')
    .action(function(args, callback) {
        vorpal.log('Not Implemented Yet. :\'(');
        callback();
    });

vorpal
    .command('test', 'This is used to test a dev function')
    .action(function (args,  cb) {
        des.test(args, cb);
    });

vorpal
    .delimiter('Jinx$')
    .show();