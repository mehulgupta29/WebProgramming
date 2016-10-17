//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/8/2016


//Let's set up our object
var arrayExport = {};


//shallowClone(baseArr): Given a base array, return a shallow copy of that array.
arrayExport.shallowClone = function (baseArr){
	
	if(baseArr == null || baseArr.length <= 0){
		throw 'Invalid Input: Array cannot be null';
	}else if(! Array.isArray(baseArr)){
		throw 'Illegal Input: Input should be an Array';
	}else if(!(baseArr instanceof Array)){
		throw 'Illegal Input: Input should be an Array';
	}else{		
		return baseArr.slice();	
	}
	
};
//Test cases
//console.log(shallowClone(['jan' , 'feb', 'mar', 'apr', 'may']));

//randomized(baseArr): Given a base array, return a shallow copy of the array and return the elements in a randomized order.
arrayExport.randomized = function (baseArr){
	
	if(baseArr == null || baseArr.length <= 0){
		throw 'Invalid Input: Array cannot be null';
	}else if(! Array.isArray(baseArr)){
		throw 'Illegal Input: Input should be an Array';
	}else if(!(baseArr instanceof Array)){
		throw 'Illegal Input: Input should be an Array';
	}else{		
		var newArr = baseArr.slice();
		return newArr.sort(function(){
			return 0.5 - Math.random();
		});
	}	
};
//Test case
//console.log(arrayExport.randomized(['jan' , 'feb', 'mar', 'apr', 'may']));	//Success Test Case
//console.log(randomized({}));	//Fail Test Case


//We then set this to be our Export
module.exports = arrayExport;