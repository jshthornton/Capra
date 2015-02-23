define([
	'capra/view/TransitionMixin',
	'capra/view/TransitionState',
	'ring',
	'capra/view/View'
], function(TransitionMixin, TransitionState, ring, View) {
	describe('capra/view/TransitionMixin', function() {
		beforeAll(function() {
			this.FauxView = ring.create([TransitionMixin, View], {});
		});

		it('Should be using enum', function() {
			var view = new this.FauxView();

			expect(view.props.get('transition')).toEqual(null);
		});
	});
});