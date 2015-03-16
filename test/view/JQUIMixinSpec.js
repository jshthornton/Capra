define([
	'capra/view/JQUIMixin',
	'ring',
	'marionette',

	'jquery-ui'
], function(JQUIMixin, ring, Marionette) {
	describe('capra/view/JQUIMixin', function() {
		beforeAll(function() {
			this.FauxView = ring.create([JQUIMixin, Marionette.View], {});
		});

		afterEach(function() {
			$(document.body).empty();
		});

		it('Should remove jquery ui instance', function() {
			var $el = $('<div/>'),
				$ui = $('<div/>');
			$el.append($ui);
			$(document.body).append($el);

			var view = new this.FauxView({
				el: $el[0]
			});

			$ui.slider();

			expect($ui.slider('instance')).not.toEqual(undefined);

			view.removeJQUI();

			expect($ui.slider('instance')).toEqual(undefined);
		});

	});
});