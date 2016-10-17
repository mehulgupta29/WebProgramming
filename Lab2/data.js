
//CS546 A - Lab 2
//Author - Mehul Gupta
//Date - 05/02/2016


var exports = {};

//UserException Message
function UserException(message){
	this.message = message;
}


//Calculate your Retirement Amount if saving per month.
exports.retirementAmountIfSavingPerMonth = function (yearsUntilRetirement, amountSavingPerMonth, yearlyInterestRateOfInvestment){
	
	try{
		var yearsUntilRetirement = parseInt(yearsUntilRetirement);
		var amountSavingPerMonth = parseInt(amountSavingPerMonth);
		var yearlyInterestRateOfInvestment = parseFloat(yearlyInterestRateOfInvestment);
		
		//condition to check failure test cases
		if(yearsUntilRetirement < 0 || amountSavingPerMonth < 0 || yearlyInterestRateOfInvestment < 0){
			throw new UserException("Invalid Input: values should be positive");
			
		}else if(typeof yearsUntilRetirement !== 'number' || typeof amountSavingPerMonth !== 'number' || typeof yearlyInterestRateOfInvestment !== 'number'){
			throw new UserException("Invalid Input: values should be of type number");
			
		}else if(isNaN(yearsUntilRetirement) || isNaN(amountSavingPerMonth) || isNaN(yearlyInterestRateOfInvestment)){
			throw new UserException("Invalid Input: values should be of type number");

		}else{
			var runningTotal = 0;
			//Loop to calculate the running total for the total number of months
			for(var i=0; i < (yearsUntilRetirement*12); i++){
				//calculate the total per month
				runningTotal = (runningTotal + amountSavingPerMonth) * (1 + yearlyInterestRateOfInvestment / 12);
			}
			return {status: "success", result: runningTotal};
		}
	}catch(e){
		return {status: "error",  message: e.message};
	}
};


//Calculate the total invested amount value after some years
exports.investedAmountAfterSomeYears = function (yearsInvesting, initialAmount, yearlyInterestRateOfInvestment){

	try{

		var yearsInvesting = parseInt(yearsInvesting);
		var initialAmount = parseInt(initialAmount);
		var yearlyInterestRateOfInvestment = parseFloat(yearlyInterestRateOfInvestment);

		//condition to check failure test cases
		if(yearsInvesting < 0 || initialAmount < 0 || yearlyInterestRateOfInvestment < 0){
			throw new UserException("Invalid Input: values should be positive");
			
		}else if(typeof yearsInvesting !== 'number' || typeof initialAmount !== 'number' || typeof yearlyInterestRateOfInvestment !== 'number'){
			throw new UserException("Invalid Input: values should be of type number1");
			
		}else if(isNaN(yearsInvesting) || isNaN(initialAmount) || isNaN(yearlyInterestRateOfInvestment)){
			throw new UserException("Invalid Input: values should be of type number");

		}else{
			var runningTotal = initialAmount;
			//Loop to calculate the running total for the total number of years
			for(var i=0; i < yearsInvesting; i++){
				//calculate the total per year
				runningTotal = runningTotal * (1 + yearlyInterestRateOfInvestment);
			}
			return {status: "success", result: runningTotal};
		}
	}catch(e){
		return {status: "error",  message: e.message};
	}
};


//Calculate the number of months required to pay the loan for a specific monthly payment amount
exports.monthsToPayOffLoan = function (monthlyPaymentAmount, initialLoanAmount, yearlyInterestRateOfLoan){
	
	try{
		var monthlyPaymentAmount = parseFloat(monthlyPaymentAmount);
		var initialLoanAmount = parseFloat(initialLoanAmount);
		var yearlyInterestRateOfLoan = parseFloat(yearlyInterestRateOfLoan);

		//condition to check failure test cases
		if(monthlyPaymentAmount < 0 || initialLoanAmount < 0 || yearlyInterestRateOfLoan < 0){
			throw new UserException("Invalid Input: values should be positive");
			//throw "Invalid Input";
			
		}else if(typeof monthlyPaymentAmount !== 'number' || typeof initialLoanAmount !== 'number' || typeof yearlyInterestRateOfLoan !== 'number'){
			throw new UserException("Invalid Input: values should be of type number");
			
		}else if(isNaN(monthlyPaymentAmount) || isNaN(initialLoanAmount) || isNaN(yearlyInterestRateOfLoan)){
			throw new UserException("Invalid Input: values should be of type number");
			
		}else{
			var month = 0;	//counter to count the number of months required
			var runningTotal = initialLoanAmount;	//variable to keep track of the loan amount+interest

			//Loop till the loan amount is greater than 0
			do{
				//calculate the reamining loan amount after paying the monthly payment amount
				runningTotal = runningTotal * (1 + yearlyInterestRateOfLoan / 12) - monthlyPaymentAmount;
				month = month +1;
			}while(runningTotal > 0);
		}
		return {status: "success", result: month};

	}catch(e){
		return {status: "error", message: e.message};
	}
};

// We then set this to be our export
module.exports = exports;