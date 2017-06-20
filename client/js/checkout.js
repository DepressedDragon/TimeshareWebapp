Meteor.subscribe('userData');

Session.set('payNowState', 'display')
Session.set('bookNowState', 'overlay')

Template.checkoutPage.helpers({

	'getArrDate': function(){return Session.get('arrDate')},
	'getNumOfNights': function(){return Session.get('numOfNights')},
	'getDepDate': function(){return Session.get('depDate')},
	'getTotalCost': function(){
		//Calculating total cost of booking
		var numOfNights = Session.get('numOfNights')
		var totalCost = numOfNights * 40 //$40 Flat rate/night

		return "$" + totalCost + ".00 CAD"
	},

	'payNowState': function(){return Session.get('payNowState')},
	'bookNowState': function(){return Session.get('bookNowState')}
})

Template.checkoutPage.events({
	'click .payNowButton': function(e) {
		Session.set('payNowState', 'overlay')
		setTimeout( function() {Session.set('bookNowState', 'display')}, 5000); //Delay to wait for the Stripe dialogue box to pop up

		//Stripe payment dialog box code
		function numberToWord(num){
			var numberWords = [
			'One','Two','Three','Four','Five','Six','Seven',
			'Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen'
			];
			return numberWords[num - 1]
		}
		
		var numOfNights = Session.get('numOfNights')
		var cost = numOfNights * 4000 //$40 Flat rate/night (stripe uses cents)
		var desc = numberToWord(numOfNights) + ' night(s) - $' + 40*numOfNights 

      	e.preventDefault();

      	StripeCheckout.open({
	        key: 'pk_test_dYxemQdfb6WJxKWHakXhYPBV',
	        amount: cost, 
	        name: 'Cottage booking',
	        description: desc,
	        panelLabel: 'Continue now!',
	        token: function(res) {
	          	stripeToken = res.id;
	          	console.info(res);
	          	Meteor.call('chargeCard', stripeToken);
	        }
      	});
	},


	'click .bookNowButton': function(){
		//Complete Add a document to the users account in the Meteor.users() db.
		//Add all of the dates in the selectedDatesList to the unavailableDates db.

		//var currentAcc = Meteor.userId //get the id of the currently logged-in user
		var selectedDatesList = Session.get('selectedDates')
		var documentName = selectedDatesList[0].toString() //Getting string value of the arr date for this booking, (for use as name for booking document)
		var datesArray = selectedDatesList
		
		//Getting the years and months that this booking uses for storage in the database
		var month1, month2 = -1;
		var year1, year2 = -1;
		for (i = 0; i < selectedDatesList.length -1; i++){
			thisDatesMonth = selectedDatesList[i].getMonth()
			thisDatesYear = selectedDatesList[i].getFullYear()
			if (i == 0) {
				month1 = thisDatesMonth;
				year1 = thisDatesYear
			}
			else {
				if(thisDatesMonth != month1){
					month2 = thisDatesMonth;
				}
				if (thisDatesYear != year1) {
					year2 = thisDatesYear
				}
			}
		}

		Meteor.call('addBooking', documentName, datesArray, month1, month2, year1, year2) //Calling serverside method to complete the FINAL booking
		console.log('Booking Completed! Thank you!')
		
		//Going to next page
		Router.go('/confirmation')
		
		
    
	  
		

	}
})