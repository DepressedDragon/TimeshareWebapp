Meteor.subscribe('userData');

Template.confirmationPage.helpers({
	'getArrDate': function(){return Session.get('arrDate')},
	'getNumOfNights': function(){return Session.get('numOfNights')},
	'getDepDate': function(){return Session.get('depDate')},
})

Template.confirmationPage.events({
	'click .bookNowBox': function(){
		//Complete Add a document to the users account in the Meteor.users() db.
		//Add all of the dates in the selectedDatesList to the unavailableDates db.

		var currentAcc = Meteor.userId //get the id of the currently logged-in user
		//console.log(currentAcc)
		var selectedDatesList = Session.get('selectedDates')
		var documentName = selectedDatesList[0] //Getting primitive value of the arr date for this booking, (for us as primary key for booking document)
		console.log(documentName)
		Meteor.call('addBooking', documentName)
		console.log(Meteor.users.find().fetch())
		
	}
})