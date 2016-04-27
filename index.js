/**
 * require main
 */
const winston = require('winston'),
  TcpTransport = require('./libs/TcpTransport'),
  UdpTransport = require('./libs/UdpTransport');
winston.transports.TcpTransport = TcpTransport;
winston.transports.UdpTransport = UdpTransport;
