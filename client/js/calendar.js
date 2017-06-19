import { Template } from 'meteor/templating';
import { ReactiveVar} from 'meteor/reactive-var';


//Emulation of pythons .range() function
//Accepts [start], stop, [step], returns an array of numbers in that range.
function range(start, stop, step){ 
	if (typeof stop == 'undefined'){ //only one parameter passed
		stop = start;
		start = 0;
	}
	if (typeof step == 'undefined'){
		step = 1;
	}
	var result = []
	for (var i = start; step > 0 ? i < stop : i > stop; i+= step){
		result.push(i);
	}
	return result;
}

//Function to get the total days for any given month
//Accepts a month (int 0-11) and a year, returns total amount of days as an int
function getDays (month, year) {
	if (month == 3 || month == 5 || month == 8 || month == 10){
			numOfDays = 30
		}
	else if (month == 1){ //February calculation
		if (year % 100 == 0 && year % 400 == 0){numOfDays = 29} //century leap year
		else if (year % 4 == 0){numOfDays = 29} //regular leap year
		else{numOfDays = 28}
	} 
	else{
		numOfDays = 31
	}
	return numOfDays;

}

//Searches an array for a specific object by an object property
//Accepts an array of objects (and a predefined object property to search for, .day in this case), returns 1 object if found, returns undefined otherwise.
function getByValue(arr, value) {
  	for (var i=0, iLen=arr.length; i<iLen; i++) {
    	if (arr[i].day == value) {
    		return arr[i];
    	}
  	}
}

//Creates day objects to check for arr and dep dates
class Day {
	constructor(day, arr, dep) {
		this.day = day
		this.arr = arr
		this.dep = dep
	}
} 


//This code is in the /client folder, therefore it runs on the client only by default

//Setup
var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var todaysDate = new Date() //This is the current date. 
console.log("Today is: " + todaysDate)
Session.set('month', todaysDate.getMonth());
Session.set('year', todaysDate.getFullYear()); 

var selectedDatesArray = [];
Session.set('selectedDates', selectedDatesArray) 

var isSelectable = new ReactiveVar(false); //making selectability false to start

Template.calendarPage.helpers({
	'stopSelectable': function(){
		isSelectable = false;
	},
})

Template.bookingSidebar.helpers({
	'makeSelectable': function(){
		isSelectable = true;	
	}
})

Template.calendarPage.events({
	'click .makeABooking .textbox': function(){ //Make a booking button page redirect
		console.log('pressed!')
		Router.go('/booking')
	}
})

