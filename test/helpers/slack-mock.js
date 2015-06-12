class Slack_Mock {
  constructor(token, autoReconnect, autoMark) {
    this.token = token;
    this.login = sandbox.spy();
    this.on = sandbox.spy();
  }
}

module.exports = Slack_Mock;
