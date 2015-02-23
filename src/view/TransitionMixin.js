define([
	'underscore',
	'ring',
	'./TransitionState',
	'../util/element'
], function(_, ring, TransitionState, elementUtil) {
	return ring.create({
		_initialState: function(options) {
			this.$super(options);

			this.props.set({
				transition: null,
				autoTransition: true
			});
		},

		_afterRender: function() {
			this.$super();

			if(this.props.get('autoTransition') === true && elementUtil.isAttached(this.el) === true) {
				this.transitionIn();
			}
		},

		transitionIn: function() {
			this.props.set('transition', TransitionState.PROGRESS_IN);
			this.props.set('transition', TransitionState.IN);
		},

		transitionOut: function() {
			this.props.set('transition', TransitionState.PROGRESS_OUT);
			this.props.set('transition', TransitionState.OUT);
		},
	});
});