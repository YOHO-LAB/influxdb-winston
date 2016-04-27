"use strict";
//Base Class for influxdb trabsport
let BaseTransport = require('./BaseTransport'),
  http = require('http');

//for make influxdb query string 
const CREATE_DATA_BASE = "/query?q=CREATE%20DATABASE%20";
const ADD_LINE_PREIX = "/write?db=";


/**
 * @class TcpTransport
 * @author hbomb qiqi.zhou@gmail.com
 */
class TcpTransport extends BaseTransport {

  /**
   * @description init options and init database
   * @example {
   *     level:'warn' //logger level
   *     host:'127.0.0.1' //influxdb host
   *     port:'8085'//influxdb port
   *     database:'log'//influxdb database
   *     measurement:'api'//influxdb measurement
   *  }
   */
  constructor(options) {
    super(options);
    this.name = "tcpInfuxdbLogger";
    let that = this;
    this.initDatabase(function () {
      that.isCreated = true;
      that.options.line = false;
      that.addLine();
    });
  }

  /**
   * @method initDatabase
   * @description init database
   * @param {Function} callback
   */
  initDatabase(callback) {
    let path = CREATE_DATA_BASE + (this.options.database || 'log');
    let opts = this.makeReq(path, 'GET');

    //send to influxdb create database
    let req = http.request(opts, function (res) {
      let chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        let body = Buffer.concat(chunks);
        callback(res, body.toString());
      });
    });
    req.end();
  }

  /**
   * make a request options
   * @param {String} path send path
   * @param {String} method http method
   */
  makeReq(path, method) {
    let opts = this.options,
      options = {
        "method": method,
        "hostname": opts.host,
        "port": opts.port || '8086',
        "path": path
      };
    return options;
  }

  /**
   * @method addLine
   * @description insert a line to influxdb
   */
  addLine() {
    let logger = this,
      path = ADD_LINE_PREIX + (logger.options.database || 'log'),
      options = this.makeReq(path, 'POST'),
      line = logger.options.line,
      logs = logger.logs;

    //if influxdb database uninit,add line to a array;
    if (!logger.isCreated) {
      logger.logs.push({
        opts: options,
        line: line
      });
    } else {

      //send to influxdb
      this.sendLine(options,line);
      if (logs.length < 1) {
        return;
      }

      //send logs's line to influxdb
      for (var i = 0; i < logs.length; i++) {
        this.sendLine(logs[i].opts,logs[i].line);
      }

      // empty logs array.
      logger.logs = [];
    }
  }

  /**
   * @method sendLine
   * @description send to influxdb
   * @param {Object} options request
   * @param {String} line influxdb line
   */
  sendLine(options,line) {
    if (!line) {
      return;
    }
    let req = http.request(options);
    req.write(line);
    req.end();
  }
}

module.exports = TcpTransport;