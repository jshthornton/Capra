define([
	'ring',
	'./AbstractCache',
	'underscore'
], function(ring, AbstractCache, _) {
	return ring.create([AbstractCache], {
		ecTicker: null,
		_ecRate: 3000,

		constructor: function() {
			_.bindAll(this);

			this._hash = {};

			Object.defineProperty(this, 'length', {
				get: function() {
					var count = 0;
					for(var i = 0; i < localStorage.length; i++){
						if(_.startsWith(localStorage.key(i), this._prefix)) {
							var rawKey = localStorage.key(i),
								fauxKey = rawKey.slice(this._prefix.length);

							try {
								var container = this._getContainer(fauxKey);
								if(this._hasExpired(container) === false) {
									count++;
								}
							} catch(err) {}
						}
					}

					return count;
				}
			});

			Object.defineProperty(this, 'ecRate', {
				get: function() {
					return this._ecRate;
				},
				set: function(value) {
					clearInterval(this.ecTicker);
					this._ecRate = value;
					this._setupTicker();
				}
			});

			this._setupTicker();
		},

		_getContainer: function(key) {
			if(_.has(this._hash, key) === false) {
				throw new Error('Unable to find item ' + key + ' in cache');
			}

			return this._get(key);
		},

		_get: function(key) {
			return this._hash[key];
		},

		_set: function(key, value) {
			localStorage.setItem(this._prefix + key, value);
		},

		get: function(key) {
			var container = this._getContainer(key);

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

			try {
				// This might throw due to quota exceeding.
				this._set(key, formatted);
			} catch(err) {
				// So let's try and clear the expired and try again
				this.flushExpired();
				// This one can happily throw, as then it is a genuine problem
				this._set(key, formatted);
			}
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

		_flush: function(cb) {
			var arr = [],  // Array to hold the keys
				i;
			// Iterate over localStorage and insert the keys that meet the condition into arr
			for(i = 0; i < localStorage.length; i++){
				if(_.startsWith(localStorage.key(i), this._prefix)) {
					var rawKey = localStorage.key(i),
						fauxKey = rawKey.slice(this._prefix.length),
						result;

					if(_.isFunction(cb)) {
						result = cb.call(this, fauxKey);
					} else {
						result = cb;
					}

					if(result === true) {
						arr.push(fauxKey);
					}
				}
			}

			// Iterate over arr and remove the items by key
			for(i = 0; i < arr.length; i++) {
				this.del(arr[i]);
			}
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

			var ttl = this._ttl(container);
			if(ttl === 0) {
				return false;
			} else {
				return true;
			}
		}
	});
});