'use strict';

var dropDatabase = require('./drop-database'),
    taskStatuses = require('../../models/task-statuses'),
    app,
    agent;

describe('[API] /tasks routes', function() {
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
            .send({ name: 'Testing1' })
            .expect(201)
            .expect(function(res) {
                task = res.body;
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .post('/tasks')
                    .send({ name: 'Testing2' })
                    .expect(201)
                    .end(done);
            });
    });

    it('GET should return all tasks', function(done) {
        agent
            .get('/tasks')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(2);
            })
            .end(done);
    });

    it('GET /:id should return a task', function (done) {
        agent
            .get('/tasks/' + task.id)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.id.should.equal(task.id);
            })
            .end(done);
    });

    it('GET /:id with missing id should return not found', function(done) {
        agent
            .get('/tasks/0')
            .expect(404)
            .end(done);
    });

    it('GET /:id with invalid id should return bad request', function(done) {
        agent
            .get('/tasks/s')
            .expect(400)
            .end(done);
    });

    it('POST should add a task', function(done) {
        agent
            .post('/tasks')
            .send({ name: 'another new task'})
            .expect(201)
            .expect(function(res) {
                res.body.should.have.property('id');
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tasks/' + task.id)
                    .expect(200)
                    .end(done);
            });
    });

    it('POST with undefined name should return bad request', function(done) {
        agent
            .post('/tasks')
            .send({ notes: 'another new task'})
            .expect(400)
            .end(done);
    });

    it('POST with status should return bad request', function(done) {
        agent
            .post('/tasks')
            .send({ name: 'stuff', status: 5 })
            .expect(400)
            .end(done);
    });

    it('POST /:id/done should complete a task', function(done) {
        agent
            .post('/tasks/' + task.id + '/done')
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tasks/' + task.id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.status.should.equal(taskStatuses.Completed);
                    })
                    .end(done);
            });
    });

    it('POST /:id/cancel should cancel a task', function(done) {
        agent
            .post('/tasks/' + task.id + '/cancel')
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tasks/' + task.id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.status.should.equal(taskStatuses.Cancelled);
                    })
                    .end(done);
            });
    });

    it('PUT should update a task', function(done) {
        var notes = 'some notes',
            priority = 1;

        agent
            .put('/tasks/' + task.id)
            .send({
                name: task.name,
                priority: priority,
                notes: notes
            })
            .expect(200)
            .expect(function(res) {
                res.body.should.have.property('id');
                res.body.notes.should.equal(notes);
                res.body.priority.should.equal(priority);
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tasks/' + task.id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.notes.should.equal(notes);
                        res.body.priority.should.equal(priority);
                    })
                    .end(done);
            });
    });

    it('DELETE /:id should remove a task', function(done) {
        agent
            .delete('/tasks/' + task.id)
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tasks/' + task.id)
                    .expect(404)
                    .end(done);
            });
    });

    it('DELETE /:id with invalid id should return bad request', function(done) {
        agent
            .delete('/tasks/s')
            .expect(400)
            .end(done);
    });

    it('DELETE /:id with missing id should ignore the attempt and return', function(done) {
        agent
            .delete('/tasks/0')
            .expect(204)
            .end(done);
    });
});