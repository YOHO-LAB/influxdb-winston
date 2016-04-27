"use strict";

/**
 * winston mock
 * @type {Object}
 */
let winston = {
    Transport : function(){},
    transports : {},
    Logger : function(){}
};

module.exports = winston;