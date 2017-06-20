Template.confirmationPage.events({
	'click .goHomeButton': function(){
		//location.reload();
		console.log('goHome clicked!')
		Router.go('goHome')
	}
})
