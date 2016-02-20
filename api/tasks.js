module.exports = function(router) {
  	'use strict';

	// This will handle the url calls for /users/:user_id
	router
		.route('/tasks/:taskId')
		.get(function(req, res, next) {
			res.json({
				name: 'Do it!'
			});
		}) 
		.delete(function(req, res, next) {
		
		});

	router
		.route('/tasks/')
		.get(function(req, res, next) {
			
		}).post(function(req, res, next) {
		
		});
};