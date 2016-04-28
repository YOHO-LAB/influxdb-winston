"use strict";

let expect = require('expect.js'),
rewire = require('rewire'),
dgram = require('../mock/dgram'),
os = require('os');

describe('/libs/UdpTransport',function(){
    let UdpTransport = rewire("../../libs/UdpTransport");
    UdpTransport.__set__('dgram',dgram);
    describe('constructor',function(){
        let trans = new UdpTransport({
            level:'error',
            host:'xxx',
            port:'1234',
            measurement:'xxx'
        });

        it('expect trans to be udpInfuxdbLogger',function(){
            expect(trans.name).to.be('udpInfuxdbLogger');
        });

        it('expect addline send buffer right value',function(){
            trans.log('info','xxx',{},function(){});
            let line = 'xxx,host='+os.hostname()+',pid='+process.pid+',level=info message="xxx",meta="{}"'
            let buf = new Buffer(line);
            expect(dgram.ret.buf).to.eql(buf);
            expect(dgram.isClose).to.be(true);
            expect(dgram.ret.end).to.be(buf.length);
            expect(dgram.ret.port).to.be('1234');
            expect(dgram.ret.host).to.be('xxx');
        });
    });

});