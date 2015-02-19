define(['capra/ArrayList', 'backbone'], function(ArrayList, Backbone) {
	describe('capra/ArrayList', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
			this.arrayList = new ArrayList();
		});

		it('Should create an instance', function() {
			expect(this.arrayList instanceof ArrayList).toEqual(true);
		});

		it('Should update length (add)', function() {
			expect(this.arrayList.length).toEqual(0);

			this.arrayList.add(true);
			expect(this.arrayList.length).toEqual(1);
		});

		it('Should update length (remove)', function() {
			expect(this.arrayList.length).toEqual(0);

			this.arrayList.add(true);
			expect(this.arrayList.length).toEqual(1);

			this.arrayList.remove(0);
			expect(this.arrayList.length).toEqual(0);
		});

		it('Should update length (clear)', function() {
			expect(this.arrayList.length).toEqual(0);
			
			this.arrayList.add(true);
			expect(this.arrayList.length).toEqual(1);

			this.arrayList.clear();
			expect(this.arrayList.length).toEqual(0);
		});

		it('Should be able to get element', function() {
			expect(this.arrayList.length).toEqual(0);
			
			this.arrayList.add(true);
			expect(this.arrayList.at(0)).toEqual(true);
		});

		it('Should be able to add multiple', function() {
			expect(this.arrayList.length).toEqual(0);
			
			this.arrayList.add([0, 1, 2], {
				multiple: true
			});
			expect(this.arrayList.at(0)).toEqual(0);
			expect(this.arrayList.at(1)).toEqual(1);
			expect(this.arrayList.at(2)).toEqual(2);
		});

		it('Should be able to add multiple (at index)', function() {
			expect(this.arrayList.length).toEqual(0);
			
			this.arrayList.add(true);

			this.arrayList.add([0, 1, 2], {
				multiple: true,
				at: 0
			});

			expect(this.arrayList.at(0)).toEqual(0);
			expect(this.arrayList.at(1)).toEqual(1);
			expect(this.arrayList.at(2)).toEqual(2);
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});