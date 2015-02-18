define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';
	var Cls = function(options) {
		this.cid = _.uniqueId('batchManager');
		options = options || (options = {});
		this.initialize.apply(this, arguments);
	};

	// Static (class) properties
/*	_.extend(Cls, {
	});*/

	// Instance properties
	_.extend(Cls.prototype, Backbone.Events, {
		// results: [],
		_count: null,

		initialize: function(options) {
			_.bindAll(this);

			this._results = [];

			this.on('count:set', this._check);
			this.on('result:add', this._check);
		},

		setCount: function(n) {
			this._count = n;
			this.trigger('count:set', n);
		},

		addResult: function(groupKey, data) {
			this._results.push([groupKey, data]);
			this.trigger('result:add', this._results, [groupKey, data]);
		},

		_check: function() {
			if(!_.isNumber(this._count)) {
				return;
			}

			if(this._results.length === this._count) {
				this.trigger('finished', this, this._results);
			}
		}
	});

	return Cls;
});