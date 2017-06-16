Meteor.subscribe('userData');

Template.confirmationPage.helpers({
	'getArrDate': function(){return Session.get('arrDate')},
	'getNumOfNights': function(){return Session.get('numOfNights')},
	'getDepDate': function(){return Session.get('depDate')},
})

Template.confirmationPage.events({
	'click .bookNowBox': function(e){
		//Complete Add a document to the users account in the Meteor.users() db.
		//Add all of the dates in the selectedDatesList to the unavailableDates db.

		var currentAcc = Meteor.userId //get the id of the currently logged-in user
		//console.log(currentAcc)
		var selectedDatesList = Session.get('selectedDates')
		var documentName = selectedDatesList[0].toString() //Getting string value of the arr date for this booking, (for use as name for booking document)
		console.log(documentName)
		var datesArray = selectedDatesList
		
		//Meteor.call('addBooking', documentName, datesArray) //Calling serverside method to complete the booking
		console.log('Booking Completed! Thank you!')
		//TODO: redirect to home page
		
		function numberToWord(num){
			var numberWords = [
			'One','Two','Three','Four','Five','Six','Seven',
			'Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen'
			];
			return numberWords[num - 1]
			console.log(numberWords[num-1])
		}

		//******* Stripe payment dialog box code goes here *******
		var numOfNights = Session.get('numOfNights')
		var cost = numOfNights * 4000 //$40 Flat rate/night
		var desc = numberToWord(numOfNights) + ' night(s) - $' + 40*numOfNights 

      	e.preventDefault();

      	StripeCheckout.open({
	        key: 'pk_test_dYxemQdfb6WJxKWHakXhYPBV',
	        amount: cost, 
	        name: 'Cottage booking',
	        description: desc,
	        panelLabel: 'Book now!',
	        token: function(res) {
	          	stripeToken = res.id;
	          	console.info(res);
	          	Meteor.call('chargeCard', stripeToken);
	        }
      	});
    
	  
		

	}
})