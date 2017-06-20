import { ReactiveVar} from 'meteor/reactive-var';
//var isError = new ReactiveVar(false);

 
 Template.fixedNavbar.helpers({
	'errorDisplay': function(){
		var errorState = Session.get('errorState')
		if (errorState == true){
			return true 
		}
		else {
			return false
		}
	},

	'getErrorMessage': function(){
		var message = Session.get('errorMessage')
		console.log(message)
		return message;
	}
}) 



