"use strict";

let expect = require('expect.js'),
rewire = require('rewire'),
Transport = require('../mock/winston').Transport,
os = require('../mock/os');

describe('/libs/BaseTransport',function(){
    let BaseTransport = rewire("../../libs/BaseTransport");
    BaseTransport.__set__('Transport',Transport);
    BaseTransport.__set__('os',os);
    describe('constructor',function(){
        let trans = new BaseTransport({
            level:'error',
            host:'xxx',
            port:'1234',
            measurement:'xxx'
        });

        it('level do not set expect default info',function(){
            let trans = new BaseTransport({
                host:'xxx',
                port:'1234',
                measurement:'xxx'
            });
            expect(trans.level).to.be('info');
        });

        it('init options expect right level,options,logs',function(){
            trans.log('info','xxx',{},function(){});
            expect(trans.options.host).to.be('xxx');
            expect(trans.level).to.be('error');
            expect(trans.options.port).to.be('1234');
            expect(trans.options.measurement).to.be('xxx');
        });

        it('expect log method measurement null set in log',function(){
            trans.options.measurement = null;
            trans.log('info','xxx',{},function(){});
            expect(trans.options.measurement).to.be('log');
        });

        it('expect makeLine meta is not object',function(){
            trans.log('info','xxx',1231,function(){});
            expect(trans.options.line).to.be('log,host=test,pid='+process.pid+',level=info message="xxx",meta="1231"');
        })
    });

});