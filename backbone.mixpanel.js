// Backbone.Mixpanel v0.0.1
// (c) 2014 | Chetan Shenoy - me@chetanshenoy.com
// MIT License

// Combination of Backbone Mixpanel implementations
// inspired by Brian Norton & Swizec Teller
// https://github.com/bnorton/backbone-mixpanel
// http://swizec.com/blog/mixing-mixpanel-into-backbone/swizec/6498

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['backbone', 'underscore', 'jquery'], function (Backbone, _, $) {
      return (root.returnExportsGlobal = factory(Backbone, _, $));
    });
  } else if (typeof exports === 'object') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch(e) {}
    module.exports = factory(require('backbone'), _, $);
  } else {
    // Global Variables
    root.returnExportsGlobal = factory(root.Backbone, root._, root.$);
  }
}(this, function (Backbone, _, $) {
  Backbone.View.originalDelegateEvents = Backbone.View.prototype.delegateEvents;

  Backbone.View.prototype.delegateEvents = function(events) {
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    if (!(events || (events = _.result(this, 'events')))) return this;
  
    var track = _.bind(function (event) {
      var $target = $(event.currentTarget),
          event_name = $target.data('events'),
          data = !!this.model ? this.model.toJSON() : {};
  
      if (event_name) {
        mixpanel.track(event_name, data);
      }
    }, this);
  
    for (var key in events) {
      var match = key.match(delegateEventSplitter),
          type = match[1],
          selector = match[2];
  
      if (type == 'click' || type == 'submit') {
        if (selector === "") {
          this.$el.on(type, track);
        } else{
          this.$el.on(type, selector, track);
        }
      }
    }
  
    return Backbone.View.originalDelegateEvents.call(this, events);
  };
}));
