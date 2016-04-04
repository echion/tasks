'use strict';

var dropDatabase = require('./drop-database'),
    app,
    agent;

describe('[API] /results/:id/tags routes', function() {
    var result, tag1, tag2;

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
            .send({ name: 'tag1'})
            .expect(201)
            .expect(function(res) {
                tag1 = res.body;
            })
            .end(function(err) {
                if (err) return done(err);

                agent
                    .post('/tags')
                    .send({ name: 'tag2' })
                    .expect(201)
                    .expect(function(res) {
                        tag2 = res.body;
                    })
                    .end(function(err2) {
                        if (err2) return done(err2);

                        agent
                            .post('/results')
                            .send({
                                name: 'Testing',
                                tags: [tag1.id]
                            })
                            .expect(201)
                            .expect(function(res) {
                                result = res.body;
                            })
                            .end(done);
                    });
            });
    });

    it('GET should return the tags for a result', function(done) {
        agent
        .get('/results/' + result.id + '/tags')
        .expect(200)
        .expect(function(res) {
            res.body.length.should.equal(1);
            res.body[0].id.should.equal(tag1.id);
        })
        .end(done);
    });

    it('PUT should replace all tags for a result', function(done) {
        agent
            .put('/results/' + result.id + '/tags')
            .send([tag2.id])
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id + '/tags')
                    .expect(200)
                    .expect(function(res) {
                        res.body.length.should.equal(1);
                        res.body[0].id.should.equal(tag2.id);
                    })
                    .end(done);
            });
    });

    it('DELETE /:tagId should remove a tag relationship from a result', function(done) {
        agent
            .delete('/results/' + result.id + '/tags/' + tag1.id)
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id + '/tags')
                    .expect(200)
                    .expect(function(res) {
                        var found = res.body.find(function(item) {
                            return item.id === tag1.id;
                        });

                        expect(found).to.be.undefined;
                    })
                    .end(done);
            });
    });

    it('DELETE with unrealted tag id should ignore the attempt and return', function(done) {
        agent
            .delete('/results/' + result.id + '/tags/0')
            .expect(204)
            .end(function(err) {
                if (err) return done(err);

                agent
                    .get('/results/' + result.id + '/tags')
                    .expect(200)
                    .expect(function(res) {
                        res.body.length.should.equal(1);
                        res.body[0].id.should.equal(tag1.id);
                    })
                    .end(done);
            });
    });
});