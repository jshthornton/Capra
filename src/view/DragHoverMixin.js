define([
	'jquery',
	'ring'
], function($, ring) {
	'use strict';
	return ring.create({
		//$draggingSet

		events: {
			'dragenter.draghover': 'onDragEnterHover',
			'dragleave.draghover': 'onDragCompleteHover',
			'drop.draghover': 'onDragCompleteHover'
		},

		onDragEnterHover: function(e) {
			if($.isArray(this.$draggingSet) === false) {
				this.$draggingSet = $();
			}

			if (this.$draggingSet.length === 0) {
				this.$el.trigger('draghoverstart');
			}

			this.$draggingSet = this.$draggingSet.add(e.target);
		},

		onDragCompleteHover: function(e) {
			this.$draggingSet = this.$draggingSet.not(e.target);
			if (this.$draggingSet.length === 0) {
				this.$el.trigger('draghoverend');
			}
		}
	});
});