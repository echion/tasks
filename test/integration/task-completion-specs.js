'use strict';

var dropDatabase = require('./drop-database'),
    logger = require('../../logger'),
    app,
    agent;

describe('task completion', function() {
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
      .end(function() {
        agent
          .post('/tasks/' + task.id + '/done')
          .expect(204)
          .end(done);
      });
  }); 

  it('cancelling a completed task should fail', function(done) {
    agent
      .post('/tasks/' + task.id + '/cancel')
      .expect(400)
      .end(done);
  });
});