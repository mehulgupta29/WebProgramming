//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/8/2016


// Let's setup an object
var stringExport = {};

//Count and return how many times a substring occurs in a main string. This function is case sensitive.
stringExport.occurrencesOfSubstring = function (main, substr){
	var i = main.indexOf(substr);
	var occurrences = 0;
	var j = 0;

	//Conditions for failure test cases
	if(main.length <= 0 || substr.length <= 0 || main.length < substr.length){
		throw "Invalid Input";
	}else if(i < 0){	//condition to check if there are zero occurences of the substring
			//console.log("There are "+occurrences+" of the substring= "+substr+" in the main string.");
			return 0;
	}else{
		occurrences++;	//Increment occurrences as the substring has atleast one occurrence in the main string.
		while(i <= main.length && i >= 0){
			i = main.indexOf(substr, i+1);
			if(i>=0){
				occurrences++;
			}
		}
		return occurrences;
	}
}
//Test Case
//console.log(occurrencesOfSubstring("Hello! My name is Mehul Gupta. I Is am a computer science iS major at Stevens instituTe of Technology. is hello", "Hello"));


//occurrencesOfSubstringInsensitive
stringExport.occurrencesOfSubstringInsensitive = function (main, substr){
	var i, occurrences = 0, j=0;

	if(main.length <= 0 || substr.length <= 0){
		//console.log("Invalid Input");
		throw "Invalid Input";
	}else if( (i = main.search(new RegExp(substr, "i"))) < 0 ){
		//console.log("There are "+occurrences+" of the substring= "+substr+" in the main string.");
		return 0;
	}else{
		
		//occurrences++;
		while(i <= main.length && i >= 0){
			
			i = main.search(new RegExp(substr, "i"));
			main = main.substring(i+1);
			if(i >= 0){
				occurrences++;
			}
		}
		return occurrences;
	}
}
//Test case
//console.log(occurrencesOfSubstringInsensitive("My name is mehul  Mehul  MEHUL  mEhul  meHul mEHUl Gupta", "mehul"));


//randomizeSentences(paragraph); Given a string representing a paragraph, reorder the sentences. Return a new string representing a paragraph where the sentences are randomly ordered.
stringExport.randomizeSentences = function (paragraph){
	if(paragraph.length <= 0){
		throw "Invalid Input";
	}else if(typeof paragraph != 'string' ){
		throw "Invalid Input";
	}
	var sentences = paragraph.split(/\s*[!,.|\\/]/).sort(function(){
		return 0.5 - Math.random();
	});

	return sentences.join(',');
}
//Test Cases
//console.log(randomizeSentences("jan. feb. march. april. may"));

// We then set this to be our export
module.exports = stringExport;