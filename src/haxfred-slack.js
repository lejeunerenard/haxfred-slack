var Slack = require('slack-client')

var onOpen = require('./onOpen')
var onMessage = require('./onMessage')
var onError = require('./onError')

var Haxfred

var haxfred_slack = function (haxfred) {
  Haxfred = haxfred

  var token = Haxfred.config.slack_token

  if (!token) {
    console.error('No slack_token found in config.json. Aborting slack login.')
    return false
  }

  haxfred.slack = new Slack(token, true, true)

  haxfred.slack.login()

  haxfred.slack.on('open', function () {
    onOpen(haxfred)
  })

  haxfred.slack.on('message', function (message) {
    onMessage(haxfred, message)
  })

  haxfred.slack.on('error', function (error) {
    onError(error)
  })
}

module.exports = haxfred_slack
