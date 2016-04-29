  "use strict";
  
  let winston = require('winston'),
  influxdb =require('../index'),
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.TcpTransport)({ //send by tcp
        level:'info', //logger level
        host:'192.168.102.162', //influxdb host
        port:'8016',//influxdb port
        database:'log5',//influxdb database
        measurement:'example'//influxdb measurement
      }),
      new (winston.transports.UdpTransport)({ //send by udp
        level:'debug', //logger level
        host:'192.168.102.162', //influxdb host
        port:'4444',//influxdb port
        measurement:'example'
      }),
      new (winston.transports.Console)()
    ]
  });
  
  logger.log('info', 'Hello distributed log files!','dasda');
  logger.info('Hello again distributed logs');

  logger.level = 'debug';
  logger.log('error', 'Now my debug messages are written to console!');
  logger.log('debug', 'Ncze!');
  
  setTimeout(function(){
    logger.log('info','lalala');
  },1000)