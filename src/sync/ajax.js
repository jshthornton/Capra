define([
	'ring',
	'../NormalizeSyncMixin',
	'backbone'
], function(ring, NormalizeSyncMixin, Backbone) {
	var Cls = ring.create([NormalizeSyncMixin], {
		sync: function(method, model, options) {
			var xhr = Backbone.sync(method, model, options);
			return this._wrapJQXHR(xhr, model, options);
		}
	});

	return new Cls();
});