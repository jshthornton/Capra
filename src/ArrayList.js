define([
	'underscore',
	'backbone',
	'ring'
], function(_, Backbone, ring) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// items: []
		length: 0,

		constructor: function() {
			_.bindAll(this);

			this.items = [];

			this.on('add', this.onAdd);
			this.on('remove', this.onRemove);
			this.on('clear', this.onClear);
		},

		_add: function(item, index) {
			if(_.isNumber(index)) {
				this.items.splice(index, 0, item);
			} else {
				this.items.push(item);
			}

			this.trigger('add', this, item, this.items);
		},

		add: function(data, options) {
			options = _.assign({
				multiple: false
			}, options);

			if(options.multiple === true) {
				// Not using concat here due to event firing timing.
				var at = options.at;
				_.each(data, function(item) {
					this._add(item, at);

					// This is to stop the next item from being added before the previous.
					if(_.isNumber(at)) {
						at++;
					}
				}, this);
			} else {
				this._add(data, options.at);
			}
		},

		remove: function(index) {
			var removed = this.items.splice(index, 1);
			this.trigger('remove', this, removed, this.items);
		},

		at: function(index) {
			return this.items[index];
		},

		clear: function() {
			this.items.length = 0;
			this.trigger('clear', this);
		},

		_updateLength: function() {
			this.length = this.items.length;
		},

		// Internal Events
		onAdd: function() {
			this._updateLength();
		},

		onRemove: function() {
			this._updateLength();
		},

		onClear: function() {
			this._updateLength();
		}
	}));
});