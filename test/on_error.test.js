'use strict';

let on_error = require('../lib/on_error');

describe('on_error', () => {
  it('calls console.error with the error', () => {
    sandbox.stub(console, 'error');

    on_error('error message');

    expect(console.error).to.be.calledWith('error message');
  });
});
