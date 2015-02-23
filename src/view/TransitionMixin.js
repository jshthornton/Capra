define([
	'ring',
	'./TransitionState',
	'../util/element'
], function(ring, TransitionState, elementUtil) {
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

			if(this.props.get('autoTransition') === true && elementUtil.isAttached(this.el) === true) {
				this.transitionInitial();
			}
		},

		transitionInitial: function() {

		},

		transitionIn: function() {

		},

		transitionOut: function() {

		}
	});
});