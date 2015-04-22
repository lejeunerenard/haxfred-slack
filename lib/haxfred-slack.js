var Slack = require('slack-client');
var Haxfred;

var haxfred_slack = function(haxfred) {
  Haxfred = haxfred;

  var token = Haxfred.config.slack_token;

  if(!token) {
    console.error("No slack_token found in config.json. Aborting slack login.");
    return false;
  }

  slack = new Slack(token, true, true);
  slack.login();

  slack.on('open', function () {
    var channels = getSlackChannels(slack.channels);

    var groups = getSlackGroups(slack.groups);

    console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

    if (channels.length > 0) {
        console.log('You are in: ' + channels.join(', '));
    }
    else {
        console.log('You are not in any channels.');
    }

    if (groups.length > 0) {
       console.log('As well as: ' + groups.join(', '));
    }

    haxfred.emit('slack.open',{
      channels: channels,
      groups: groups
    });
  });

  slack.on('message', function(message) {
    if (message.type === 'message') {
      var type = isDirect(slack.self.id, message.text) || message.subtype || message.type;
      haxfred.emit('slack.' + type, message);
    }
  });

  slack.on('error', function(error) {
    console.error(error);
  });
};

function getSlackChannels(channels) {
  return Object.keys(channels)
        .map(function (k) { return channels[k]; })
        .filter(function (c) { return c.is_member; })
        .map(function (c) { return c.name; });
}

function getSlackGroups(groups) {
  return Object.keys(groups)
        .map(function (k) { return groups[k]; })
        .filter(function (g) { return g.is_open && !g.is_archived; })
        .map(function (g) { return g.name; });
}

function isDirect(userId, messageText) {
  var userTag = "<@" + userId + ">";
  return messageText &&
    messageText.length >= userTag.length &&
    messageText.substr(0, userTag.length) === userTag ? "directMsg" : false;
}

module.exports = haxfred_slack;
