define([
	'ring',
	'backbone',
	'underscore'
], function(ring, Backbone, _) {
	return ring.create([Backbone.Model], {
		cidPrefix: 'model',

		constructor: function(attributes, options) {
			var attrs = attributes || {};
			options = options || {};

			this.cid = _.uniqueId(this.cidPrefix);
			this.attributes = {};

			//this.validator = new Rulebot();
			//this.initValidation();

			//this.initEvents();

			if (options.collection) {
				this.collection = options.collection;
			}
			if (options.parse) {
				attrs = this.parse(attrs, options) || {};
			}

			attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
			this.set(attrs, options);
			this.changed = {};

			this.initialize.apply(this, arguments);
		},

		initialize: function() {
			_.bindAll(this);
		},

	});
});