var Haxfred,
    Slack = require('slack-client');

var token = 'xoxb-4002873512-aE7dlZDHlMwbSv7w7RibuDc5'; // Add a bot at https://my.slack.com/services/new/bot and copy the token here.
var autoReconnect = true;
var autoMark = true;

var haxfred_slack = function( haxfred ) {
  Haxfred = haxfred;
  haxfred.slack = {};

  Haxfred.slack.users = {};
  /*
   * isToHaxfred
   * This function returns a boolean for whether Haxfred is being directly addressed in the message.
   */
  function isToHaxfred(message) {
    var user = Haxfred.slack.client.getUserByID(message.user),
        channel = Haxfred.slack.client.getChannelGroupOrDMByID(message.channel);
    var personalRegex = new RegExp('^(?:<@' + Haxfred.slack.client.self.id + '>'
        + '|' + Haxfred.slack.client.self.name + ')(:.*)');

    return user.name === channel.name || personalRegex.test(message.text);
  }

  Haxfred.slack.say = function(message, channel) {
    channel.send(message);
  };

  /* ----- Nick Methods -----*/
  Haxfred.slack.defaultNickMethod = function(chatNicks, haxfredNicks) {
    haxfredNicks = haxfredNicks || Haxfred.config.nicks;

    for (var i = 0; i < haxfredNicks.length; i++) {
      var found = false;
      // Check to see if this Nick is already used
      for (var key in chatNicks) {
        if (haxfredNicks[i] == key) { found = true; }
      }
      // If not found, change Nick to that name
      if (!found) {
        return haxfredNicks[i];
      }
    }

    return '';
  };

  Haxfred.slack.randomNickMethod = function(chatNicks) {
    var randomNicks = Haxfred.config.nicks;
    randomNicks.sort(function() {
      return 0.5 - Math.random();
    });
    return Haxfred.slack.defaultNickMethod(chatNicks, randomNicks);
  };

  // Determine the nick
  //Haxfred.slack._currentNick = Haxfred.slack[ (Haxfred.config.nickMethod || 'default') + "NickMethod" ](Haxfred.slack._currentNick);
  Haxfred.slack.client = new Slack(token, autoReconnect, autoMark);

  /* ----- Listeners ----- */
  //Haxfred.slack.client.on('open', function (channel, nick) {
  //  // Add nick to array of users
  //  if(Haxfred.slack.users[channel]) {
  //    Haxfred.slack.users[channel].push(nick);
  //  }

  //  haxfred.emit('slack.join',{
  //    channel: channel,
  //    from: nick,
  //    content: ''
  //  });
  //});

  //Haxfred.slack.client.addListener('part', function (channel, nick) {
  //  // Remove nick to array of users
  //  var removeNick = Haxfred.slack.users[channel].indexOf(nick);
  //  if(removeNick > -1) {
  //    Haxfred.slack.users[channel].splice(removeNick, 1);
  //  }

  //  haxfred.emit('slack.part',{
  //    channel: channel,
  //    from: nick,
  //    content: ''
  //  });
  //});

  //Haxfred.slack.client.addListener('nick', function (oldnick, newnick, channels, msgObj) {

  //  for(var channel in channels) {
  //    var ch = channels[channel];
  //    var removeNick = Haxfred.slack.users[ch].indexOf(oldnick);
  //    if (removeNick > -1) {
  //      Haxfred.slack.users[ch].splice(removeNick, 1);
  //    }
  //    Haxfred.slack.users[ch].push(newnick);
  //  }

  //  haxfred.emit('slack.nick',{
  //    channels: channels,
  //    oldnick: oldnick,
  //    newnick: newnick,
  //    message: msgObj,
  //    content: ''
  //  });
  //});

  //Haxfred.slack.client.addListener('names', function(channel, nicks) {
  //  // Update the room with an array of users
  //  Haxfred.slack.users[channel] = [];
  //  for (var n in nicks) {
  //    Haxfred.slack.users[channel].push(n);
  //  }

  //  if (Haxfred.slack._currentNick != Haxfred.slack.client.nick) {
  //    var newNick = Haxfred.slack[ ( Haxfred.config.nickMethod || 'default' ) + "NickMethod" ](nicks);
  //    if (newNick) {
  //      Haxfred.slack._currentNick = newNick;
  //      Haxfred.slack.client.send('NICK', Haxfred.slack._currentNick);
  //      console.log("Tried to switch Nick to ",newNick);
  //      // @TODO: Need to write something that catches if nick fails to change (IE, because the nick was already in use in another room, or reserved)
  //    } else {
  //      console.log('Nick not reassigned');
  //    }
  //  }
  //});
  //
  Haxfred.slack.client.on('hello', function ( message ) {
    console.log('hello?');
  });

  Haxfred.slack.client.on('message', function (message){
    var type = message.type,
        ts = message.ts,
        text = message.text,
        channel = Haxfred.slack.client.getChannelGroupOrDMByID(message.channel);
    if (isToHaxfred(message)) {
      haxfred.emit('slack.directMsg', {
        from: Haxfred.slack.client.getUserByID(message.user).name,
        content: message.text,
        response: '',
        message: message,
        onComplete: function() {
          if ( this.response ) {
            Haxfred.slack.say(this.response, channel);
          }
        }
      });
    } else {
      haxfred.emit('slack.msg', {
        from: Haxfred.slack.client.getUserByID(message.user).name,
        content: message.text,
        response: '',
        message: message,
        onComplete: function() {
          if ( this.response ) {
            Haxfred.slack.say(this.response, channel);
          }
        }
      });
    }
  });

  Haxfred.slack.client.on('error', function(error) {
    console.log('msg: ' + error.msg);
    console.log('code: ' + error.code);
    return console.error("Error: " + error);
  });

  //Haxfred.slack.client.addListener('pm', function( nick, message, msgObj){
  //  haxfred.emit('slack.privateMsg', {
  //    from: nick,
  //    content: message,
  //    response: '',
  //    message: msgObj,
  //    onComplete: function() {
  //      Haxfred.slack.say(this.response);
  //    }
  //  });
  //});

  Haxfred.slack.client.login();
  console.log('slack was loaded');
};

module.exports = haxfred_slack;
