'use strict';

module.exports = function(app) {
    //app.use(require('./error-logger'));
    app.use(require('./not-found-handler'));
    app.use(require('./validation-error-handler'));
    app.use(require('./default-error-handler'));
};