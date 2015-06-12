'use strict';

let path = require('path');

describe('error reporting for config', () => {
  let haxfred;

  beforeEach(() => {
    sandbox.stub(console, 'error');
  });

  it('should throw console.error when slack token is not provided', () => {
    haxfred = new Haxfred({
      adapters: ['haxfred-slack'],
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();

    expect(console.error).to.be.calledWith("No slack_token found in config.json. Aborting slack login.");
  });
});
