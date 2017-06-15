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
  } else {
    this.ready(); //if not, Declare that no data is being published, and the publish is ready(to avoid other feature mode)
  }
});

Meteor.methods({
	'addBooking': function(documentName){
		//console.log('Hello! This is running on server, but was called on client!')
		var currentAcc = Meteor.userId();
		console.log(currentAcc);

		Meteor.users.update({_id: Meteor.userId()}, { $set: 
			{'bookings' : {
				documentName: {'apples':true, 'oranges':false} //TODO: Variable not working??
				}

			} 
		})
		

		//console.log(Meteor.users.find().fetch())
	}	


})


