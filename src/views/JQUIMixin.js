define([
	'underscore',
	'ring'
], function(_, ring) {
	'use strict';
	return ring.create({

		removeJQUI: function() {
			var $widgets = $('.ui-widget, .ui-widget-content', this.$el);

			$widgets.each(function(index, element) {
				var $widget = $(element);

				_.forOwn($widget.data(), function(instance, key) {
					if(_.startsWith(key, 'ui-') === false) {
						return;
					}

					var name = key.slice(3);

					if($widget[name]('instance') !== undefined) {
						$widget[name]('destroy');
					}
				});
			});
		}
	});
});