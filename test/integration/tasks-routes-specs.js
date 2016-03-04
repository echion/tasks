'use strict';

var dropDatabase = require('./drop-database'),
    app;

describe('task routes', function() {
  var task = { name: 'getById Test Task' };

  before('init app', function(done) {
    app = require('../../app');
    done();
  });

  beforeEach('drop database', function(done) {
    dropDatabase(done);
  });

  beforeEach('add test data', function(done) {
      request.agent(app)
          .post('/tasks')
          .send(task)
          .expect(201)
          .end(function(err, res) {
            task = res.body;
            done();
          });
  }); 

  it('get should return all tasks', function(done) {
    request.agent(app)
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
          res.body[0].id.should.equal(task.id);
      })
      .end(done);
  });

  it('getById should return a task', function (done) {
  	request.agent(app)
  		.get('/tasks/' + task.id)
      .expect(200)
      .expect('Content-Type', /json/)
  		.expect(function(res) {
          res.body.id.should.equal(task.id);
      })
      .end(done);
  });

  it('getById with missing id should return not found', function(done) {
    request.agent(app)
      .get('/tasks/56d7a61f1364243923250138')
      .expect(404)
      .end(done);
  });

  it('getById with invalid id should return bad request', function(done) {
    request.agent(app)
      .get('/tasks/5')
      .expect(400)
      .end(done);
  });

  it('post should add a task', function(done) {
    request.agent(app)
          .post('/tasks')
          .send({ name: 'another new task'})
          .expect(201)
          .expect(function(res) {
            res.body.should.have.property('id');
          })
          .end(done);
  });

  it('post with missing name should return bad request', function(done) {
    request.agent(app)
          .post('/tasks')
          .send({ description: 'another new task'})
          .expect(400)
          .end(done);
  });

  it('delete should remove task', function(done) {
    request.agent(app)
      .delete('/tasks/' + task.id)
      .expect(204)
      .end(done);
  });

  it('delete with invalid id should return bad request', function(done) {
    request.agent(app)
      .delete('/tasks/5')
      .expect(400)
      .end(done);
  });
});