Router.route('/calendar');
Router.route('/home');
Router.route('/booking');
Router.route('/');
Router.route('/payment');

if (Meteor.isClient) {
  Template.payment.events({
    'click button': function(e) {
      e.preventDefault();

      StripeCheckout.open({
        key: 'pk_test_dYxemQdfb6WJxKWHakXhYPBV',
        amount: 50, // this is equivalent to $50
        name: 'Timeshare booking',
        description: 'Three nights - $120',
        panelLabel: 'Book now!',
        token: function(res) {
          stripeToken = res.id;
          console.info(res);
          Meteor.call('chargeCard', stripeToken);
        }
      });
    }
  });
}

if (Meteor.isServer) {
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

