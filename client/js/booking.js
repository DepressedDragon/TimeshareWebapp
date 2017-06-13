//Setup
Session.set({ //Defining placeholders
	'arrDate': 'DD/MM/YYYY',
	'depDate': 'DD/MM/YYYY',
	'duration': 0
})

Session.set('currentlyFindingArr', true) //Starting selection on arr date

Session.set({ //Starting display settings
	'arrState': 'display',
	'next1State': 'display',
	'depState': 'greyOut',
	'next2State': 'greyOut',
	'endState': 'greyOut'
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
		selectedDatesArray = Session.get('selectedDates')
		if (Session.get('currentlyFindingArr') == true && selectedDatesArray.length != 0) {//if we're selecting an arr date right now (also checks if a date has been selected since the default is an empty array)
			selectedArrDate = selectedDatesArray[0] //getting first date in the list (always arr date) 

			selectedDay = selectedArrDate.getDate()
			selectedMonth = selectedArrDate.getMonth()
			selectedYear = selectedArrDate.getFullYear()
			selectedDateString = selectedDay + "/" + selectedMonth + "/" + selectedYear

			Session.set('arrDate', selectedDateString) //Setting the date
		}
	}

})

Template.bookingPage.events({
	
	'click .next1': function() { 
		console.log('clicked next1')
		Session.set('currentlyFindingArr', false);
		Session.set({
			'arrState': 'greyOut',
			'next1State': 'greyOut',
			'depState': 'display',
			'next2State': 'display',
			'endState': 'greyOut'
		})
	},

	'submit .numOfNights': function(event){
		event.preventDefault(); //Preventing default browser interpretation of html forms, thus preventing page refresh
		var numOfNights = Number(event.target.numOfNights.value)
		console.log(numOfNights)


		if (isNaN(numOfNights) == false && numOfNights <= 14 && numOfNights > 0){ //Only runs code if a number between 1 and 14 was entered.
			var selectedDatesArray = Session.get('selectedDates')
			selectedDatesArray.splice(1, selectedDatesArray.length) //Deleting everything in the list execpt for the arr date (first index)
			console.log(selectedDatesArray)

			//Generating list of selectedDates
			for (i = 0; i <= numOfNights-1; i++){ //for each date
				arrDate = selectedDatesArray[0] //Arr date is base
				newDate = new Date(arrDate.getTime()) //Create a new date that is identical to the base date
				newDate.setDate(arrDate.getDate()+i+1); //Set the new date i distance from the base
				selectedDatesArray.push(newDate);
			}

			//Simply for printing for log
			for (i = 0; i <= selectedDatesArray.length-1; i++) {
				thisDate = selectedDatesArray[i]
				console.log(thisDate.getDate() + "/" + thisDate.getMonth() + "/" + thisDate.getFullYear())
				if (i == 0){console.log("added Dates:")}
			}

			//Preform checks to make sure that these dates do not interfere with already booked dates. 
			var arrivalDate = selectedDatesArray[0]
			
			var thisMonth = arrivalDate.getMonth()
			var nextMonth;
			if (thisMonth == 11) {nextMonth = 0} 
			else {nextMonth = thisMonth + 1}

			var evaluationMonths = [thisMonth, nextMonth]
			var evaluationYears = [arrivalDate.getFullYear(), arrivalDate.getFullYear()+1]
			console.log(evaluationMonths)
			console.log(evaluationYears)
			

			var unavailableDatesCursor = bookedDates.find({
				month: { $in: evaluationMonths}, 
				year: { $in: evaluationYears}
			})

			console.log(unavailableDatesCursor.fetch())
			
			


			Session.set('selectedDates', selectedDatesArray)



		}
		else {console.log("Error: please enter a number between 1 and 14!")}
	},

	'click .next2': function(){
		Session.set({
			'arrState': 'greyOut',
			'next1State': 'greyOut',
			'depState': 'greyOut',
			'next2State': 'greyOut',
			'endState': 'display'
		})
	},

	'click .proceed': function(){
		console.log("Going to the next page!")
		Router.go("/confirmation")
	}
})
