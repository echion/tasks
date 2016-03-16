'use strict';

var dropDatabase = require('./drop-database'),
    taskStatuses = require('../../models/task-statuses'),
    logger = require('../../logger'),
    app,
    agent;

describe('task routes', function() {
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
        logger.debug('task ' + task.id + ' added');
      })
      .end(function() {
        agent
          .post('/tasks')
          .send({ name: 'Testing2' })
          .expect(201)
          .end(done);
      });
  }); 

  it('get should return all tasks', function(done) {
    agent
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
          res.body.length.should.equal(2);
      })
      .end(done);
  });

  it('get by id should return a task', function (done) {
  	agent
  		.get('/tasks/' + task.id)
      .expect(200)
      .expect('Content-Type', /json/)
  		.expect(function(res) {
          res.body.id.should.equal(task.id);
      })
      .end(done);
  });

  it('get by id with missing id should return not found', function(done) {
    agent
      .get('/tasks/0')
      .expect(404)
      .end(done);
  });

  it('get by id with invalid id should return bad request', function(done) {
    agent
      .get('/tasks/s')
      .expect(400)
      .end(done);
  });

  it('post should add a task', function(done) {
    agent
      .post('/tasks')
      .send({ name: 'another new task'})
      .expect(201)
      .expect(function(res) {
        res.body.should.have.property('id');
      })
      .end(function() {
        agent
          .get('/tasks/' + task.id)
          .expect(200)
          .end(done);
      });
  });

  it('post with missing name should return bad request', function(done) {
    agent
      .post('/tasks')
      .send({ notes: 'another new task'})
      .expect(400)
      .end(done);
  });

  it('post with status should return bad request', function(done) {
    agent
      .post('/tasks')
      .send({ name: 'stuff', status: 5 })
      .expect(400)
      .end(done);
  });

  it('done should complete a task', function(done) {
    agent
      .post('/tasks/' + task.id + '/done')
      .expect(204)
      .end(function() {
        agent
          .get('/tasks/' + task.id)
          .expect(200)
          .expect(function(res) {
              res.body.status.should.equal(taskStatuses.Completed);
          })
          .end(done);
      });         
  });

  it('cancel should cancel a task', function(done) {
    agent
      .post('/tasks/' + task.id + '/cancel')
      .expect(204)
      .end(function() {
        agent
          .get('/tasks/' + task.id)
          .expect(200)
          .expect(function(res) {
              res.body.status.should.equal(taskStatuses.Cancelled);
          })
          .end(done);
      });         
  });

  it('delete should remove task', function(done) {
    agent
      .delete('/tasks/' + task.id)
      .expect(204)
      .end(function() {
        agent
          .get('/tasks/' + task.id)
          .expect(404)
          .end(done);
      });         
  });

  it('delete with invalid id should return bad request', function(done) {
    agent
      .delete('/tasks/s')
      .expect(400)
      .end(done);
  });
});