Template.calendar.helpers({
	//calendar helper functions go here

    'isSelectable': function(){
    	if (isSelectable == false) {
    		return false
    	}
    	else (isSelectable == true)
    		return true
    },

	'month': function(){
		var month = Session.get('month')
		return Months[month]
	},
	'year': function(){
		var year = Session.get('year')
		return year;
	},
	'numOfDays': function(){
		var numOfDays = getDays(Session.get('month'), Session.get('year')) //Getting number of days for this month
		totalDays = range(1, numOfDays + 1) //Creating a list of these days
		
		var firstDate = new Date(Session.get('year'), Session.get('month'), 1) //Getting a new date, the first of this month
		var firstDay = firstDate.getDay() //Getting the day value for this date (mo,tu,wed, etc)

		for (i = 0; i <= 6; i++) {	
			if (i == firstDay) {
				//insert correct number of placeholders to push the 1st to land on the correct week day
				numberOfInserts = firstDay - 1
				for (j = 0; j <= numberOfInserts; j++ )
				totalDays.unshift('p')
			}
		}  

		return totalDays;
	},

	'spacer': function(){ //if this is a placeholder, return 'spacer' css class which hides the date
		if (this == 'p') { 
			return 'spacer'
		}
	},

	'today': function(){ //if this date is todays date, highlight it slightly differently.
		var thisDay = Number(this)
		if (Number(this) == todaysDate.getDate() && Session.get('month') == todaysDate.getMonth() && Session.get('year') == todaysDate.getFullYear()) {
			return 'today'
		} 
	},

	'highlightSelectedDate': function(){ //This function is run every time there is a session change, and run individually for each day in the each block
		selectedDatesArray = Session.get('selectedDates')
		if (selectedDatesArray.length != 0) { //This code will only run when there is a selected date.
			
			//Getting information about this date on the calendar
			var thisDay = this //'this' refers to each respective day in the month which is being cycled in the each loop
			var thisMonth = Session.get('month')
			var thisYear = Session.get('year')

			//Gathering unavailable dates info (only needed for depUnavailable checks for styling)
			var unavailableDaysList = Session.get('unavailableDaysList')  
			var bookedDay = getByValue(unavailableDaysList, thisDay)

			for (var i = 0; i <= selectedDatesArray.length - 1; i++) { //Testing to see if this date is found inside the selectedDates list (therefore must loop over the selectedDates list)
				var selectedDate = selectedDatesArray[i]
				
				selectedDay = selectedDate.getDate()
				selectedMonth = selectedDate.getMonth()
				selectedYear = selectedDate.getFullYear()
				
				//Returning different css class references for styling to make the date look selected.
				if (thisDay == selectedDay && thisMonth == selectedMonth && thisYear == selectedYear) { //if the current session date is the same as selected, then highlight
					if(i == 0){ //arr date
						//Display the correct background gadient for different selection circumstances
						if (bookedDay != undefined) {console.log('this is not totally free'); return 'arrActiveDepUnavailable'} //If this date is not fully available, it must be a someone elses dep date, display respective style
						else if (selectedDatesArray.length <= 1) {
							return'regActive' //Reg full square border when first selecting a black arr date for aesthetics reasons only. 
						}
						else {return 'arrActive'} //Otherwise, use normal style
					}
					else if (i == selectedDatesArray.length - 1) {//dep date
						
						if (bookedDay != undefined) {return 'depActiveArrUnavailable'} //Same procedure as above
						else {return 'depActive'} //Normal style
					}
					else {
						return "regActive" //Normal style for full size in-between dates
					}
				}
			}
		}
	},
	
	'getUnavailableDates': function(){
		listOfDayObjects = []
		count = 0
		
		//In the forEach block, running each 'day' through class factory to give it the .arr or .dep boolean values.
		var bookedDatesCursor = bookedDates.find({month: Session.get('month'), year: Session.get('year') }) //Retrieve all days with this 'month' and this 'year'
		bookedDatesCursor.forEach( function(doc) {    //Looping over cursor and placing each day in the array
			//console.log(doc.day)
			listOfDayObjects[count] = new Day(doc.day, doc.arr, doc.dep) //Creating a new day objects and storing in array
			count += 1
		})
		Session.set("unavailableDaysList", listOfDayObjects)

		//Getting usersOwnBooking dates for unqiue dates display
		var usersAccount = Meteor.users.findOne({'_id': Meteor.userId()})
		if (usersAccount != undefined) { //Making the client wait until usersAccount is available to proceed
			var usersBookingObjectsArray = usersAccount.bookings;
			var usersBookings = []
			var currMonth = Session.get('month')
			var currYear = Session.get('year')

			//Getting the respective year(s) and month(s) for the displayed year/month on the calendar (only getting applicable information)
			for (var i = 0; i <= usersBookingObjectsArray.length - 1; i++) {
				var booking = usersBookingObjectsArray[i]
				if (booking.year1 == currYear || booking.year2 == currYear) {
					if (booking.month1 == currMonth || booking.month2 == currMonth) {
						usersBookings.push(booking.bookedDates)
					}
				}
			}
			Session.set('usersBookings', usersBookings)
		}

	},

	'availability': function(){
		var thisDay = Number(this)
		var unavailableDaysList = Session.get("unavailableDaysList")
		
		//console.log(unavailableDaysList)
		
		var bookedDay = getByValue(unavailableDaysList, thisDay)
		

		if (bookedDay != undefined) { //if this day is indeed booked (bookedDay will be undefined if its not booked and will not run)
   			if (bookedDay.day == thisDay) { 
   				//Preforming checks to see if this is reg, arr, dep, or duel. 
   				if (bookedDay.arr == true && bookedDay.dep == false) {
   					return "arrUnavailable" //This is an arrival date!
   				}
   				else if (bookedDay.arr == false && bookedDay.dep == true) {
   					return "depUnavailable" //This is a departure date!
   				} 
   				else if (bookedDay.arr == true && bookedDay.dep == true) { 
   					return "duelUnavailable"//This is both an arrival and departure date! Double booked! (a dep and arr on same day by different people)
   				} 
   				else { 
   					return "regUnavailable" //This is a regular 'inbetween' booked Date
   				}
			}
			else {/*console.log("available!")*/}
		}
	},

	'getUsersOwnBookings': function(){
		//Getting usersOwnBooking dates for unqiue dates display
		var usersAccount = Meteor.users.findOne({'_id': Meteor.userId()})
		if (usersAccount != undefined) { //Making the client wait until usersAccount is available to proceed
			var usersBookingObjectsArray = usersAccount.bookings;
			var usersBookings = []
			var currMonth = Session.get('month')
			var currYear = Session.get('year')

			//Getting the respective year(s) and month(s) for the displayed year/month on the calendar (only getting applicable information)
			for (var i = 0; i <= usersBookingObjectsArray.length - 1; i++) {
				var booking = usersBookingObjectsArray[i]
				if (booking.year1 == currYear || booking.year2 == currYear) {
					if (booking.month1 == currMonth || booking.month2 == currMonth) {
						usersBookings.push(booking.bookedDates)
					}
				}
			}
		}

		//Categorizing users booked Dates
		var usersArrDates = []
		var usersDepDates = []
		var usersRegDates = []
		var usersDuelDates = []

		if (usersBookings != undefined) { //making program wait for session update
			//Accessing 2D list of unique users own bookings to check if this booked date is one of the users own booked dates
			for (i = 0; i <= usersBookings.length - 1; i++){ //Getting individual booking
				for (j = 0; j <= usersBookings[i].length - 1; j++){ //Getting individual day OF individual booking
					
					var thisDate = usersBookings[i][j];
					
					//Adding correct userBookedDates to respective arrays
					if (j == 0) { //Arr date
						usersArrDates.push(thisDate.valueOf())						
					}
					else if (j == usersBookings[i].length - 1) { //Dep date
						usersDepDates.push(thisDate.valueOf())
					}
					else {
						usersRegDates.push(thisDate.valueOf()) //Reg in-between date
					}
				}
			}		

			//Getting all users DUEL booked dates
			for (a = 0; a <= usersArrDates.length - 1; a++){
				var arrDateValue = usersArrDates[a].valueOf()
				
				for (b = 0; b <= usersDepDates.length - 1; b++) {
					var depDateValue = usersDepDates[b].valueOf()

					if (arrDateValue == depDateValue) { //If the user has an an arr and dep date on the same day
						usersDuelDates.push(usersArrDates[a].valueOf()) //Adding this value to duel array
					}
				}
			}

			//removing the duel dates from arr and dep arrays
			for (c = 0; c <= usersDuelDates.length - 1; c++){
				arrIndex = usersArrDates.indexOf(usersDuelDates[c].valueOf())
				if (arrIndex != -1){
					usersArrDates.splice(arrIndex, 1) //go to arrIndex in the list, and remove 1 item
				}
				
				depIndex = usersDepDates.indexOf(usersDuelDates[c].valueOf())
				if (depIndex != -1) {
					usersDepDates.splice(depIndex, 1) //go to depIndex in the list, and remove 1 item
				}
				
			}
			//Setting all users unique booked dates to session variables
			Session.set({
				'usersArrDates': usersArrDates,
				'usersDepDates': usersDepDates,
				'usersRegDates': usersRegDates,
				'usersDuelDates': usersDuelDates
			})
		}
	},

	'usersOwnBookings': function(){
		var thisDay = Number(this)
		if (isNaN(thisDay) == false) {
			var thisDate = new Date(Session.get('year'), Session.get('month'), thisDay)
			
			var usersArrDates = Session.get('usersArrDates')
			var usersDepDates = Session.get('usersDepDates')
			var usersRegDates = Session.get('usersRegDates')
			var usersDuelDates = Session.get('usersDuelDates')
			
			if (usersArrDates != undefined && usersDepDates != undefined && usersRegDates != undefined && usersDuelDates != undefined) {
				//Displaying all users unique booked dates
				if (usersArrDates.indexOf(thisDate.valueOf()) != -1){
					return 'arrUserOwnBooking'
				}
				else if (usersDepDates.indexOf(thisDate.valueOf()) != -1){
					return 'depUserOwnBooking'
				}
				else if (usersRegDates.indexOf(thisDate.valueOf()) != -1){
					return 'regUserOwnBooking'
				}
				else if (usersDuelDates.indexOf(thisDate.valueOf()) != -1){
					return 'duelUserOwnBooking'
				}
				else {
					//console.log('This day is not user booked! Displaying nothing!')
				}
			}
		}
	}  



})

