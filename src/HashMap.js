define([
	'underscore',
	'backbone',
	'ring'
], function(_, Backbone, ring) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// properties

		constructor: function(properties) {
			_.bindAll(this);

			this.previousProperties = {};
			this.properties = {};

			if(_.isObject(properties) === true) {
				this.set(properties);
			}
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

			options = _.extend(options || {}, {
			});

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
			return this.previousProperties[key];
		},

		unset: function(key, options) {
			options = _.extend(options || {}, {
				unset: true
			});

			this._set(key, undefined, options);

			this.trigger('change', this, options);
		},

		has: function(key) {
			// underscore proxy
			return _.has(this.properties, key);
		},
		_set: function(key, value, options) {
			options = _.extend(options || {}, {
			});

			// Replace previous
			this.previousProperties[key] = this.properties[key];

			// Update property
			if(options.unset === true) {
				delete this.properties[key];
			} else {
				this.properties[key] = value;
			}

			this.trigger('change:' + key, this, value, options);
			this._fireChange = true;
		},

		_get: function(key) {
			return this.properties[key];
		}
	}));
});