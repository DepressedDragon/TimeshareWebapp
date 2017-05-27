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

class Day {
	constructor(day, arr, dep) {
		this.day = day
		this.arr = arr
		this.dep = dep
	}
} 


//Code runs on client only
if (Meteor.isClient == true){

	var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	Session.set('month', 2); //TODO: some how make this get the current month eventually
	Session.set('year', 2017); //TODO: some how make this the actual date


	Template.calendar.helpers({
		//calendar helper functions go here

		//Not needed as of now, functions as intended without. May be needed in the future.
		/*'ready': function(){  
	        return Template.instance().subscriptionsReady();
	    }, */ 

		'month': function(){
			var month = Session.get('month')
			return Months[month]
		},
		'year': function(){
			var year = Session.get('year')
			return year;
		},
		'numOfDays': function(){
			var month = Session.get('month')
			var numOfDays;
			if (month == 3 || month == 5 || month == 8 || month == 10){
				numOfDays = 30
			}
			else if (month == 1){ //February calculation
				var year = Session.get('year')
				if (year % 100 == 0 && year % 400 == 0){numOfDays = 29} //century leap year
				else if (year % 4 == 0){numOfDays = 29} //regular leap year
				else{numOfDays = 28}
			} 
			else{
				numOfDays = 31
			}

			totalDays = range(1, numOfDays + 1) 
			return totalDays;
		},

		'highlightSelectedDate': function(){ //This function is run every time there is a session change, and run individually for each day in the each block
			var selectedDay = Session.get('selectedDay')		
			var selectedMonth = Session.get('selectedMonth')
			var selectedYear = Session.get('selectedYear')

			var thisDay = this //'this' refers to each respective day in the month which is being cycled in the each loop
			var thisMonth = Session.get('month')
			var thisYear = Session.get('year')
			
			if (thisDay == selectedDay && thisMonth == selectedMonth && thisYear == selectedYear) { //if the current session date is the same as selected, then highlight
			return "active" //This is a css class reference for styling to make the date look selected.
			} 
		},
		
		'getUnavailableDates': function(){
			listOfDayObjects = []
			count = 0
			
			var bookedDatesCursor = bookedDates.find({month: Session.get('month'), year: Session.get('year') }) //Retrieve all days with this 'month' and this 'year'
			bookedDatesCursor.forEach( function(doc) {    //Looping over cursor and placing each day in the array
				console.log(doc.day)
				listOfDayObjects[count] = new Day(doc.day, doc.arr, doc.dep) //Creating a new day objects and storing in array
				count += 1
			})
			Session.set("unavailableDaysList", listOfDayObjects)
			console.log("done adding items to array, printing array")
			console.log(Session.get('unavailableDaysList'))

			//In the forEach block, running each 'day' through class factory to give it the .arr or .dep boolean values.

		},

		'availability': function(){
			var thisDay = Number(this)
			var unavailableDaysList = Session.get("unavailableDaysList")
			//console.log(unavailableDaysList)
			
			//Searches an array for a specific object by an object property
			//Accepts an array of objects and an object property to search for, returns 1 object.
			function getByValue(arr, value) {
			  	for (var i=0, iLen=arr.length; i<iLen; i++) {
			    	if (arr[i].day == value) return arr[i];
			  	}
			}
			
			var bookedDay = getByValue(unavailableDaysList, thisDay)

			if (bookedDay != undefined) { //if this day is indeed booked (bookedDay will be undefined if its not booked and will not run)
	   			if (bookedDay.day == thisDay) { 

	   				if (bookedDay.arr == true) {
	   					return "arrUnavailable" //This is an arrival date!
	   				}
	   				else if (bookedDay.dep == true) {
	   					return "depUnavailable" //This is a departure date!
	   				} 
	   				else if (bookedDay.arr == true && bookedDay.dep == true) { 
	   					return "duelUnavailable"//This is both an arrival and departure date! Double booked! (either a dep and arr on same day by different people, or one person... TODO: figure out how to handle this)
	   				} 
	   				else { 
	   					return "regUnavailable" //This is a regular 'inbetween' booked Date
	   				} 
				}
				else {/*console.log("available!")*/}
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
			
			var selectedDay = Number(this) //Converting object to int
			var selectedMonth = Session.get('month')
			var selectedYear = Session.get('year')
			//Storing selected date information in session variables
			Session.set('selectedDay', selectedDay)
			Session.set('selectedMonth', selectedMonth)
			Session.set('selectedYear', selectedYear)

			console.log("Selected date: " + selectedDay + "/" + selectedMonth + "/" + selectedYear)
		}
	})





}