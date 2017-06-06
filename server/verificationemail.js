if (Meteor.isServer){
  Meteor.startup(function(){
  process.env.MAIL_URL = "smtp://postmaster%40sandbox260a407c6ce84fc2aff615cd40540759.mailgun.org:991af7d5c9f9ced9b6ae3ffe7ee9d500@smtp.mailgun.org:587"
  Accounts.config({
    sendVerificationEmail: true
  })

  })
}