"use strict";

/**
 * dgram mock
 * @type {Object}
 */
let dgram = {
    createSocket:function(name) {
        return {
            send:function(p1,p2,p3,p4,p5,cb) {

                dgram.ret = {
                    buf:p1,
                    start:p2,
                    end:p3,
                    port:p4,
                    host:p5
                };

                cb();
            },
            close:function() {
                dgram.isClose = true;
            }
        }
    },
    ret:false,
    isClose:false
}

module.exports = dgram;