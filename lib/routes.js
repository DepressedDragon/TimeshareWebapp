//All Routes for webapp go in this file
Router.configure({ 
	//iron:router configurations
	layoutTemplate: "layout" //Default layout template gets displayed on every page of the application
});

Router.route('/', {
	//options for the route
	template: 'homePage'
});

Router.route('/about', {
	template: 'aboutPage'
})

Router.route('/calendar', {
	template: 'calendarPage',
	onBeforeAction: function(){ //Function to check if user is logged in, denys access to this page if false
		var currentUser = Meteor.userId();
		if (currentUser) { 
			//is logged-in
			this.next(); //'this' context refers to the route, and the next() function continues running the route per normal
		}
		else {
			//not logged-in
			Router.go('/')
			alert("Please log in to view this page!")
		}
	}

});

Router.route('/booking', {
	template: 'bookingPage'
})

Router.route('/checkout', {
	template: 'checkoutPage'
})

