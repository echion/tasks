'use strict';

var dropDatabase = require('./drop-database');

describe('[MODEL] Result model', function() {
    var model = require('../../models/result');

    before('init app', function(done) {
        require('../../app');
        done();
    });

    beforeEach('drop database', function(done) {
        dropDatabase(done);
    });

    it('find all with undefined filter should still return', function(done) {
        model.findAsync()
            .then(function(tasks) {
                tasks.should.be.empty();
                done();
            });
    });
});