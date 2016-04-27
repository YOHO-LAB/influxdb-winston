"use strict";

/**
 * os mock
 * @type {Object}
 */
let os = {
    hostname : function() {
        return 'test'
    }
}

module.exports = os;