'use strict';

var dropDatabase = require('./drop-database'),
    app,
    agent;

describe('[API] /tags routes', function() {
    var tag;

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
            .post('/tags')
            .send({ name: 'Testing1' })
            .expect(201)
            .expect(function(res) {
                tag = res.body;
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .post('/tags')
                    .send({ name: 'Testing2' })
                    .expect(201)
                    .end(done);
            });
    });

    it('GET should return all tags', function(done) {
        agent
            .get('/tags')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(2);
            })
            .end(done);
    });

    it('GET /:id should return a tag', function (done) {
        agent
            .get('/tags/' + tag.id)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.id.should.equal(tag.id);
            })
            .end(done);
    });

    it('GET ?name={name} should return a tag', function(done) {
        agent
            .get('/tags?name=' + tag.name)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(1);
                res.body[0].id.should.equal(tag.id);
            })
            .end(done);
    });

    it('GET ?name={name} should be case insensitive', function(done) {
        agent
            .get('/tags?name=' + tag.name.toLowerCase())
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(1);
                res.body[0].id.should.equal(tag.id);
            })
            .end(done);
    });

    it('GET ?name={name} with missing name should return empty array', function(done) {
        agent
            .get('/tags?name=junk')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                res.body.length.should.equal(0);
            })
            .end(done);
    });

    it('GET /:id with missing id should return not found', function(done) {
        agent
            .get('/tags/0')
            .expect(404)
            .end(done);
    });

    it('GET /:id with invalid id should return bad request', function(done) {
        agent
            .get('/tags/s')
            .expect(400)
            .end(done);
    });

    it('POST should add a tag', function(done) {
        agent
            .post('/tags')
            .send({ name: 'another new tag'})
            .expect(201)
            .expect(function(res) {
                res.body.should.have.property('id');
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tags/' + tag.id)
                    .expect(200)
                    .end(done);
            });
    });

    it('POST with existing tag name should return that tag', function(done) {
        agent
            .post('/tags')
            .send({ name: tag.name })
            .expect(200)
            .expect(function(res) {
                res.body.id.should.equal(tag.id);
                res.body.name.should.equal(tag.name);
            })
            .end(done);
    });

    it('POST with existing tag name should be case insensitive', function(done) {
        agent
            .post('/tags')
            .send({ name: tag.name.toLowerCase() })
            .expect(200)
            .expect(function(res) {
                res.body.id.should.equal(tag.id);
                res.body.name.should.equal(tag.name);
            })
            .end(done);
    });

    it('POST with undefined name should return bad request', function(done) {
        agent
            .post('/tags')
            .send({ })
            .expect(400)
            .end(done);
    });

    it('POST with invalid property should return bad request', function(done) {
        agent
            .post('/tags')
            .send({ desc: 'stuff' })
            .expect(400)
            .end(done);
    });

    it('PUT /:id should update a tag', function(done) {
        agent
            .put('/tags/' + tag.id)
            .send({ name: 'name2'})
            .expect(200)
            .expect(function(res) {
                res.body.name.should.equal('name2');
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tags/' + tag.id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.name.should.equal('name2');
                    })
                    .end(done);
            });
    });

    it('PUT /:id with undefined name should return bad request', function(done) {
        agent
            .put('/tags/' + tag.id)
            .send({ })
            .expect(400)
            .end(done);
    });

    it('PUT /:id with invalid property should return bad request', function(done) {
        agent
            .put('/tags/' + tag.id)
            .send({ desc: 'stuff' })
            .expect(400)
            .end(done);
    });

    it('DELETE /:id should remove the tag', function(done) {
        agent
            .delete('/tags/' + tag.id)
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/tags/' + tag.id)
                    .expect(404)
                    .end(done);
            });
    });

    it('DELETE /:id with invalid id should return bad request', function(done) {
        agent
            .delete('/tags/s')
            .expect(400)
            .end(done);
    });

    it('DELETE /:id with missing id should ignore the attempt and return', function(done) {
        agent
            .delete('/tags/0')
            .expect(204)
            .end(done);
    });
});