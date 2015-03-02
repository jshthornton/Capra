define([
	'ring',
	'backbone',
	'underscore',
	'jquery',
	'../sync/ajax',
	'../sync/cache'
], function(ring, Backbone, _, $, ajaxSync, cacheSync) {
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
				store = this.collection.store;
				cache = store.requestCache;
				
				cache.set(options.url, options.data, {
					expiry: options.expiry
				});

				return true;
			} catch(err) {
				return false;
			}
		},

		sync: function(method, model, options) {
			options = _.defaults({
				url: _.result(this, 'url')
			}, options);

			if(method === 'read') {
				options = _.defaults(options, {
					setCache: true,
					useCache: true
				});

				if(options.useCache === true) {
					try {
						return cacheSync.sync(method, model, options);
					} catch(err) {}
				}
			}

			var rtn = ajaxSync.sync(method, model, options);

			var cache,
				store;

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