define([
	'ring',
	'backbone',
	'underscore',
	'../cache/AbstractCache',
	'jquery'
], function(ring, Backbone, _, AbstractCache, $) {
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

			if(ring.instance(options.cache, AbstractCache) === false) {
				throw new Error('Cache not provided');
			}

			options.cache.set(options.url, options.data, {
				expiry: options.expiry
			});
		},

		_cachedSync: function(method, model, options) {
			var syncFn = Backbone.Model.prototype.sync,
				store, 
				cache;

			try {
				store = this.collection.store;
				cache = store.requestCache;
			} catch(err) {}

			if(cache != null) {
				if(cache.exists(options.url)) {
					rtn = cache.get(options.url);
					var def = new $.Deferred();

					

					return def.promise();
				} else {
					rtn = syncFn.call(this, method, model, options);
					
					if(options.setCache === true) {
						this._cacheRequest({
							data: rtn,
							cache: cache,
							url: options.url
						});
					}
				}
			} else {
				rtn = syncFn.call(this, method, model, options);
			}

			return rtn;
		},

		_uncachedSync: function(method, model, options) {
			return Backbone.Model.sync.call(this, method, model, options);
		},

		sync: function(method, model, options) {
			var store,
				cache,
				rtn;

			options = _.defaults({
				url: _.result(this, 'url')
			}, options);

			if(method === 'read') {
				options = _.defaults(options, {
					setCache: true,
					useCache: true
				});

				if(options.useCache === true) {
					return this._cachedSync(method, model, options);
				} else {
					return this._uncachedSync(method, model, options);
				}
			} else {
				return this._uncachedSync(method, model, options);
			}
		}
	});
});