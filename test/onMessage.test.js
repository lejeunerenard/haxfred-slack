let onMessage = require('../lib/onMessage')
let Slack_Mock = require('./helpers/slack-mock')

describe('onMessage', () => {
  let haxfred = { }

  beforeEach(() => {
    haxfred.emit = sandbox.spy()
    haxfred.slack = new Slack_Mock('token', true, true)
  })

  context('when message is not of type "message"', () => {
    let bad_msg = { type: 'not message' }

    it('does not call haxfred.emit', () => {
      onMessage(haxfred, bad_msg)

      expect(haxfred.emit).to.not.be.called
    })
  })

  context('when message is of type "message"', () => {
    let msg = {
      type: 'message'
    }

    it('emits slack.message event for msg that does not contain user name', () => {
      msg.text = 'hello friend'
      onMessage(haxfred, msg)

      expect(haxfred.emit).to.be.calledOnce
      expect(haxfred.emit).to.be.calledWith('slack.message', msg)
    })

    it('emits slack.message event for msg that contains username but is not a direct mention', () => {
      msg.text = 'hello haxfred Haxfred'
      onMessage(haxfred, msg)

      expect(haxfred.emit).to.be.calledOnce
      expect(haxfred.emit).to.be.calledWith('slack.message', msg)
    })

    it('emits slack.directMsg event for msg that contains username and is a direct mention', () => {
      msg.text = '<@haxfreds-id> hello'
      onMessage(haxfred, msg)

      expect(haxfred.emit).to.be.calledOnce
      expect(haxfred.emit).to.be.calledWith('slack.directMsg', msg)
    })
  })
})
