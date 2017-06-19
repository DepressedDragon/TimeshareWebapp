//Functions

//formateDate function, formates dates. 
//accepts a date() object and a format method (shortDate or fullDate), returns a String. 
function formatDate(date, method) {
  	var monthNames = [
	    "January", "February", "March", "April", "May", "June", "July",
	    "August", "September", "October", "November", "December"
  	];

  	var weekDays = [
	  	"Sunday", "Monday", "Tuesday", "Wednesday",
	  	"Thursday", "Friday", "Saturday"
  	];

	var dayIndex = date.getDay();
	var dateV = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	if (method == 'shortDate') {
		//String formatting for short dates (dd/mm/yyyy)
		var dd = dateV;
		var mm =  monthIndex + 1;

		if (dd < 10){
		 	dd = '0' + dd;
		}
		if (mm < 10){
		  	mm = '0' + mm;
		}
		return  dd + '/' + mm + '/' + year
  	}
  	else if (method == 'longDate') {
  		return monthNames[monthIndex] + ' ' + dateV + ', ' + year;
  	}
	else if (method == 'fullDate') {
  		return weekDays[dayIndex] + ' ' + monthNames[monthIndex] + ' ' + dateV + ', ' + year;
  	}
	else {
		return 'Could not formate Date! Method not provided!'
	}
}

//Setup
Session.set({ //Defining placeholders
	'arrDate': 'DD/MM/YYYY',
	'depDate': 'DD/MM/YYYY',
	'duration': 0
})

Session.set('currentlyFindingArr', true) //Starting selection on arr date
Session.set('currentlyFindingNumOfNights', false)

Session.set({ //Starting display settings
	'arrState': 'display',
	'next1State': 'display',
	'depState': 'overlay',
	'next2State': 'overlay',
	'endState': 'overlay'
})



Template.bookingSidebar.helpers({
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
			selectedDateString = formatDate(selectedArrDate, 'fullDate') //Formating date into string 
			Session.set('arrDate', selectedDateString) //Setting the date
		}
	}

})

Template.bookingSidebar.events({
	
	'click .next1': function() { 
		selectedDatesArray = Session.get('selectedDates')
		if(selectedDatesArray[0] != undefined) { //Prevent users from going through until they have selected an arr date
			
			Session.set('currentlyFindingArr', false);
			Session.get('currentlyFindingNumOfNights', true)
			Session.set({
				'arrState': 'overlay',
				'next1State': 'overlay',
				'depState': 'display',
				'next2State': 'display',
				'endState': 'overlay'
			})
		}
		else {
			//Error Message
			var message = 'Please select an arrival date before continuing'
			Session.set('errorState', true)
			Session.set('errorMessage', message)
					
			//reseting error state again to hide error message after 5 seconds
			setTimeout( function() {Session.set('errorState', false) }, 5000);
		}
	},

	'submit .numOfNights': function(event){
		event.preventDefault(); //Preventing default browser interpretation of html forms, thus preventing page refresh
		var numOfNights = Number(event.target.numOfNights.value)
		Session.set('numOfNights', numOfNights)
		console.log(numOfNights)


		if (isNaN(numOfNights) == false && numOfNights <= 14 && numOfNights > 0){ //Only runs code if a number between 1 and 14 was entered.
			var selectedDatesArray = Session.get('selectedDates')
			selectedDatesArray.splice(1, selectedDatesArray.length) //Deleting everything in the list execpt for the arr date (first index) to overwrite any previous selections
			console.log(selectedDatesArray)

			//Generating list of selectedDates
			for (i = 0; i <= numOfNights-1; i++){ //for each date
				arrDate = selectedDatesArray[0] //Arr date is base
				newDate = new Date(arrDate.getTime()) //Create a new date that is identical to the base date
				newDate.setDate(arrDate.getDate()+i+1); //Set the new date i distance from the base
				selectedDatesArray.push(newDate); 
			}

			/*//Printing for log 
			for (i = 0; i <= selectedDatesArray.length-1; i++) {
				thisDate = selectedDatesArray[i]
				console.log(thisDate.getDate() + "/" + thisDate.getMonth() + "/" + thisDate.getFullYear())
				if (i == 0){console.log("added Dates:")}
			} */

			//Dates Validity Check
			var validityCheck = true; //Starting as valid

			for (i = 0; i <= selectedDatesArray.length-1; i++) {
				var d = selectedDatesArray[i];
				var day = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();
				doc = bookedDates.findOne({'day': day, 'month': month, 'year': year})
			
				if (doc != undefined) {//If the document exists in the collection..
					if (i == 0 && doc.dep == true && doc.arr == false){
						//console.log('good as an arrival date!')
					}
					else if (i == selectedDatesArray.length - 1 && doc.arr == true && doc.dep == false) {
						//console.log('good as a departure date!')
					}
					else { //If this does not meet either of the arr or dep special cases, this is an unavaialble date and therefore the selection is not valid. 
						validityCheck = false; 
						//console.log('Error: This is an overlapping date!')
					}
				}
			}
			//Final evaluation
			if (validityCheck == true){
				Session.set('selectedDates', selectedDatesArray) //Select the dates

				//setDepDate -- Setting departure date for display 
				var selectedDepDate = selectedDatesArray[selectedDatesArray.length - 1] //getting last date in the list (always dep date) 
				var selectedDateString = formatDate(selectedDepDate, 'fullDate') //Formating date into string
				Session.set('depDate', selectedDateString) //Setting the date
			}
			else {
				//Error Message
				var message = 'Unvalid selection. Not enough available dates! Please select available (green) dates'
				Session.set('errorState', true)
				Session.set('errorMessage', message)
					
				//reseting error state again to hide error message after 5 seconds
				setTimeout( function() {Session.set('errorState', false) }, 5000);
			}

			



		}
		else {
			//Error Message
			var message = 'Please enter a number between 1 and 14'
			Session.set('errorState', true)
			Session.set('errorMessage', message)
					
			//reseting error state again to hide error message after 5 seconds
			setTimeout( function() {Session.set('errorState', false) }, 5000);
		}
	},

	'click .next2': function(){
		selectedDatesArray = Session.get('selectedDates')
		if (selectedDatesArray.length > 1) { //Prevent users from going through until they have selected an arr date

			Session.set({
				'arrState': 'overlay',
				'next1State': 'overlay',
				'depState': 'overlay',
				'next2State': 'overlay',
				'endState': 'display'
			})
		}
		else {
			//Error Message
			var message = 'Please enter the number of nights you wish to stay before continuing'
			Session.set('errorState', true)
			Session.set('errorMessage', message)
					
			//reseting error state again to hide error message after 5 seconds
			setTimeout( function() {Session.set('errorState', false) }, 5000);
		}
	},

	'click .proceed': function(){
		console.log("Going to the next page!")
		Router.go("/confirmation")
	}
})
