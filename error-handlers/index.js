module.exports = function(app) {
	'use strict';

	//app.use(require('./error-logger'));
	app.use(require('./not-found-handler'));
	app.use(require('./validation-error-handler'));	
	app.use(require('./default-error-handler'));
};