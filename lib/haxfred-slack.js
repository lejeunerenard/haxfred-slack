var Slack = require('slack-client');

var on_open = require('./on_open');
var on_message = require('./on_message');
var on_error = require('./on_error');

var Haxfred;

var haxfred_slack = function(haxfred) {
  Haxfred = haxfred;

  var token = Haxfred.config.slack_token;

  if(!token) {
    console.error('No slack_token found in config.json. Aborting slack login.');
    return false;
  }

  haxfred.slack = new Slack(token, true, true);

  haxfred.slack.login();

  haxfred.slack.on('open', function () {
    on_open(haxfred);
  });

  haxfred.slack.on('message', function(message) {
    on_message(haxfred, message);
  });

  haxfred.slack.on('error', function(error){
    on_error(error);
  });
};

module.exports = haxfred_slack;
