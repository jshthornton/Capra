define([
	'ring',
	'backbone',
	'underscore'
], function(ring, Backbone, _) {
	return ring.create([Backbone.Collection], {
		initialize: function() {
			_.bindAll(this);
		},

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
	    }
	});
});