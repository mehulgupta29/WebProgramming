//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/8/2016


//Let's set up our object
var dateExport = {};


//daysUntil(someDate): Return the number of days between the current date and someDate.
dateExport.daysUtil = function (someDate){

	try{
		var startDate = new Date(someDate);
		var currDate = new Date();
		if(startDate == NaN || startDate == null || startDate == undefined || !(startDate instanceof Date) || startDate == 'Invalid Date') {
			throw '';
		}else if (startDate < currDate){
			throw ': Start date should be after current date'
		}
		var daysUtil = Math.abs(currDate.getTime() - startDate.getTime());
		return daysUtil/24/60/60/1000;
	}catch(e){
		throw "Invalid Date input "+e;
	}

};
//console.log(daysUtil("Sat Feb 06 2015 11:17:17 GMT-0500"));

//daysLeftInYear(): Return the number of days left in the year
dateExport.daysLeftInYear = function (){
	try{
		var currDate = new Date();

		var endDate = new Date(currDate.getFullYear(), 11, 31, 23, 59, 59);

		var daysUtil = Math.abs(currDate.getTime() - endDate.getTime());
		return daysUtil/24/60/60/1000;
	}catch(e){
		throw "Invalid Date input";
	}

};
//console.log(daysLeftInYear());

//daysSince(someDate): Return the number of days that have passed since someDate.
dateExport.daysSince = function (someDate){
	try{
		var startDate = new Date(someDate);
		var currDate = new Date();
		if(startDate == NaN || startDate == null || startDate == undefined || !(startDate instanceof Date) || startDate == 'Invalid Date') {
			throw ' ';
		}else if (startDate > currDate){
			throw ': Start date should be before current date'
		}
		return (Math.abs(currDate.getTime() - startDate.getTime()))/24/60/60/1000;
	}catch(e){
		throw "Invalid Date input"+e;
	}
};
//console.log(daysSince("Sat Feb 06 2016 11:17:17 GMT-0500"));

//nextFridayTheThirteenth(): Return the next date that is both a Friday and the 13th.
dateExport.nextFridayTheThirteenth = function (){
	try{	
		var today = new Date();	//current date

		var nextFridayThirteenth = new Date();	//Date var to find nextFridayTheThirteenth
		var nextDay = today.getDay(), nextDate=today.getDate();
	
		today=today.getTime();

		while(nextDay != 5 || nextDate != 13){	//Loop ends when nextDay is Friday and nextDate is 13
		
			nextFridayThirteenth.setTime(today);
			nextDay = nextFridayThirteenth.getDay();
			nextDate = nextFridayThirteenth.getDate();
		
			today = today+86400000;	//Incrementing today with value equal to 1 day in millisec
		}
		return nextFridayThirteenth;
	}catch(e){
		throw "Invalid Date input: "+e;
	}
};
//console.log(nextFridayTheThirteenth());

//We then set this to be our Export
module.exports = dateExport;