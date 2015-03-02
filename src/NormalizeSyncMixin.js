define([
	'underscore',
	'jquery',
	'ring'
], function(_, $, ring) {
	return ring.create({
		_wrapJQXHR: function(xhr, model, options) {
			var def = new $.Deferred();

			xhr.then(function(response) {
				def.resolve(model, response, options);
			}, function(response) {
				def.reject(model, response, options);
			});

			return def.promise();
		}
	});
});