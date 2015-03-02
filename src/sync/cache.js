define([
	'underscore',
	'jquery'
], function(_, $) {
	return {
		sync: function(method, model, options) {
			var store, 
				cache;

			try {
				store = model.collection.store;
				cache = store.requestCache;
			} catch(err) {
				throw new Error('Could not find request cache for model');
			}

			if(cache.exists(options.url) === false) {
				throw new Error('Request not in cache');
			}
			
			var request = cache.get(options.url),
				def = new $.Deferred();

			request.then(function(model, response) {
				def.resolve(model, response, options);

				if(_.isFunction(options.success)) {
					options.success(model, response, options);
				}
			}, function(model, response) {
				def.reject(model, response, options);

				if(_.isFunction(options.error)) {
					options.error(model, response, options);
				}
			});

			return def.promise();
		}
	};
});