
//CS546 A - Lab 2
//Author - Mehul Gupta
//Date - 05/02/2016


// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var myData = require('./data.js');

// This package exports the function to create an express instance:
var app = express();

// This is called 'adding middleware', or things that will help parse your request
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Setup your routes here!

//Testing Exportz
//console.log(myData.retirementAmountIfSavingPerMonth(2, 100, 0.1));



app.get("/api/perMonthRetirementSavings", function (request, response) {

	var years = request.query.years;
	var perMonth = request.query.perMonth;
	var interestRate = request.query.interestRate;

	var res = myData.retirementAmountIfSavingPerMonth(years, perMonth, interestRate);
	if(res.status == "success"){
		response.json(res);
	}else{
		response.status(500).json(res);
	}
	
	
});


app.get("/api/investedAmount", function(request, response){
	var years = request.query.years;
	var initial = request.query.initial;
	var interestRate = request.query.interestRate;

	var res = myData.investedAmountAfterSomeYears(years, initial, interestRate);
	if(res.status == "success"){
		response.json(res);
	}else{
		response.status(500).json(res);
	}
});


app.get("/api/loanPayoff", function(request, response){
	var monthlyAmount = request.query.monthlyAmount;
	var loanAmount = request.query.loanAmount;
	var interestRate = request.query.interestRate;

	var res = myData.monthsToPayOffLoan(monthlyAmount, loanAmount, interestRate);
	if(res.status == "success"){
		response.json(res);
	}else{
		response.status(500).json(res);
	}
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
