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

		it('Should unset child (and remove)', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild('test', child);

			expect(parent.children.get('test')).toEqual(child);

			parent.children.unset('test');

			expect(parent.children.get('test')).toEqual(undefined);
			expect(child.props.get('isRemoved')).toEqual(true);
		});

		it('Should unset a removed child', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild('test', child);
			expect(parent.children.get('test')).toEqual(child);

			child.remove();
			expect(parent.children.get('test')).toEqual(undefined);
			expect(child.props.get('isRemoved')).toEqual(true);
		});

		it('Should remove child upon removing parent', function() {
			var parent = new this.FauxView(),
				child = new View();

			parent.addChild('test', child);
			expect(parent.children.get('test')).toEqual(child);

			parent.remove();
			expect(parent.children.get('test')).toEqual(undefined);
			expect(parent.props.get('isRemoved')).toEqual(true);
			expect(child.props.get('isRemoved')).toEqual(true);
		});
	});
});