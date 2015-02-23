define([
	'capra/view/View',
	'backbone',
	'ring',
	'underscore'
], function(View, Backbone, ring, _) {
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

		it('Should render fn template', function() {
			var fauxId = _.uniqueId('el_');

			var FauxView = ring.create([View], {
				template: _.template('<div class="' + fauxId + '"></div>')
			});

			var view = new FauxView();

			expect(view.$el.find('.' + fauxId).length).toEqual(1);
		});

		it('Should render string template', function() {
			var fauxId = _.uniqueId('el_');

			var FauxView = ring.create([View], {
				template: '<div class="' + fauxId + '"></div>'
			});

			var view = new FauxView();

			expect(view.$el.find('.' + fauxId).length).toEqual(1);
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});