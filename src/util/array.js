define([
	'underscore',
	'./number'
], function(_, numberUtil) {
	'use strict';

	return {
		next: function(arr, index, loop) {
			if(_.isNumber(index) === false || index === -1 || _.isArray(arr) === false || arr.length === 0) {
				return -1;
			}

			if(loop === true) {
				return numberUtil.increment(index, 0, arr.length - 1);
			}


			if(index >= arr.length - 1) {
				return -1;
			}

			return index + 1;
		},

		prev: function(arr, index, loop) {
			if(_.isNumber(index) === false || index === -1 || _.isArray(arr) === false || arr.length === 0) {
				return -1;
			}

			if(loop === true) {
				return numberUtil.decrement(index, 0, arr.length - 1);
			}


			if(index <= 0) {
				return -1;
			}

			return index - 1;
		}
	};
});
