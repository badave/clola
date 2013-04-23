var events = require('events');

var Evt = function Evt() {
	if(Evt.caller != Evt.getInstance) {
		throw new Error("Do not instantiate this singleton class");
	}
	events.EventEmitter.call(this);
};

Evt.super_ = events.EventEmitter;
Evt.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Evt,
        enumerable: false
    }
});

Evt.instance = null;
Evt.getInstance = function() {
	if(this.instance === null) {
		this.instance = new Evt();
	}
	return this.instance;
}

module.exports = Evt.getInstance();