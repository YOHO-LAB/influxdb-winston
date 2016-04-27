"use strict";

//winston logger
const Transport = require('winston').Transport,
    os = require('os');

/**
 * @class BaseTranport
 * @description Logger transport base class
 * @author hbomb qiqi.zhou@gmail.com
 */
class BaseTranport extends Transport {
    
    /**
     * @description init options
     */
    constructor(options) {
        super(options);
        this.level = options.level || 'info';
        this.options = options;
        this.logs = [];
    }

    /**
     * @method log
     * @description tranport log to influxdb
     * @param {String} level log level
     * @param {String} msg log message
     * @param {Object} meta log meta object
     * @param {Function} callback callback function
     */
    log(level, msg, meta, callback) {
        if (!this.options.measurement) {
            this.options.measurement = 'log';
        }

        //make influxdb create line
        this.options.line = this.makeLine(this.options.measurement, level, msg, meta);

        this.addLine();

        callback(null, true);
    }


    /**
     * @method addLine
     * @description abstract method,for sub class implement
     */
    addline() {

    }

    /**
     * @method makeLine
     * @description format line protocol
     * @param {String} measurement influxdb's measurement
     * @param {String} level log level 
     * @param {String} msg log message
     * @param {String} meta log meta
     */
    makeLine(measurement, level, msg, meta) {

        //if meta is object to string. 
        if (typeof meta === 'object') {
            meta = JSON.stringify(meta);
        }

        //make tags
        let tags = [
            'host=' + os.hostname(),
            'pid=' + process.pid,
            'level=' + level,

        ]

        //make fields
        let fields = [
            'message="' + msg + '"',
            'meta="' + meta + '"'
        ];

        //make a line
        tags = tags.join(',');
        fields = fields.join(',');

        return measurement + ',' + tags + ' ' + fields;
    }
}

module.exports = BaseTranport;
