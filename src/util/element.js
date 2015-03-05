define([
	'underscore',
	'jquery'
], function(_, $) {
	'use strict';
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