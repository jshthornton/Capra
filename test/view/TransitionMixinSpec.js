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

		it('Should auto transition', function() {
			var $el = $('<div/>');
			$(document.body).append($el);

			var view = new this.FauxView({
				el: $el[0]
			});

			expect(view.props.get('transition')).toEqual(TransitionState.IN);
		});
	});
});