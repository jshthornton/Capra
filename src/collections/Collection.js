define([
	'ring',
	'backbone',
	'underscore',
	'../syncs/ajax',
	'../syncs/cache'
], function(ring, Backbone, _, ajaxSync, cacheSync) {
	'use strict';
	return ring.create([Backbone.Collection], {
		_prepareModel: function(attrs, options) {
	      if (ring.instance(attrs, Backbone.Model)) {
	      	return attrs;
	      }

	      options = options ? _.clone(options) : {};
	      options.collection = this;

	      var model = new this.model(attrs, options);

	      if (!model.validationError) {
	      	return model;
	      }
	      this.trigger('invalid', this, model.validationError, options);
	      return false;
	    },

	    expiry: 60,

		_cacheRequest: function(options) {
			options = _.defaults({
				expiry: this.expiry
			}, options);

			if(_.has(options, 'data') === false) {
				throw new Error('No data to cache');
			}

			try {
				this.store.requestCache.set(options.url, options.data, {
					expiry: options.expiry
				});
				return true;
			} catch(err) {
				return false;
			}
		},

	    sync: function(method, model, options) {
			options = _.defaults(options, {
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