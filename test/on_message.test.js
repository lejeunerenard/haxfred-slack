'use strict';

let on_message = require('../lib/on_message');
let slack_mock = require('./helpers/slack-mock');

describe('on_message', () => {
  let haxfred = { };

  beforeEach(() => {
    haxfred.emit = sandbox.spy();
    haxfred.slack = new slack_mock('token', true, true);
  });

  context('when message is not of type "message"', () => {
    let bad_msg = { type: 'not message' };

    it('does not call haxfred.emit', () => {
      on_message(haxfred, bad_msg);

      expect(haxfred.emit).to.not.be.called;
    });
  });

  context('when message is of type "message"', () => {
    let msg = {
      type: 'message'
    };

    it('emits slack.message event for msg that does not contain user name', () => {
      msg.text = 'hello friend';
      on_message(haxfred, msg);

      expect(haxfred.emit).to.be.calledOnce;
      expect(haxfred.emit).to.be.calledWith('slack.message', msg);
    });

    it('emits slack.message event for msg that contains username but is not a direct mention', () => {
      msg.text = 'hello haxfred Haxfred';
      on_message(haxfred, msg);

      expect(haxfred.emit).to.be.calledOnce;
      expect(haxfred.emit).to.be.calledWith('slack.message', msg);
    });

    it('emits slack.directMsg event for msg that contains username and is a direct mention', () => {
      msg.text = '<@haxfreds-id> hello';
      on_message(haxfred, msg);

      expect(haxfred.emit).to.be.calledOnce;
      expect(haxfred.emit).to.be.calledWith('slack.directMsg', msg);
    });
  });
});
