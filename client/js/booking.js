//Setup
Session.set({ //Defining placeholders
	'arrDate': 'DD/MM/YYYY',
	'depDate': 'DD/MM/YYYY',
	'duration': 0
})

Session.set('currentFinding', 'arr') //Starting selection on arr date

Session.set({ //Starting display settings
	'arrState': 'display',
	'next1State': 'display',
	'depState': 'hide',
	'next2State': 'hide',
	'endState': 'hide'
})

Template.bookingPage.helpers({

	'getArrDate': function(){return Session.get('arrDate')},
	'getDepDate': function(){return Session.get('depDate')},

	'arrState': function(){return Session.get('arrState')},
	'next1State': function() {return Session.get('next1State')},
	'depState': function() {return Session.get('depState')},
	'next2State': function() {return Session.get('next2State')},
	'endState': function() {return Session.get('endState')},

	'setArrDate': function(){
		if (Session.get('currentFinding') == 'arr') {//if we're selecting an arr date right now 
			selectedDay = Session.get('selectedDay')
			selectedMonth = Session.get('selectedMonth')
			selectedYear = Session.get('selectedYear')
			selectedDate = selectedDay + "/" + selectedMonth + "/" + selectedYear

			Session.set('arrDate', selectedDate) //Setting the date
		}
	},
	'setDepDate': function(){
		if (Session.get('currentFinding') == 'dep') {//if we're selecting a dep date right now
			selectedDay = Session.get('selectedDay')
			selectedMonth = Session.get('selectedMonth')
			selectedYear = Session.get('selectedYear')
			selectedDate = selectedDay + "/" + selectedMonth + "/" + selectedYear
			
			Session.set('depDate', selectedDate) //Setting the date
		}
	}

})

Template.bookingPage.events({
	
	'click .next1': function() { 
		Session.set('currentFinding', 'dep');
		Session.set({
			'arrState': 'hide',
			'next1State': 'hide',
			'depState': 'display',
			'next2State': 'display',
			'endState': 'hide'
		})
	},

	'click .next2': function(){
		Session.set('currentFinding', 'none');
		Session.set({
			'arrState': 'hide',
			'next1State': 'hide',
			'depState': 'hide',
			'next2State': 'hide',
			'endState': 'display'
		})
	}
})
