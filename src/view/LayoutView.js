define([
	'./View',
	'./ChildrenMixin',
	'ring'
], function(View, ChildrenMixin, ring) {
	return ring.create([ChildrenMixin, View], {
		initialize: function(options) {
			this.$super(options);
		}
	});
});