Template.calendar.events({
	//calendar events go here
	'click .prev': function(){
		
		month = Session.get('month')
		if (month == 0){ //if jan, go to last years dec, not -1 month.
			Session.set('year', Session.get('year') - 1)
			Session.set('month', 11)
		}
		else{ //else go to last month
		Session.set('month', Session.get('month') - 1);
		} 

	},

	'click .next': function(){
		
		month = Session.get('month')
		if (month == 11){ //if dec, go to next years jan, not 13th month. 
			Session.set('year', Session.get('year') + 1)
			Session.set('month', 0)
		}
		else{// else go to next month
		Session.set('month', Session.get('month') + 1);
		} 

	},

	'click .day': function(){ //Selecting a DATE event
	
		function selectThisDay(selectedDay) {
			var selectedMonth = Session.get('month')
			var selectedYear = Session.get('year')
		
			var date = new Date(selectedYear, selectedMonth, selectedDay) //Creating a Date() with this information
			selectedDatesArray = Session.get('selectedDates') 
			selectedDatesArray[0] = date; //Replacing the first value in the selctedDatesArray with this value (first value will always be arrival date)
			Session.set('selectedDates', selectedDatesArray)

			console.log("Selected date: " + selectedDay + "/" + selectedMonth + "/" + selectedYear) //printing for visual analysis only
			//for compatibility
			Session.set('selectedDate', date)
		}

		if (isSelectable == true && Session.get('currentlyFindingArr') == true) { //If the calendar is in selectable mode, and we're currently looking for an arr date
			//Check to see if this date can be selected
			var selectedDay = Number(this) //Converting object to number
			var unavailableDaysList = Session.get("unavailableDaysList")
			var bookedDay = getByValue(unavailableDaysList, selectedDay) //Checking to see if this date is available or unavailable
	
			if (isNaN(selectedDay) == false) { //Preventing placeholders from being selectable by checking for NaN value
				if (bookedDay == undefined ) { 
					//unavailableDaysList does not contain this date, it is available and therefore selectable
					selectThisDay(selectedDay);
				}
				else if (bookedDay.arr == false && bookedDay.dep == true) {
					//This date is someone elses departure date, so it is selectable as an arrival date.
					selectThisDay(selectedDay);
				}
				else {
					//Error Message
					var message = 'This date is unavailable as an arrival date!'
					Session.set('errorState', true)
					Session.set('errorMessage', message)

					//reseting error state again to hide error message after 5 seconds
					setTimeout( function() {Session.set('errorState', false) }, 5000); 
					 
				}
			}
		}
	}
})






