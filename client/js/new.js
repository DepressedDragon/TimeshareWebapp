Router.route('/calendar');
Router.route('/home');
Router.route('/booking');
Router.route('/');
Router.route('/payment');
Router.route('/confirmation')

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

