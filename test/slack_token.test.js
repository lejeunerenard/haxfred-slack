'use strict';

var path    = require('path');

describe('error reporting for config', function () {
  var haxfred;

  beforeEach(function(){
    sinon.stub(console, 'error');
  });
  afterEach(function() {
    console.error.restore();
  });

  it('should throw console.error when slack token is not provided', function () {
    haxfred = new Haxfred({
      adapters: ['haxfred-slack'],
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();

    expect(console.error).to.be.calledWith("No slack_token found in config.json. Aborting slack login.");
  });
});
