  var winston = require('winston');
  var influxdb =require('../index');
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.InfuxdbLogger)({
        level:'info', //logger level
        host:'192.168.102.162', //influxdb host
        port:'8085',//influxdb port
        database:'log5',//influxdb database
        measurement:'example'//influxdb measurement
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