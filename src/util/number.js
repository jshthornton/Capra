define([
], function() {
	return {
		increment: function(n, min, max) {
			if(n >= max) {
				return min;
			}

			return n+1;
		},

		decrement: function(n, min, max) {
			if(n <= min) {
				return max;
			}

			return n-1;
		}
	};
});