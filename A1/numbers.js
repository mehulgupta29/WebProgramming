//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/8/2016

// let's Set up an object
var numberExport = {};


//triangleArea(base, height): Return the area of a triangle
numberExport.triangleArea = function (base, height){
	if(base <= 0 || height <= 0 || typeof base != 'number' || typeof height != 'number'){
		throw "Invalid Input: Values should be Positive Number";
	}else if(Math.sign(base) == -1 || Math.sign(base) == NaN || Math.sign(base) == 0){
		throw "Invalid Input: Values should be Positive Number";
	}else if(Math.sign(height) == -1 || Math.sign(height) == NaN || Math.sign(height) == 0){
		throw "Invalid Input: Values should be Positive Number";
	}else if(Number.MAX_VALUE <= base || Number.MAX_VALUE <= height){
		throw "Invalid Input: Number Too Long!!";
	}else {
		return (base * height)/2;
	}
};
//Test Case
//console.log(triangleArea(1, 2));


//perimeterOfTriangle(side1, side2, side3); Return the perimeter of the triangle given 3 sides
numberExport.perimeterOfTriangle = function (side1, side2, side3 ){
	if(side1 <= 0 || side2 <= 0 || side3 <= 0 || typeof side1 != "number" || typeof side2 != "number" || typeof side3 != "number" || side1.length <= 0 || side2.length <= 0 || side3.length <= 0){
		throw "Invalid Input: Values should be Positive Number";

	}else if(Math.sign(side1) == -1 || Math.sign(side1) == NaN || Math.sign(side1) == 0){
		throw "Invalid Input side1: Values should be Positive Number";
		
	}else if(Math.sign(side2) == -1 || Math.sign(side2) == NaN || Math.sign(side2) == 0){
		throw "Invalid Input side2: Values should be Positive Number";
		
	}else if(Math.sign(side3) == -1 || Math.sign(side3) == NaN || Math.sign(side3) == 0){
		throw "Invalid Input side3: Values should be Positive Number";
		
	}else if(side1+side2 <= side3 || side2+side3 <= side1 || side1+side3 <= side2){
		throw "Invalid Input: Make sure a+b>c";
		
	}else if(Number.MAX_VALUE <= side1 || Number.MAX_VALUE <= side2 || Number.MAX_VALUE <= side3){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return side1+side2+side3;
	}
};
//Test Cases
//console.log(perimeterOfTriangle(0,1,2));
//console.log(perimeterOfTriangle(1,-1,1));
//console.log(perimeterOfTriangle(1,1,"Mehul"));
//console.log(perimeterOfTriangle(1,2,3));
//console.log(perimeterOfTriangle(1,0.99,0.1));


//areaOfSquare(side); Return the area of a square given the length of one side
numberExport.areaOfSquare = function (side){
	if(side <= 0 || typeof side !== "number" || Math.sign(side) == NaN ||side.length <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= side){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return side*side;
	}
};
//Test Cases
//console.log(areaOfSquare(-2)); //Failure case
//console.log(areaOfSquare("")); //Failure case
//console.log(areaOfSquare('meul')); //Failure case
//console.log(areaOfSquare(2));	//success case


//perimeterOfSquare(side); Return the perimeter of a square given one square.
numberExport.perimeterOfSquare = function (side){
	if(side <= 0 || typeof side !== "number" || Math.sign(side) == NaN || side.length <= 0){
		throw "Invalid Input: Values should be Positive Number";

	}else if(Number.MAX_VALUE <= side){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return 4*side;
	}
};
//Test Cases
//console.log(perimeterOfSquare(-2)); //Failure case
//console.log(perimeterOfSquare("")); //Failure case
//console.log(perimeterOfSquare('meul')); //Failure case
//console.log(perimeterOfSquare(2));	//success case


//areaOfCube(side); Return the volume of a cube, given one side
numberExport.areaOfCube = function (side){
	if(side <= 0 || typeof side !== "number" || Math.sign(side) == NaN || side.length <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= side){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return side*side*side;
	}
};
//Test Cases
//console.log(areaOfCube(-2)); //Failure case
//console.log(areaOfCube("")); //Failure case
//console.log(areaOfCube('meul')); //Failure case
//console.log(areaOfCube(2));	//success case



//surfaceAreaOfCube(side); Return the surface area of a cube, given one side.
numberExport.surfaceAreaOfCube = function (side){
	if(side <= 0 || typeof side !== "number" || Math.sign(side) == NaN || side.length <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= side){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return 6*side*side;
	}
};
//Test Cases
//console.log(surfaceAreaOfCube(-2)); //Failure case
//console.log(surfaceAreaOfCube("")); //Failure case
//console.log(surfaceAreaOfCube('meul')); //Failure case
//console.log(surfaceAreaOfCube(2));	//success case


//perimeterOfCube(side): Return the permiter of a cube, given one side
numberExport.perimeterOfCube = function (side){
	if(side <= 0 || typeof side !== "number" || Math.sign(side) == NaN  || side.length <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= side){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return 12*side;
	}	
};
//Test Cases
//console.log(perimeterOfCube(-2)); //Failure case
//console.log(perimeterOfCube("")); //Failure case
//console.log(perimeterOfCube('meul')); //Failure case
//console.log(perimeterOfCube(2));	//success case


//circumferenceOfCircle(radius): Return the circumference of a circle given a radius
numberExport.circumferenceOfCircle = function (radius){
	if(radius <= 0 || typeof radius !== "number" || Math.sign(radius) == NaN || radius.length <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= radius){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return 2*Math.PI*radius;
	}	
};
//Test Cases
//console.log(circumferenceOfCircle(-2)); //Failure case
//console.log(circumferenceOfCircle("")); //Failure case
//console.log(circumferenceOfCircle('meul')); //Failure case
//console.log(circumferenceOfCircle(2));	//success case


//areaOfCircle(radius): Return the area of a circle given the radius.
numberExport.areaOfCircle = function (radius){
	if(radius <= 0 || typeof radius !== "number" || Math.sign(radius) == NaN || radius <= 0){
		throw "Invalid Input: Values should be Positive Number";
		
	}else if(Number.MAX_VALUE <= radius){
		throw "Invalid Input: Number Too Long!!";
		
	}else{
		return Math.PI*radius*radius;
	}	
};
//Test Cases
//console.log(areaOfCircle(-2)); //Failure case
//console.log(areaOfCircle("")); //Failure case
//console.log(areaOfCircle('meul')); //Failure case
//console.log(areaOfCircle(2));	//success case


//We then set this to be our Export
module.exports = numberExport;