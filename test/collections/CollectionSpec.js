define([
	'ring',
	'underscore',
	'capra/collections/Collection',
	'capra/models/Model'
], function(ring, _, Collection, Model) {
	describe('capra/collections/Collection', function() {
		it('Should keep the same model', function() {
			/*var FauxCollection = ring.create([Collection], {
				constructor: function() {
					console.log('here');
					this.model = Model;
					this.$super.apply(this, arguments);
				}
			});

			var collection = new FauxCollection();
			expect(collection.model).toEqual(Model);*/

			var A = ring.create({

			});

			var C = {};

			var B = ring.create({
				constructor: function() {
					_.bindAll(this);

					this.item = A;
				}
			});

			var b = new B();

			expect(b.item).toEqual(A);
		});
	});
});