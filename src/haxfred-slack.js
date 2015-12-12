let Slack = require('slack-client')

import onOpen from './onOpen'
import onMessage from './onMessage'
import onError from './onError'

function haxfred_slack (haxfred) {
  const TOKEN = haxfred.config.slack_token

  if (!TOKEN) {
    console.error('No slack_token found in config.json. Aborting slack login.')
    return false
  }

  haxfred.slack = new Slack(TOKEN, true, true)

  haxfred.slack.login()

  haxfred.slack.on('open', () => {
    onOpen(haxfred)
  })

  haxfred.slack.on('message', (message) => {
    onMessage(haxfred, message)
  })

  haxfred.slack.on('error', onError)
}

module.exports = haxfred_slack
