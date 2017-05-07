import { Template } from 'meteor/templating';
import { ReactiveVar} from 'meteor/reactive-var';

function range(start, stop, step){ //Emulation of pythons .range() function
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
	Session.set('month', 4); //TODO: some how make this get the current month eventually
	Session.set('year', 2017); //TODO: some how make this the actual date

	Template.calendar.helpers({
		//calendar helper functions go here
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
			//if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
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
		}
	})





}