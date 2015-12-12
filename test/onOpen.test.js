import onOpen from '../lib/onOpen'
import Slack_Mock from './helpers/slack-mock'

describe('onOpen', () => {
  let haxfred = { }

  beforeEach(() => {
    haxfred.emit = sandbox.spy()
    sandbox.stub(console, 'info')
    haxfred.slack = new Slack_Mock('token', true, true)
  })

  context('when slack opens', () => {
    it('greets you with your name and the name of your team', () => {
      onOpen(haxfred)

      expect(console.info).to.be.calledWith('Welcome to Slack. You are Haxfred of Haxiom')
    })
  })

  context('when you are not part of any channels or groups', () => {
    it('notifies you that you are not in any channels', () => {
      onOpen(haxfred)

      expect(console.info).to.be.calledWith('You are not in any channels.')
    })

    it('emits empty arrays for channels and groups', () => {
      onOpen(haxfred)

      var empty_emit = {
        channels: [],
        groups: []
      }
      expect(haxfred.emit).to.be.calledWith('slack.open', empty_emit)
    })
  })

  context('when you are part of a channel', () => {
    let mock_channels = {
      is_a_meber: { name: 'is a member', is_member: true },
      is_not_a_member: { name: 'is not a member', is_member: false }
    }

    it('notifies you what channels you are in', () => {
      haxfred.slack.channels = mock_channels
      onOpen(haxfred)

      expect(console.info).to.be.calledWith('You are in: is a member')
    })

    it('emits array of channels that you are in', () => {
      haxfred.slack.channels = mock_channels
      onOpen(haxfred)

      let emit = {
        channels: ['is a member'],
        groups: []
      }
      expect(haxfred.emit).to.be.calledWith('slack.open', emit)
    })
  })
  context('when you are part of a group', () => {
    let mock_groups = {
      is_open_and_not_archived: { name: 'is open and not archived', is_open: true, is_archived: false },
      is_open_and_archived: { name: 'is open and archived', is_open: true, is_archived: true },
      is_not_open_and_archived: { name: 'is not open and archived', is_open: false, is_archived: true },
      is_not_open_and_not_archived: { name: 'is not open and not archived', is_open: false, is_archived: false }
    }

    it('notifies you what groups you are in', () => {
      haxfred.slack.groups = mock_groups
      onOpen(haxfred)

      expect(console.info).to.be.calledWith('As well as: is open and not archived')
    })

    it('emits array of groups that you are in', () => {
      haxfred.slack.groups = mock_groups
      onOpen(haxfred)

      let emit = {
        channels: [],
        groups: ['is open and not archived']
      }
      expect(haxfred.emit).to.be.calledWith('slack.open', emit)
    })
  })
})
