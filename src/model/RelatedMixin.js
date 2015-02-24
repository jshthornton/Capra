define([
	'ring',
	'underscore',
	'../lang'
], function(ring, Backbone, _, lang) {
	return ring.create({

		fetchTree: function(options) {
			var store = this.collection.store;

			var def = new $.Deferred();

			this.fetch(options).then(function() {
				_.forOwn(options.contains, function() {

				}, this);
			});

			return def.promise();
		}
	});
});