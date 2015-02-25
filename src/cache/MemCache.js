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
					_.forOwn(this._hash, function(item, key) {
						try {
							var container = this._getContainer(key);
							if(this._hasExpired(container) === false) {
								count++;
							}
						} catch(err) {}
					}, this);

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
			this._hash[key] = value;
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

			this._set(key, data);
		},

		_flush: function(cb) {
			var arr = [],  // Array to hold the keys
				i;

			_.forOwn(this._hash, function(item, key) {
				if(_.isFunction(cb)) {
					result = cb.call(this, key);
				} else {
					result = cb;
				}

				if(result === true) {
					arr.push(key);
				}
			}, this);

			// Iterate over arr and remove the items by key
			for(i = 0; i < arr.length; i++) {
				this.del(arr[i]);
			}
		},

		del: function(key) {
			delete this._hash[key];
		},

		exists: function(key) {
			// Do fast check first
			var item = this._get(key);
			if(item === undefined) {
				return false;
			}

			// Then if it does exist, check it isn't expired
			var container = item;
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