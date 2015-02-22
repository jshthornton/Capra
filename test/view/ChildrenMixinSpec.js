define([
	'capra/view/ChildrenMixin',
	'ring',
	'capra/view/View'
], function(ChildrenMixin, ring, View) {
	describe('capra/view/ChildrenMixin', function() {
		beforeAll(function() {
			this.FauxView = ring.create([ChildrenMixin, View], {});
		});

		it('Should set a child (named)', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild('test', child);

			expect(parent.children.get('test')).toEqual(child);
		});

		it('Should set a child (unamed)', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild(child);

			expect(parent.children.get(child.cid)).toEqual(child);
		});

		it('Should not parent itself', function() {
			var parent = new this.FauxView();

			expect(function() {
				parent.addChild(parent);
			}).toThrow();
		});

		it('Should unset child', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild('test', child);

			expect(parent.children.get('test')).toEqual(child);

			parent.removeChild('test');

			expect(parent.children.get('test')).toEqual(undefined);
		});

		it('Should not remove non child', function() {
			var parent = new this.FauxView();

			expect(function() {
				parent.removeChild('test');
			}).toThrow();
		});
	});
});