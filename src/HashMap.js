define([
	'underscore',
	'backbone',
	'ring'
], function(_, Backbone, ring) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// properties
		// previousProperties
		// changedProperties
		_hasChanged: false,
		_isChanging: false,

		constructor: function(properties) {
			_.bindAll(this);

			this.previousProperties = {};
			this.properties = {};
			this.changedProperties = {};

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

			this._hasChanged = false;
			this._isChanging = true;

			_.forOwn(props, function(value, key) {
				var fnString = '_' + key + 'Setter';

				if(_.isFunction(this[fnString])) {
					this[fnString](key, value, options);
				} else {
					this._set(key, value, options);
				}
			}, this);

			if(this._hasChanged === true) {
				this.trigger('change', this, options);
			}

			this._isChanging = false;
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

			this._hasChanged = false;
			this._isChanging = true;

			this._set(key, undefined, options);

			if(this._hasChanged === true) {
				this.trigger('change', this, options);
			}

			this._isChanging = false;
		},

		clear: function(options) {
			options = _.extend(options || {}, {
				unset: true
			});

			this._hasChanged = false;
			this._isChanging = true;

			_.forOwn(this.properties, function(value, key) {
				this._set(key, undefined, options);
			}, this);

			if(this._hasChanged === true) {
				this.trigger('change', this, options);
			}

			this._isChanging = false;
		},

		has: function(key) {
			// underscore proxy
			return _.has(this.properties, key);
		},

		changed: function() {
			return this.changedProperties;
		},

		hasChanged: function(key) {
			if(arguments.length === 0) {
				// Just checking to see if the data has changed at all
				return this._hasChanged;
			}

			return _.has(this.changedProperties, key);
		},

		_set: function(key, value, options) {
			options = _.extend(options || {}, {
			});

			var currentValue = this._get(key);
			if(currentValue === value) {
				return;
			}

			// Replace previous
			this.previousProperties[key] = this.properties[key];

			// Update property
			if(options.unset === true) {
				delete this.properties[key];
			} else {
				this.properties[key] = value;
				this.changedProperties[key] = value;
			}

			this._hasChanged = true;
			this.trigger('change:' + key, this, value, options);
		},

		_get: function(key) {
			return this.properties[key];
		}
	}));
});