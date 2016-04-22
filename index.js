var util = require('util'),
    winston = require('winston'),
    http = require("http"),
    os = require('os');
  
/**
 *  add InfuxdbLogger to winston
 *  @param {Object} options logger options
 *  eg.
 *  {
 *     level:'warn' //logger level
 *     host:'127.0.0.1' //influxdb host
 *     port:'8085'//influxdb port
 *     database:'log'//influxdb database
 *     measurement:'api'//influxdb measurement
 *  }
 * 
 */
var InfuxdbLogger = winston.transports.InfuxdbLogger = function (options) {
  var that = this;
  this.name = 'infuxdbLogger';
  this.level = options.level || 'info';
  this.options = options;
  this.logs = [];
  
  initDatabase(this.options,function(){
    that.isCreated = true;
    that.options.line = false;
    addLine(that);
  });
};

util.inherits(InfuxdbLogger, winston.Transport);

//log transport
InfuxdbLogger.prototype.log = function (level, msg, meta, callback) {
    if(!this.options.measurement) {
      this.options.measurement = 'log';
    }
    
    //make influxdb create line
    this.options.line = makeLine(this.options.measurement,level,msg,meta);
    
    addLine(this);
   
    callback(null,true);
};

/**
 * make a request options
 * @param {Object} opts 
 */
function makeReq(opts,path,method) {
    var options = {
    "method": method,
    "hostname": opts.host,
    "port": opts.port || '8086',
    "path": path
  };
  return  options;
}


/**
 * init database
 * @param {Object} options logger config
 * @param {Function} callback
 */
function initDatabase(options,callback) {
  var path = "/query?q=CREATE%20DATABASE%20"+ (options.database||'log');
  var opts = makeReq(options,path,'GET');

  //send to influxdb create database
  var req = http.request(opts,function(res){
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        callback(res,body.toString());
      });
  });
  req.end();
}

/**
 * insert a line to influxdb
 * @param {Logger} logger logger
 */
function addLine(logger) {
  var path = "/write?db="+ (logger.options.database||'log');
  var options = makeReq(logger.options,path,'POST');
  var line = logger.options.line;
  var logs = logger.logs;
  
  //if influxdb database uninit,add line to a array;
  if(!logger.isCreated) {
    logger.logs.push({
      opts:options,
      line:line
    });
  } else {
    
    //send to influxdb
    sendLine(options,line);
    if(logs.length<1) {
      return;
    }
    
    //send logs's line to influxdb
    for(var i = 0; i<logs.length;i++) {
      sendLine(logs[i].opts,logs[i].line);
    }
    
    // empty logs array.
    logger.logs = [];
  }
}

/**
 * send to influxdb
 * @param {Object} opts send options
 * @param {String} line influxdb line
 */
function sendLine(opts,line) {
  if(!line) {
    return;
  }
  var req = http.request(opts);
  req.write(line);
  req.end();
}

/**
 * format line protocol
 * @param {String} measurement influxdb's measurement
 * @param {String} level log level 
 * @param {String} msg log message
 * @param {String} meta log meta
 */
function makeLine(measurement,level,msg,meta) {
  if(typeof meta ==='object')
  {
     meta = JSON.stringify(meta);
  } 
  
  //make tags
  var tags = [
    'host=' + os.hostname(),
    'pid=' + process.pid,
    'level=' + level,
    
  ]
  
  var fields = [
    'message="' + msg + '"',
    'meta="' + meta + '"'
  ] ;
  
  tags = tags.join(',');
  fields = fields.join(',');
  
  return measurement + ',' + tags + ' ' + fields;
}