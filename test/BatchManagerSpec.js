define(['capra/BatchManager', 'backbone'], function(BatchManager, Backbone) {
	describe('capra/BatchManager', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
			this.batchManager = new BatchManager();
		});

		it('Should create an instance', function() {
			expect(this.batchManager instanceof BatchManager).toEqual(true);
		});

		it('Should set the count', function() {
			expect(this.batchManager._count).toEqual(null);
			this.batchManager.setCount(1);
			expect(this.batchManager._count).toEqual(1);
		});

		it('Should add result', function() {
			this.batchManager.addResult(true);
			expect(this.batchManager._results[0][0]).toEqual(true);
		});

		it('Should finish (set before)', function() {
			var onFinish = jasmine.createSpy('onFinish');
			this.evt.listenTo(this.batchManager, 'finished', onFinish);

			this.batchManager.setCount(1);
			this.batchManager.addResult(true);
			expect(onFinish).toHaveBeenCalled();
		});

		it('Should finish (set after)', function() {
			var onFinish = jasmine.createSpy('onFinish');
			this.evt.listenTo(this.batchManager, 'finished', onFinish);

			this.batchManager.addResult(true);
			this.batchManager.setCount(1);
			expect(onFinish).toHaveBeenCalled();
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});