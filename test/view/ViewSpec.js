define([
	'capra/view/View'
], function(View) {
	describe('capra/view/View', function() {
		it('Should create an instance', function() {
			var view = new View();

			expect(view instanceof View).toEqual(true);
		});

		it('Should auto render', function() {
			var view = new View({
				props: {
					autoRender: true
				}
			});

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

			view = new View();

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
	});
});