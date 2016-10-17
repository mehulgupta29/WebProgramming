//CS546 A - Lab 1
//Author - Mehul Gupta

//Calculate your Retirement Amount if saving per month.
function retirementAmountIfSavingPerMonth(yearsUntilRetirement, amountSavingPerMonth, yearlyInterestRateOfInvestment){
	
	//condition to check failure test cases
	if(yearsUntilRetirement < 0 || amountSavingPerMonth < 0 || yearlyInterestRateOfInvestment < 0){
		return -1;
	}else if(typeof yearsUntilRetirement !== 'number' || typeof amountSavingPerMonth !== 'number' || typeof yearlyInterestRateOfInvestment !== 'number'){
		return -1;
	}else{
		var runningTotal = 0;
		//Loop to calculate the running total for the total number of months
		for(var i=0; i < (yearsUntilRetirement*12); i++){
			//calculate the total per month
			runningTotal = (runningTotal + amountSavingPerMonth) * (1 + yearlyInterestRateOfInvestment / 12);
		}
		return runningTotal;
	}
}


//Calculate the total invested amount value after some years
function investedAmountAfterSomeYears(yearsInvesting, initialAmount, yearlyInterestRateOfInvestment){

	//condition to check failure test cases
	if(yearsInvesting < 0 || initialAmount < 0 || yearlyInterestRateOfInvestment < 0){
		return -1;
	}else if(typeof yearsInvesting !== 'number' || typeof initialAmount !== 'number' || typeof yearlyInterestRateOfInvestment !== 'number'){
		return -1;
	}else{
		var runningTotal = initialAmount;
		//Loop to calculate the running total for the total number of years
		for(var i=0; i < yearsInvesting; i++){
			//calculate the total per year
			runningTotal = runningTotal * (1 + yearlyInterestRateOfInvestment);
		}
		return runningTotal;
	}
}


//Calculate the number of months required to pay the loan for a specific monthly payment amount
function monthsToPayOffLoan(monthlyPaymentAmount, initialLoanAmount, yearlyInterestRateOfLoan){
	
	//condition to check failure test cases
	if(monthlyPaymentAmount < 0 || initialLoanAmount < 0 || yearlyInterestRateOfLoan < 0){
		return -1;
	}else if(typeof monthlyPaymentAmount !== 'number' || typeof initialLoanAmount !== 'number' || typeof yearlyInterestRateOfLoan !== 'number'){
		return -1;
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
	return month;
}


//Test Cases
console.log("Retirement Amount If Saving Per Month= "+ retirementAmountIfSavingPerMonth(2, 100, 0.1)); 
console.log("Invested Amount After Some Years= "+investedAmountAfterSomeYears(2, 5000, 0.1));
console.log("Months To PayOff Loan= "+monthsToPayOffLoan(300, 25000, 0.08) +" months");


//ignore this - CANCELLED QUESTION - this question was present in the original LAB-1
//Calculate the amount to be paid per month for given number of years to repay the loan amount+interest.
function amountNeededToPayOffLoanInMonths(yearsDesired, loanAmount, yearlyInterestRateOfLoan){

if(yearsDesired < 0 || loanAmount < 0 || yearlyInterestRateOfLoan < 0){
		return -1;
	}else if(typeof yearsDesired !== 'number' || typeof loanAmount !== 'number' || typeof yearlyInterestRateOfLoan !== 'number'){
		return -1;
	}else{
		var runningTotal = loanAmount;
		for(var i=0; i < (yearsDesired*12); i++){
			runningTotal = runningTotal*(1+yearlyInterestRateOfLoan/12);
		}
		return runningTotal/(yearsDesired*12);
	}
}
//Test case
//console.log("CANCELLED Function : amount Needed To Pay Off Loan In Months= "+amountNeededToPayOffLoanInMonths(1, 1000, 0.1));

