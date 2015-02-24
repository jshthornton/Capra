define([
	'underscore'
], function(_) {
	'use strict';
	var cache = {
		_prefix: 'cache_',

		_parse: function(data) {
			return JSON.parse(data);
		},

		_getContainer: function(key) {
			return this._parse(this._get(key));
		},

		_getMeta: function(container) {
			return container[0];
		},

		_getValue: function(container) {
			return container[1];
		},

		_resolver: function(entity) {
			var container;

			if(_.isString(entity)) {
				container = this._getContainer(entity);
			} else if(_.isObject(entity)) {
				container = entity[0];
			} else {
				throw new Error('Unable to resolve unknown entity type');
			}

			return container;
		},

		_get: function(key) {
			return localStorage.getItem(this._prefix + key);
		},

		_set: function(key, value) {
			localStorage.setItem(this._prefix + key, value);
		},

		get: function(key) {
			var container = this._getContainer(key);

			if(container == null) {
				throw new Error('Unable to find item ' + key + ' in cache');
			}

			if(this._hasExpired(container)) {
				throw new Error('Item has expired');
			}

			return this._getValue(container);
		},

		set: function(key, value, meta) {
			if(_.isUndefined(value)) {
				throw new Error('Value must not be undefined');
			}

			meta = _.merge({
				expiry: false
			}, meta);

			if(_.isNumber(meta.expiry)) {
				var t = new Date();
				t.setSeconds(t.getSeconds() + meta.expiry);
				meta.expiry = t;
			}

			var data = [
				meta,
				value
			];

			var formatted = JSON.stringify(data);

			this._set(key, formatted);
		},

		_hasExpired: function(container) {
			if(this._hasExpiry(container) === false) {
				return false;
			}

			var now = new Date(),
				expiry = new Date(this._getMeta(container).expiry);

			return now >= expiry;
		},

		_hasExpiry: function(container) {
			var expiry = this._getMeta(container).expiry;
			if(expiry === false) {
				// Fast checking
				return false;
			} else if(_.isNaN(Date.parse(expiry))) {
				// Strong checking
				throw new Error('Malformed expiry. Expected parsable date, actually ' + expiry);
			}

			return true;
		},

		expire: function(/*key,*/ /*seconds*/) {

		},

		expireat: function(/*key,*/ /*timestamp*/) {

		},

		ttl: function(key) {
			var container = this._resolver(key);

			if(container === null) {
				return false;
			}

			if(this._hasExpiry(container) === false) {
				return true;
			}

			if(this._hasExpired(container)) {
				return 0;
			}

			var now = new Date(),
				expiry = new Date(this._getMeta(container).expiry);

			return Math.ceil((expiry - now) / 1000);
		},

		rename: function(oldKey, newKey) {
			var tmp = this._get(oldKey);
			this.del(oldKey);
			this._set(newKey, tmp);
		},

		flush: function() {
			var arr = [],  // Array to hold the keys
				i;
			// Iterate over localStorage and insert the keys that meet the condition into arr
			for(i = 0; i < localStorage.length; i++){
				if(_.startsWith(localStorage.key(i), this._prefix)) {
					arr.push(localStorage.key(i));
				}
			}

			// Iterate over arr and remove the items by key
			for(i = 0; i < arr.length; i++) {
				localStorage.removeItem(arr[i]);
			}
		},

		del: function(key) {
			localStorage.removeItem(this._prefix + key);
		},

		exists: function(key) {
			// Do fast check first
			var item = this._get(key);
			if(item === null) {
				return false;
			}

			// Then if it does exist, check it isn't expired
			var container = this._parse(item);
			if(container == null) {
				return false;
			}

			var ttl = this.ttl(key);
			if(ttl === 0) {
				//this.del(key);
				return false;
			} if(ttl === false) {
				return false;
			} else {
				return true;
			}
		},

		_tick: function() {
			
		},

		initialize: function() {
			_.bindAll(this);

			//setInterval(this._tick, 30000);
		}
	};


	Object.defineProperty(cache, 'length', {
		get: function() {
			var count = 0;
			for(var i = 0; i < localStorage.length; i++){
				if(_.startsWith(localStorage.key(i), this._prefix)) {
					count++;
				}
			}

			return count;
		},
		configurable: false,
		enumerable: false
	});

	return cache;
});