
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
      });
    }
  });
}
*/
import { Email } from 'meteor/email'

if (Meteor.isServer){
  Meteor.startup(function(){

  process.env.MAIL_URL = ""
})
  Accounts.config({
    sendVerificationEmail: true
  })


  
  Email.send({
    from: "booking@timesharewebapp.com",
    to:"hockeyfan534@gmail.com",
    subject:"Hello",
    text: "What's going on"
  })

  Meteor.methods({
    'sendEmail': function(toAddr,subj,text){
      this.unblock();
      console.log("Henry");
      Email.Send({
        from: "booking@timesharewebapp.com",
        to:Meteor.toAddr,
        subject : subj,
        text: text
      })
    }
  })

}