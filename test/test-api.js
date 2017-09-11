var chai = require('chai');
var chaiHttp = require('chai-http');
var apitaunt = require('../lib/apitaunt');
var should = chai.should();

chai.use(chaiHttp);

var server;
var TEST_PORT = 9090;
var TEST_SERVER = 'http://localhost:' + TEST_PORT;

server = new apitaunt.Server(TEST_PORT, 'test');
server.run();

it('Should Return Status 200 with test file', function(done) {
    chai.request('http://127.0.0.1:9090')
        .get('/api/test')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
});

it('Should Return Status 404 with bad path', function(done) {

    chai.request('http://127.0.0.1:9090')
        .get('/api/invalid')
        .end(function(err, res){
            res.should.have.status(404);
            done();
        });
});