Router.route('/calendar');
Router.route('/home');
Router.route('/booking');
Router.route('/');
<<<<<<< HEAD
Router.route('/payment');
Router.route('/email');


=======
Router.route('/payment')



Template.payment.onCreated(() => {
  let template = Template.instance();
  template.selectedService = new ReactiveVar( false )
  template.processing = new ReactiveVar( false );
  template.checkout = StripeCheckout.configure({
    key: Meteor.settings.public.stripe,
    image: 'http://i.huffpost.com/gen/4317942/images/o-COTTAGE-BASEMENT-RENOVATION-facebook.jpg',
    locale: 'auto'
    token(token){
       let service = template.selectedService.get(),
          charge  = {
            amount: token.amount || service.amount,
            currency: token.currency || 'cad',
            source: token.id,
            description: token.description || service.description,
            receipt_email: token.email
          };
    };
  });
});

Template.payment.helpers({
  processing() {
    return Template.instance().processing.get();
  }
});

Template.payment.events({
    'click [data-service]' ( event, template ) {
    const pricing = {
      'Rental': {
        amount: 300000,
        description: "Two day rental"

    let service = pricing[ event.target.dataset.service ];

    template.selectedService.set( service );
    template.processing.set( true );

    template.checkout.open({
      name: 'Cottage rental',
      description: service.description,
      amount: service.amount,
      bitcoin: true
    });
  }
})


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

*/
>>>>>>> parent of 3db8238... Working credit card payment
