define([
	'underscore',
	'backbone',
	'ring'
], function(_, Backbone, ring) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// properties

		constructor: function() {
			_.bindAll(this);

			this._previous = {};
			this._properties = {};
		},

		set: function() {
			var props,
				options;

			if(_.isObject(arguments[0])) {
				props = arguments[0];
				options = arguments[1];
			} else {
				props = {};
				props[arguments[0]] = arguments[1];
				options = arguments[2];
			}

			this._fireChange = false;

			_.forOwn(props, function(value, key) {
				var fnString = '_' + key + 'Setter';

				if(_.isFunction(this[fnString])) {
					this[fnString](key, value, options);
				} else {
					this._set(key, value, options);
				}
			}, this);

			if(this._fireChange === true) {
				this.trigger('change', this, options);
			}
		},

		get: function(key, options) {
			var fnString = '_' + key + 'Getter';

			if(_.isFunction(this[fnString])) {
				return this[fnString](key, options);
			} else {
				return this._get(key);
			}
		},

		previous: function(key) {
			return this._previous[key];
		},

		_set: function(key, value, options) {
			// Replace previous
			this._previous[key] = this._properties[key];

			// Update property
			this._properties[key] = value;

			this.trigger('change:' + key, this, value, options);
			this._fireChange = true;
		},

		_get: function(key) {
			return this._properties[key];
		}
	}));
});