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
			listOfDays = []
			var bookedDatesCursor = bookedDates.find({month: Session.get('month'), year: Session.get('year') })
			bookedDatesCursor.forEach( function(doc) {
				console.log(doc.day)
				listOfDays.push(doc.day)
			})
			Session.set("unavailableDaysList", listOfDays)
			console.log("done adding items to array, printing array")
			console.log(Session.get('unavailableDaysList'))
		},

		'availability': function(){
			var thisDay = Number(this)
			var unavailableDaysList = Session.get("unavailableDaysList")
			//console.log(unavailableDaysList)

			if (unavailableDaysList.indexOf(thisDay) != -1){ //If the array contains this date, its unavailable.
				//console.log("unavailable!")
				return "unavailable" //This is css reference
			}
			else {/*console.log("available!")*/}
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