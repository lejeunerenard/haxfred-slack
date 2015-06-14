class Slack_Mock {
  constructor(token, autoReconnect, autoMark) {
    this.token = token;

    this.login = sandbox.spy();
    this.on = sandbox.spy();

    this.self = {
      id: 'haxfreds-id',
      name: 'Haxfred'
    };
    this.team = {
      name: 'Haxiom'
    };
    this.channels = { };
    this.groups = { };
  }
}

module.exports = Slack_Mock;
