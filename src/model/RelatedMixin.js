define([
	'ring',
	'underscore',
	'../lang'
], function(ring, Backbone, _, lang) {
	return ring.create({

		fetchTree: function(options) {
			var store;

			try {
				store = this.collection.store;
			} catch(err) {
				throw new Error('Model does not belong to a collection or store');
			}

			options = options || {};

			var def = new $.Deferred();

			this.fetch(options).then(function() {
				_.forOwn(options.contains, function() {

				}, this);
			});

			return def.promise();
		}
	});
});