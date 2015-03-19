define([
	'underscore',
	'jquery'
], function(_, $) {
	'use strict';
	return {
		sync: function(cache, method, model, options) {
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