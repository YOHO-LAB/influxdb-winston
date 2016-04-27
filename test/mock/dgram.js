"use strict";

/**
 * dgram mock
 * @type {Object}
 */
let dgram = {
    createSocket:function(name) {
        return {
            send:function(p1,p2,p3,p4,p5,function() {

            }),
            close:function() {

            }
        }
    }
}

module.exports = dgram;