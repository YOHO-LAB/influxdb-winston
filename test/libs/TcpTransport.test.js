"use strict";

let expect = require('expect.js'),
    rewire = require('rewire'),
    http = require('../mock/http'),
    os = require('os');

describe('/libs/TcpTransport', function() {
    let TcpTransport = rewire("../../libs/TcpTransport");
    TcpTransport.__set__('http', http);
    describe('constructor', function() {
        let trans = new TcpTransport({
            level: 'error',
            host: 'xxx',
            port: '1234',
            measurement: 'xxx'
        });

        it('expect trans to be tcpInfuxdbLogger', function() {
            expect(trans.name).to.be('tcpInfuxdbLogger');
        });

        it('expect addline send buffer right value', function() {
            trans.log('info', 'xxx', {}, function() {});
            let line = 'xxx,host=' + os.hostname() + ',pid=' + process.pid + ',level=info message="xxx",meta="{}"';
            expect(http.writeRet).to.be(line);
        });

        it('init database async,log add first,when database done,log add batch!', function(done) {
            http.async = true;
            let atrans = new TcpTransport({
                level: 'error',
                host: 'xxx',
                measurement: 'xxx'
            });
            let i = 0;
            atrans.log('info', 'xxx','123',function(){
                i++;
            });
            atrans.log('info', 'xxx','123',function(){
                i++;
            });
            if(i>1) {
                expect(i).to.be(2);
            }

            setTimeout(done,50);
        });
    });

});