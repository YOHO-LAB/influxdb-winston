"use strict";

/**
 * mock http
 * @type {Object}
 */
let http = {
    request: function(options, cb) {
        if (typeof cb === 'function') {
            cb({
                on: function(event, cb) {
                    if (event == 'data') {
                        cb(new Buffer('done'));
                    } else {
                        if (http.async) {
                            setTimeout(function(){
                                cb();
                            }, 10);
                        } else {
                            cb();
                        }

                    }
                }
            });
        }

        return {
            write: function(line) {
                http.writeRet = line;
            },
            end: function() {

            }
        };
    },
    writeRet: null
};

module.exports = http;