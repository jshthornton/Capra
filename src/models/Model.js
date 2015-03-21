define([
	'ring',
	'backbone',
	'underscore',
	'jquery',
	'../syncs/ajax',
	'../syncs/cache'
], function(ring, Backbone, _, $, ajaxSync, cacheSync) {
	'use strict';
	return ring.create([Backbone.Model], {
		expiry: 60,

		initialize: function() {
			_.bindAll(this);
		},

		_cacheRequest: function(options) {
			options = _.defaults({
				expiry: this.expiry
			}, options);

			if(_.has(options, 'data') === false) {
				throw new Error('No data to cache');
			}

			try {
				this.collection.store.requestCache.set(options.url, options.data, {
					expiry: options.expiry
				});
				return true;
			} catch(err) {
				return false;
			}
		},

		defaultParams: function() {
			return {};
		},

		defaultHeaders: function() {
			return {};
		},

		save: function(key, val, options) {
			var attrs;

			// Handle both `"key", value` and `{key: value}` -style arguments.
			if (key == null || typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}

			var rtn = this.$super(attrs, options);

			if(rtn === false && _.isFunction(options.invalid)) {
				options.invalid(this, this.validationError, options);
			}

			return rtn;
		},

		sync: function(method, model, options) {
			options = _.defaults(options, {
				wasNew: this.isNew(),
				headers: _.defaults(_.result(this, 'defaultHeaders'), options.headers)
			});

			options.url = options.url || _.result(this, 'url');

			if(method === 'read') {
				options = _.defaults(options, {
					params: _.defaults(_.result(this, 'defaultParams'), options.params),
					setCache: true,
					useCache: true
				});

				if(_.size(options.params) > 0) {
					options.url = options.url + '?' + $.param(options.params);
				}

				if(options.useCache === true) {
					var cache;
					try {
						cache = model.collection.store.requestCache;
						return cacheSync.sync(cache, method, model, options);
					} catch(err) {}
				}
			}

			var rtn = ajaxSync.sync(method, model, options);

			if(method === 'read') {
				if(options.setCache === true) {
					this._cacheRequest({
						data: rtn,
						url: options.url
					});
				}
			}

			return rtn;
		}
	});
});