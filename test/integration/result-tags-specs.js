'use strict';

var dropDatabase = require('./drop-database'),
    logger = require('../../logger'),
    app,
    agent;

describe('result tags routes', function() {
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
      .expect(200)
      .expect(function(res) {
        tag1 = res.body;
      })
      .end(function() {
        agent
          .post('/tags')
          .send({ name: 'tag2' })
          .expect(200)
          .expect(function(res) {
            tag2 = res.body;
          })
          .end(function() {
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

  it('get tags for result should return the tags', function(done) {
    agent
      .get('/results/' + result.id + '/tags')
      .expect(200)
      .expect(function(res) {
        res.body.length.should.equal(1);
        res.body[0].id.should.equal(tag1.id);
      })
      .end(done);
  });

  it('update tags should replace all tags for a result', function(done) {
    agent
      .put('/results/' + result.id + '/tags')
      .send([tag2.id])
      .expect(204)
      .end(function(res) {
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

  it('remove tag from result should remove the relationship', function(done) {
    agent
      .delete('/results/' + result.id + '/tags/' + tag1.id) 
      .expect(204)
      .end(function() {
        agent
          .get('/results/' + result.id + '/tags')
          .expect(200)
          .expect(function(res) {
            res.body.length.should.equal(0);
          })
          .end(done);
      });
  });
});