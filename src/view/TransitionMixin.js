define([
	'ring',
	'./TransitionState'
], function(ring, TransitionState) {
	return ring.create({
		_initialState: function(options) {
			this.$super(options);

			this.props.set({
				transition: TransitionState.INITIAL,
				autoTransition: true
			});
		},

		_afterRender: function() {
			this.$super();


		},

		transitionInitial: function() {

		},

		transitionIn: function() {

		},

		transitionOut: function() {
			
		}
	});
});