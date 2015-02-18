define([
	'jquery'
], function($) {
	'use strict';
	return function() {
		var length = arguments.length,
			promise = $.when.apply($.when, arguments),
			def = new $.Deferred();

		promise.then(function() {
			if(length === 1) {
				def.resolve(Array.prototype.slice.call(arguments));
			} else {
				def.resolve.apply(this, arguments);
			}
		}, function() {
			if(length === 1) {
				def.reject(Array.prototype.slice.call(arguments));
			} else {
				def.reject.apply(this, arguments);
			}
		});

		return def.promise();
	};
});