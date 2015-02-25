define([
	'ring',
	'backbone',
	'underscore'
], function(ring, Backbone, _) {
	return ring.create([Backbone.Model], {
		initialize: function() {
			_.bindAll(this);
		}
	});
});