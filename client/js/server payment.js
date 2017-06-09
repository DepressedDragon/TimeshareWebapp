
/*if (Meteor.isServer) {
  Meteor.methods({
    'chargeCard': function(stripeToken) {
      check(stripeToken, String);
      var Stripe = StripeAPI('sk_test_y6fnJrdaQKd9MAolZcm3uLqI');

      Stripe.charges.create({
        source: stripeToken,
        amount: 50, // this is equivalent to $50
        currency: 'cad'
      }, function(err, charge) {
        console.log(err, charge);
        if(err){
          throw new Meteor.error(500, "stripe-error", err.message);
        }
        else{
          return (charge)
        }
      });
    }
  });
  

}*/
Template.email.events({
  'click button': function (e,t) {
    console.log("Send the email")
    e.preventDefault();
    var toAddr=t.find('#inputEmail').value;
    var subject = ("Booked");
    var body = ("Thanks for booking");
    Meteor.call('sendEmail', toAddr, subj, text)
  }
})
