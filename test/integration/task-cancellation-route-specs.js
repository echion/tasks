'use strict';

var dropDatabase = require('./drop-database'),
    app,
    agent;

describe('task cancellation', function() {
    var task;

    before('init app', function(done) {
        app = require('../../app');
        done();
    });

    beforeEach('drop database', function(done) {
        dropDatabase(done);
    });

    beforeEach('init agent', function(done) {
        agent = request.agent(app);
        done();
    });

    beforeEach('add test data', function(done) {
        agent
            .post('/tasks')
            .send({ name: 'Testing' })
            .expect(201)
            .expect(function(res) {
                task = res.body;
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .post('/tasks/' + task.id + '/cancel')
                    .expect(204)
                    .end(done);
            });
    });

    it('completing a cancelled task should fail', function(done) {
        agent
            .post('/tasks/' + task.id + '/done')
            .expect(400)
            .end(done);
    });
});