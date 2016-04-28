
# influxdb-winston

[![NPM Status](https://img.shields.io/npm/v/influxdb-winston.svg)](https://www.npmjs.com/package/influxdb-winston)
[![Build Status](https://travis-ci.org/YOHO-LAB/influxdb-winston.svg?branch=master)](https://travis-ci.org/YOHO-LAB/influxdb-winston)

[![Coverage Status](https://coveralls.io/repos/github/YOHO-LAB/influxdb-winston/badge.svg?branch=master)](https://coveralls.io/github/YOHO-LAB/influxdb-winston?branch=master)

## What is this?

A InfluxDB transport for winston by TCP or UDP.


## Installation

``` bash
mkdir test-influxdb-winston
cd test-influxdb-winston
npm init
npm install winston -save 
npm install influxdb-winston -save
vi app.js
```

## Useage

`app.js`

```javascript
  var winston = require('winston');
  var influxdb =require('../index');
  var logger = new (winston.Logger)({
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
        port:'4444'//influxdb port
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

```