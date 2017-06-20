import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup.
  //bookedDates.remove({})  //**DANGER! Only do this to clear the entire collection.. 
});

//Sending 'bookings' doc to client for each users acc
Meteor.publish('userData', function () {
  if (this.userId) { //Making sure someone is logged 
    return Meteor.users.find({ _id: this.userId }, {
      fields: { bookings: 1}
    });
  } 
  else {
    this.ready(); //if not, Declare that no data is being published, and the publish is ready(to avoid other feature mode)
  }
});

Accounts.onCreateUser(function(options, user) {
   	user.bookings = [];
    return user;
});

Meteor.methods({
	'addBooking': function(documentName, datesArray, monthOne, monthTwo, yearOne, yearTwo){
		console.log('Hello! This is running on server, but was called on client!')
		var currentAcc = Meteor.userId();
		console.log(currentAcc);

		Meteor.users.update({_id: Meteor.userId()}, 
			{ 
			$push: {
			 	'bookings' : {
					'Name': documentName,
					'bookedDates': datesArray, 
					'month1': monthOne, 
					'month2': monthTwo,
					'year1': yearOne, 
					'year2': yearTwo
			 	}
			} 
		})
		//Adding these booked dates to the unavailableDates collection
		for (i = 0; i <= datesArray.length - 1; i++) { //for each date
				var d = datesArray[i];
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();

				var queryResult = bookedDates.findOne({'day': day, 'month': month, 'year': year}, {'arr': true, 'dep': true})

				if (i == 0) { //arr date (always first in array)
					if (queryResult != undefined) { //If we've found a matching date in the booked dates List
						if(queryResult.dep == true) {
							bookedDates.update({_id: queryResult._id}, { $set: {'arr': true} }) //Using update() because this is another persons dep date
						}
						else {console.log('Error: could not set the arr date')}
					}
					else {
						bookedDates.insert({ 
							'day': day,
							'month': month,
							'year': year,
							'arr': true,
							'dep': false
						});
					}
				}
				else if (i == datesArray.length-1) { //dep date (always last in array)
					if (queryResult != undefined) { //If we've found a matching date in the booked dates List
						bookedDates.update({_id: queryResult._id}, { $set: {'dep': true} }) //Using update() because this is another persons arr date
					}
					else {
						bookedDates.insert({ 
							'day': day,
							'month': month,
							'year': year,
							'arr': false,
							'dep': true	
						});
					}
				}
				else { //normal 'in-between' unavailable date
					bookedDates.insert({
						'day': day,
						'month': month,
						'year': year,
						'arr': false,
						'dep': false
					});
				} 
			}	
		}


	})