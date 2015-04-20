var sinon       = require('sinon');
var sinonChai   = require('sinon-chai');
var expect      = require('chai').expect;
var assert      = require('chai').assert;
var path        = require('path');
var chai        = require('chai');

var Haxfred     = require('haxfred');

chai.use(expect);
chai.use(assert);
chai.use(sinonChai);

describe('error reporting for config', function () {

  beforeEach(function(){
    stub = sinon.stub(console, 'error');
  });
  afterEach(function() {
    stub.restore();
  });

  it('should throw console.error when slack token is not provided', function () {
    haxfred = new Haxfred({
      adapters: ['haxfred-slack'],
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();

    expect(stub).to.be.calledWith("No slack_token found in config.json. Aborting slack login.");
  });
});
