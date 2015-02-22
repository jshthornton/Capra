define([
	'underscore',
	'jquery'
], function(_, $) {
	return {
		isAttached: function(element) {
			if(_.isElement(element) === false) {
				throw new Error('Not an element');
			}

			if(element.parentElement === null) {
				return false;
			}

			return $.contains(document.documentElement, element);
		}
	};
});