//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/10/2016


var strModule = require("./string.js"),
numberModule = require("./numbers.js"),
objectModule = require("./objects.js"),
arrayModule = require("./arrays.js"),
dateModule = require("./dates.js");

console.log("All modules have loaded!");

try{
	//String Module
	console.log('\nStart - String Module \n');
	
		console.log("Occurrences Of Substring: "+strModule.occurrencesOfSubstring("Hello! My name is Mehul Gupta. I Is am a computer science iS major at Stevens instituTe of Technology. is hello", "Hello"));
		console.log("Occurrences Of Substring Insensitive: "+strModule.occurrencesOfSubstringInsensitive("My name is mehul  Mehul  MEHUL  mEhul  meHul mEHUl Gupta", "mehul"));
		console.log("Randomize Sentences: Testing Strings as input =  "+strModule.randomizeSentences("jan\\feb/march!april.may/*-+.june"));
		console.log("Randomize Sentences: Testing Strings as input =  "+strModule.randomizeSentences("jan\\feb/march!april.may/*-+.june"));
		console.log("Randomize Sentences: Testing String with Date as input = "+strModule.randomizeSentences("Todays date = "+new Date()+".Enjoy"));
	
		//console.log("Randomize Sentences: Testing Objects as inputs = "+strModule.randomizeSentences({name:'mehul', course:'CS546', courseName:'Web programming'}));
		
	console.log('\nEnd - String Module \n');

	//Numbers Module
	console.log('\nStart - Numbers Module \n');

		console.log("Triangle Area = "+numberModule.triangleArea(2, 2));
		console.log("Perimeter of Triangle = "+numberModule.perimeterOfTriangle(2,1,2));
		console.log("Area of square = "+numberModule.areaOfSquare(2));
		console.log("Perimeter of Square = "+numberModule.perimeterOfSquare(2));
		console.log("Area(volume) of Cube = "+numberModule.areaOfCube(2));
		console.log("Surface Area of Cube = "+numberModule.surfaceAreaOfCube(2));
		console.log("Perimeter of Cube = "+numberModule.perimeterOfCube(2));
		console.log("Circumference Of Circle = "+numberModule.circumferenceOfCircle(2));
		console.log("Area of Circle = "+numberModule.areaOfCircle(2));


	console.log('\nEnd - Numbers Module \n');

	//Objects Module
	console.log('\nStart - Objects Module \n');

		//shallow clone
		var a = {foo: 'fooValue', 
		bar: 'bar', 
		mac: {name:'name', 
				phone:'phonenumber', 
				addr:'address'}
		};

		console.log("Shallow clone");
		var b = objectModule.shallowClone(a);
		//b.foo = 'ooooooooooo';
		//b.mac.add = '3490 jfk';
		//console.log(a);
		console.log(b);
		//console.log(typeof a);
		//console.log(typeof b);
		//console.log(a.mac === b.mac);
		//console.log(a.mac == b.mac);
	

		//Deep Clone
		console.log("\nDeep Clone");
		function Circ(){		//Testing for Circular properties : JSON.parse(JSON.stringify(obj)) will fail for this case
			this.me = this;
		}
		function Nested(y){		//Testing for Nested properties : Object.create() will fail for this case
			this.y = y;
		}
		var a = {x: 'abcd',														//property
		circ: new Circ(),												//circular property
		nested: new Nested('abcd'),										//nested property
		mac: {name: {fName: 'FirstName',								//sub - sub* object / nested objects
					mName: 'MiddleName',
					lName: 'LastName'},
 			 phone:'phonenumber', 
 			 addr:'address'},
 		d: new Date(),													//date property: Recursive solution will fail for this case
 		arr: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul']};		//array property

		var b = objectModule.deepClone(a);
		//console.log(a);
		console.log(b);


	console.log('\nEnd - Objects Module \n');

	//Arrays Module
	console.log('\nStart - Arrays Module \n');

		console.log("Shallow Clone Array = "+ arrayModule.shallowClone(['jan' , 'feb', 'mar', 'apr', 'may']));
		console.log("Randomized Shallow Array = "+ arrayModule.randomized(['jan' , 'feb', 'mar', 'apr', 'may']));

	console.log('\nEnd - Arrays Module \n');

	//Dates Module
	console.log('\nStart - Dates Module \n');

		console.log("Days Until = "+ dateModule.daysUtil("Sun Mar 27 2016 11:17:17 GMT-0500"));
		console.log("Days left in year = "+ dateModule.daysLeftInYear());
		console.log("Days Since = "+ dateModule.daysSince("Sat Feb 06 2016 11:17:17 GMT-0500"));
		console.log("Next Friday The Thirteenth = "+ dateModule.nextFridayTheThirteenth());

	console.log('\nEnd - Dates Module \n');
}catch(e){
	console.log(e);
}