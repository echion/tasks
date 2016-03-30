// 'use strict';

// var dropDatabase = require('./drop-database');

// describe('result model', function() {
//     var db;

//     before('init app', function(done) {
//         require('../../app');
//         db = require('../../db');

//         done();
//     });

//     beforeEach('drop database', function(done) {
//         dropDatabase(done);
//     });

//     beforeEach('add test data', function(done) {
//         var model = require('../../models/tag');

//         model.defineAsync('Test1')
//             .then(done)
//             .catch(done);
//     });

//     it('find all with undefined filter should still return', function(done) {
//         model.findAsync()
//             .then(function(tasks) {
//                 tasks.should.be.empty();
//                 done();
//             });
//     });
// });