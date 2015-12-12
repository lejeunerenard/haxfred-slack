import rewire from 'rewire'
let haxfred_slack = rewire('../src/haxfred-slack')
import slack_mock from './helpers/slack-mock'
haxfred_slack.__set__('Slack', slack_mock)

describe('Haxfred-Slack initialization', () => {
  beforeEach(() => {
    sandbox.stub(console, 'error')
  })

  context('when slack_token is not provided', () => {
    let haxfred = { config: {} }

    it('calls console.error', () => {
      haxfred_slack(haxfred)

      expect(console.error).to.be.calledWith('No slack_token found in config.json. Aborting slack login.')
    })

    it('does not create haxfred.slack', () => {
      haxfred_slack(haxfred)

      expect(haxfred.slack).to.not.exist
    })
  })

  context('when slack_token is provided', () => {
    let haxfred = { config: { slack_token: 'some-token' } }

    it('calls slack.login', () => {
      haxfred_slack(haxfred)

      expect(haxfred.slack.login).to.be.calledOnce
    })

    it('calls slack.on for each listener', () => {
      haxfred_slack(haxfred)

      expect(haxfred.slack.on.callCount).to.eql(3)
      expect(haxfred.slack.on).to.be.calledWith('open')
      expect(haxfred.slack.on).to.be.calledWith('message')
      expect(haxfred.slack.on).to.be.calledWith('error')
    })
  })
})
