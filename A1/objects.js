//CS 546 A - Assignment 1
//Author - Mehul Gupta
//Date - 2/8/2016


//Let's set up our object
var objectExport = {};

//shallowClone(baseObject): Return a 'shallow clone' of the baseObject A shallow clone is one where objects inside of the baseobject are just copied (think: copying 1 layer deep) rather than cloned
objectExport.shallowClone = function (baseObject){
	try{
        var newObj = {};
        for(var i in baseObject) {
            if(baseObject.hasOwnProperty(i)) {
                newObj[i] = baseObject[i];
            }
        }
        //console.log(newObj);
        return newObj;
    }catch(e){
        throw "Invalid Input "+e;
    }
};
/*
//Test Cases
var a = {foo: 'fooValue', 
		bar: 'bar', 
		mac: {name:'name', 
				phone:'phonenumber', 
				addr:'address'}
		};

var b = shallowClone(a);

b.foo = 'ooooooooooo';
b.mac.add = '3490 jfk';

console.log(a);
console.log(b);
console.log(typeof a);
console.log(typeof b);
console.log(a.mac === b.mac);
console.log(a.mac == b.mac);
*/

//deepClone(baseObject): Return a 'deep clone' of the baseObject. A deep clone is one where each object that you encounter nested in baseObject is also deeply cloned. For example, when cloning {foo: {bar: 2}} in a deep clone, you would create a new object to represent 'bar', as well (and any other sub-objects)
objectExport.deepClone = function (o){
try{
	const gdcc = "__getDeepCircularCopy__";
    if (o !== Object(o)) {
        return o; 							// primitive value
    }

    if (o instanceof Date) {	    		// Handle Date
        copy = new Date();
        copy.setTime(o.getTime());
        return copy;
    }

    var set = gdcc in o,
        cache = o[gdcc],
        result;
    if (set && typeof cache == "function") { //Handle Circular / Nested properties
        return cache();
    }

    // else
    o[gdcc] = function() { return result; }; // overwrite
    if (o instanceof Array) {				 //Handle Array
        result = [];
        for (var i=0; i<o.length; i++) {
            result[i] = objectExport.deepClone(o[i]);
        }
    } else {
        result = {};
        for (var prop in o)
            if (prop != gdcc)
                result[prop] = objectExport.deepClone(o[prop]);
            else if (set)
                result[prop] = objectExport.deepClone(cache);
    }
    if (set) {
        o[gdcc] = cache; // reset
    } else {
        delete o[gdcc]; // unset again
    }
    return result;
}catch(e){
    throw "Invalid Input "+ e;
}
};
//Test Cases

function Circ(){		//Testing for Circular properties : JSON.parse(JSON.stringify(obj)) will fail for this case
	this.me = this;
}
function Nested(y){		//Testing for Nested properties : Object.create() will fail for this case
	this.y = y;
}

//Test Object
/*var a = {x: 'abcd',														//property
		circ: new Circ(),												//circular property
		nested: new Nested('abcd'),										//nested property
		mac: {name: {fName: 'FirstName',								//sub - sub* object / nested objects
					mName: 'MiddleName',
					lName: 'LastName'},
 			 phone:'phonenumber', 
 			 addr:'address'},
 		d: new Date(),													//date property: Recursive solution will fail for this case
 		arr: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul']};		//array property

//var b = deepClone(a);

//console.log(a);
//console.log(b);
*/


//We then set this to be our Export
module.exports = objectExport;