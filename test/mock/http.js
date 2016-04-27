"use strict";

/**
 * mock http
 * @type {Object}
 */
let http = {
    request:function(options,cb) {
        cb({
            on:function(event,cb) {
                if(event == 'data') {
                    cd(http.buff);
                } else {
                    cb();
                }
            }
        })

        return {
            write:function(line) {
                http.writeRet = line;
            },
            end:function() {

            }
        }
    },
    buff: null
    writeRet: null
};

module.exports = http；