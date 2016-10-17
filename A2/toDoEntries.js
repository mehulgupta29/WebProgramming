//toDoEntries.js

var exports = module.exports = {};

var _id = 0;
var toDoList = [];

function makeAToDoEntry(author, taskTitle, taskDescription){
	
	/*if(typeof author == 'string' || !author || typeof taskTitle == 'string' || !taskTitle || typeof taskDescription == 'string' || !taskDescription) 
		throw {code:500, error:'You must provide valid information in the request body to create a entry.'};
	*/
	return {
		id:_id++,
		author:author,
		taskTitle:taskTitle,
		taskDescription:taskDescription,
		taskNotes:[],
		status:'open'
	};
}


exports.fetchAllToDos = function(){
	return toDoList;
};


exports.fetchAllToDosOpen = function(){
	 return toDoList.filter(function (todo) {
        return todo.status == 'open';
    });
};

exports.fetchAllToDosCompleted = function(){
	return toDoList.filter(function (todo) {
        return todo.status == 'completed';
    });
};


exports.getToDo = function(id){
	if (typeof id === "string") id = parseInt(id);

    if (id !== 0 && !id) throw {code:404, error:'Please enter id'};

    var todo = toDoList.filter(function (todo) {
        return todo.id === id;
    }).shift();

    if (!todo) throw {code:404, error:'An entry with the id of '+id+' could not be found'};

    return todo;
};


//POST/api/todo
exports.persistToDo = function(author, taskTitle, taskDescription){

	if(typeof author !== 'string' || !author || typeof taskTitle !== 'string' || !taskTitle || typeof taskDescription !== 'string' || !taskDescription) 
	{
		throw {code:500, error:'You must provide valid information in the request body to create a entry.'};
	}

	var todo =  makeAToDoEntry(author, taskTitle, taskDescription);
	toDoList.push(todo);
	return todo;
};


//PUT/api/todo/:id
exports.updateToDo = function(id, taskTitle, taskDescription, status){
    
	if(taskTitle || taskDescription || status){
		if(typeof status === "string" || typeof taskTitle === "string" || typeof taskDescription === "string"){
			var todo = exports.getToDo(id);

			if(taskTitle){
				todo.taskTitle = taskTitle;
			}
			if(taskDescription){
				todo.taskDescription = taskDescription;
			}	
			if(status){
				if((status === 'open' || status === 'completed')){
					todo.status = status;
				}else{
					throw {code:500, error:"You must provide valid information in the request body to create an entry"};
				}
			}

		}else{
			throw {code:500, error:"You must provide valid information in the request body to create an entry"};
		}
	}else{
		throw {code:500, error:"You must provide valid information in the request body to create an entry"};
	}

    return todo;
};

//POST/api/todo/:id/notes
exports.addNotes = function(id, notes){
	if(typeof id === "string") id = parseInt(id);

	if(id !== 0 && !id) throw "Must provide ID";

	if(typeof notes !== "string" || !notes || notes == "" || notes.length === 0) 
		throw {code:500, error:"You must provide valid information in the request body to create an entry"};


    var todo = exports.getToDo(id);

    if(notes)todo.taskNotes.push(notes);

    return todo;
};

//DELETE/api/todo/:id
exports.deleteToDo = function(id){
	var todo = exports.getToDo(id);

    var indexOfTodo = toDoList.indexOf(todo);
    // remove the todo
    var removed = toDoList.splice(indexOfTodo, 1);

    return {success: true};
};


var firstEntry = makeAToDoEntry('Mehul','My first todo','My todo description');
toDoList.push(firstEntry);
var secondEntry = makeAToDoEntry('Gupta','My first todo','My todo description');
secondEntry.status = 'completed';
toDoList.push(secondEntry);

