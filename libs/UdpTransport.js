"use strict";
//Base Class for influxdb trabsport
let BaseTransport = require('./BaseTransport'),
  dgram = require("dgram");

/**
 * @class UdpTransport
 * @author hbomb qiqi.zhou@gmail.com
 */
class UdpTransport extends BaseTransport {

  /**
   * @description init options and init database
   * @example {
   *     level:'warn' //logger level
   *     host:'127.0.0.1' //influxdb host
   *     port:'4444'//influxdb port
   *     measurement:'api'//influxdb measurement
   *  }
   */
  constructor(options) {
    super(options);
    this.name = "udpInfuxdbLogger";
  }

  /**
   * @method addLine
   * @description insert a line to influxdb
   */
  addLine() {
    let socket=dgram.createSocket("udp4"),
    opts = this.options,
    line = this.options.line,
    buf=new Buffer(line),
    length = buf.length;
    socket.send(buf, 0, length, opts.port,opts.host,  function () {
      socket.close();
    });
  }
}
module.exports = UdpTransport;