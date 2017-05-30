Router.route('/calendar');
Router.route('/home');
Router.route('/booking');
Router.route('/');
Router.route('/payment')
/*
if (Meteor.isClient){
	Meteor.startup(function(){
		Stripe.setPublishableKey(Meteor.settings.public.StripePub);
	})

	Template.body.events({
		submit . payment-form: function(event){
			even.preventDefault();

			var cardDetails = {
				"number": event.target.cardNumber.value,
				"cvc": event.target.cardCVC.value,
				"exp_month": event.target.cardExpiry.MM.value,
				"exp_year": event.target.cardExpiry.YY.value,
			}
			Stripe.createToken(cardDetails, function()status, result){
				if(result.error){
					alert(result.error.message);
				}
				else{
					console.log(result)
				}
			})
		}
	})
}
if (Meteor.isServer){

}

*/
if (Meteor.isClient) {
  Meteor.startup(function(){
    Stripe.setPublishableKey(Meteor.settings.public.StripePub);
  });

  Template.body.events({
    "submit .payment-form": function(event){
      event.preventDefault();

      var cardDetails = {
        "number": event.target.cardNumber.value,
        "cvc": event.target.cardCVC.value,
        "exp_month": event.target.cardExpiryMM.value,
        "exp_year": event.target.cardExpiryYY.value
      }

      Stripe.createToken(cardDetails, function(status, result){
        if(result.error){
          alert(result.error.message);
        }else{
          Meteor.call("chargeCard", result.id, function(err, response){
            if(err){
              alert(err.message);
            }else{
              console.log(response);
              alert("You were successfully charged:" + response);
            }
          })
        }
      })
    }
  })
}

if (Meteor.isServer) {
  var stripe = StripeAPI(Meteor.settings.StripePri);

  Meteor.methods({
    "chargeCard": function(cardToken){
      stripe.charges.create({
        amount: 500,
        currency: "aud",
        source: cardToken
      }, function(err, result){
        if(err){
          throw new Meteor.error(500, "stripe-error", err.message);
        }else{
          console.log(result);
          return result;
        }
      })
    }
  })
}


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