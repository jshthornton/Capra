define([
	'capra/view/View',
	'backbone'
], function(View, Backbone) {
	describe('capra/view/View', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
		});
		it('Should create an instance', function() {
			var view = new View();

			expect(view instanceof View).toEqual(true);
		});

		it('Should auto render', function() {
			var view = new View();

			expect(view.props.get('isRendered')).toEqual(true);
		});

		it('Should not auto render', function() {
			var view;

			view = new View({
				props: {
					autoRender: false
				}
			});

			expect(view.props.get('isRendered')).toEqual(false);
		});

		it('Should auto startup', function() {
			var view = new View({
				props: {
					autoRender: true
				}
			});

			expect(view.props.get('isStartedup')).toEqual(true);
		});

		it('Should not auto startup', function() {
			var view = new View({
				props: {
					autoStartup: false
				}
			});

			expect(view.props.get('isStartedup')).toEqual(false);
		});

		it('Should replace cid', function() {
			var view = new View({
				cid: 'test'
			});

			expect(view.cid).toEqual('test');
		});

		it('Should be removed', function() {
			var view = new View();

			view.remove();

			expect(view.props.get('isRemoved')).toEqual(true);
		});

		it('Should be removed (event)', function() {
			var view = new View();

			var fired = false;
			this.evt.listenTo(view.props, 'change:isRemoved', function() {
				fired = true;
			});
			view.remove();

			expect(fired).toEqual(true);
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});