'use strict';

function RuleError (message, status) {
    this.message = message;
    this.status = status;
}

RuleError.prototype = Object.create(Error.prototype);

module.exports = RuleError;