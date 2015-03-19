define([
	'underscore',
	'ring'
], function(_, ring) {
	'use strict';
	return ring.create({
		_setupTicker: function() {
			this.ecTicker = setInterval(this.flushExpired, this.ecRate);
		},

		_getMeta: function(container) {
			return container[0];
		},

		_getValue: function(container) {
			return container[1];
		},

		get: function(key) {
			var container = this._getContainer(key);

			if(this._hasExpired(container)) {
				throw new Error('Item has expired');
			}

			return this._getValue(container);
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

		_ttl: function(container) {
			if(this._hasExpiry(container) === false) {
				return false;
			}

			if(this._hasExpired(container)) {
				return 0;
			}

			var now = new Date(),
				expiry = new Date(this._getMeta(container).expiry);

			return Math.ceil((expiry - now) / 1000);
		},

		ttl: function(key) {
			var container = this._getContainer(key);

			return this._ttl(container);
		},

		rename: function(oldKey, newKey) {
			var tmp = this._get(oldKey);
			this.del(oldKey);
			this._set(newKey, tmp);
		},

		flush: function() {
			this._flush(true);
		},

		flushExpired: function() {
			this._flush(function(key) {
				try {
					var container = this._getContainer(key);
					return this._hasExpired(container);
				} catch(err) {}
			});
		},

		exists: function(key) {
			// Do fast check first
			var item = this._get(key);
			if(item === null) {
				return false;
			}

			// Then if it does exist, check it isn't expired
			var container = this._parse(item);

			var ttl = this._ttl(container);
			if(ttl === 0) {
				return false;
			} else {
				return true;
			}
		}
	});
});