Router.route('/calendar');
Router.route('/home');
Router.route('/booking');
Router.route('/');



/*Template.userRegister.events({
    'submit form': function(event){
        event.preventDefault();
        var emailVar = event.target.userRegisterEmail.value;
        var passwordVar = event.target.userRegisterPassword.value;
        console.log("Form submitted.");
    }
});
Template.ownerRegister.events({
    'submit form': function(event){
        event.preventDefault();
        var ownerEmailVar = event.target.ownerRegisterEmail.value;
        var ownerPasswordVar = event.target.ownerRegisterPassword.value;
        console.log("Form submitted")
    }
});



Template.userCheck.helpers({
	"user_check" : function(){
		var x = document.getElementById("user_input");
		var henry = "";
		var length = henry.length;
		if (length > 1){
			return "Greater than 1" + user_name;
		}
		else{
			return "Fake";
		}
	}
});

Template.ownerCheck.helpers({
	"owner_check" : function(){
		var joey = "Joeysname"
		if (joey.length > 0){
			return "greater"
		}
		else {
			return "lesser" + owner_name
		}
	}

});
*/