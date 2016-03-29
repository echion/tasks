'use strict';

var dropDatabase = require('./drop-database'),
    app,
    agent;

describe('result routes', function() {
    var result, tag;

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
            .post('/results')
            .send({ name: 'Testing1' })
            .expect(201)
            .expect(function(res) {
                result = res.body;
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .post('/results')
                    .send({ name: 'Testing2' })
                    .expect(201)
                    .end(function(err2) {
                        if (err2) return done(err2);

                        agent
                            .post('/tags')
                            .send({ name: 'testing' })
                            .expect(201)
                            .expect(function(res) {
                                tag = res.body;
                            })
                            .end(done);
                    });
            });
    });

    it('get all should return all results', function(done) {
        agent
            .get('/results')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(2);
            })
            .end(done);
    });

    it('get by id should return the result', function (done) {
        agent
            .get('/results/' + result.id)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.id.should.equal(result.id);
            })
            .end(done);
    });

    it('get by id with missing id should return not found', function(done) {
        agent
            .get('/results/0')
            .expect(404)
            .end(done);
    });

    it('get by id with invalid id should return bad request', function(done) {
        agent
            .get('/results/s')
            .expect(400)
            .end(done);
    });

    it('post should add a result', function(done) {
        agent
            .post('/results')
            .send({
                name: 'another new result',
                tags: [tag.id]
            })
            .expect(201)
            .expect(function(res) {
                res.body.should.have.property('id');
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id)
                    .expect(200)
                    .end(done);
            });
    });

    it('put should update a result', function(done) {
        var newName = 'updated name';

        agent
            .put('/results/' + result.id)
            .send({ name: newName})
            .expect(200)
            .expect(function(res) {
                res.body.name.should.equal(newName);
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.name.should.equal(newName);
                    })
                    .end(done);
            });
    });

    it('post with missing name should return bad request', function(done) {
        agent
            .post('/results')
            .send({ })
            .expect(400)
            .end(done);
    });

    it('put with missing name should return bad request', function(done) {
        agent
            .put('/results/' + result.id)
            .send({ })
            .expect(400)
            .end(done);
    });

    it('post with invalid property should return bad request', function(done) {
        agent
            .post('/results')
            .send({ desc: 'stuff' })
            .expect(400)
            .end(done);
    });

    it('post with invalid property should return bad request', function(done) {
        agent
            .put('/results/' + result.id)
            .send({ desc: 'stuff' })
            .expect(400)
            .end(done);
    });

    it('delete should remove result', function(done) {
        agent
            .delete('/results/' + result.id)
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id)
                    .expect(404)
                    .end(done);
            });
    });

    it('delete with invalid id should return bad request', function(done) {
        agent
            .delete('/results/s')
            .expect(400)
            .end(done);
    });
});