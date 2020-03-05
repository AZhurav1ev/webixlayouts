webix.protoUI({
  name: "customButton",
  defaults: {
    width: 100
  },
  $cssName: "customButton",
  $init(config) {
    config.value = config.states[config.state];
    webix.html.addCss(this.$view, "state_" + config.state);

    this.attachEvent("onItemClick", function () {
      const currentState = this.config.state;
      const nextState = this.config.states[this.config.state + 1] ? this.config.state + 1 : 0;
      webix.html.removeCss(this.$view, "state_" + currentState);
      this.config.value = this.config.states[nextState];
      this.config.state = nextState;
      this.refresh();
      webix.html.addCss(this.$view, "state_" + nextState);
      this.callEvent("onStateChange", [nextState, currentState]);
    });
  }
}, webix.ui.button);


