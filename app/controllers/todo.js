let mongoose = require('mongoose');
let Todo = require('../models/todo');

function postTodo(req, res) {
    var jsonResponse = {};
    //// TODO: Check that the given categories are actual categories
    const todo = new Todo(req.body);
    // TODO: Do something with this validation. And do it across all endpoints?
    // let validation = todo.validateSync();
    let query = todo.save(todo, (err, result) => {
        if(err) {
            console.log(err);
            jsonResponse.message = "Failed to create Todo";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.todo = null;
            res.status(400)
        } else {
            jsonResponse.message = "Created Todo!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.todo = result;
        }
        res.json(jsonResponse);
    });

};

function getTodoWithId(req, res) {
    let id = req.params.id;
    Todo.findById(id, (err, result) => {
        var jsonResponse = {
            message: "Failed to find Todo",
            success: false,
            error: "",
            todo: null
        };
        if(err) {
            console.log(err);
            jsonResponse.error = err.message;
            res.status(400)
        } else if(result === null){
            jsonResponse.error = "Item with id " + id.toString() + " does not exist";
            res.status(400);
        } else {
            jsonResponse.message = "Found Todo!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.todo = result;
        }
        res.json(jsonResponse);
    });
};

function getTodo(req, res) {
    let completed = req.query.completed || false
    var jsonResponse = {};
    let query = Todo.find({completed: completed});
    query.exec((err, result) => {
        if (err) {
            console.log(err);
            jsonResponse.message = "Failed to find Todos";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.todos = null;
            res.status(400)
        } else {
            jsonResponse.message = "Found Todos!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.todos = result;
        }
        res.json(jsonResponse);
    });
};

function putTodo(req, res) {
    let id = req.params.id
    Todo.findById({_id: id}, (err, todo) => {
        var jsonResponse = {
            message: "Failed to find Todo",
            success: false,
            error: "",
            todo: null
        };
        if(err) {
            console.log(err);
            jsonResponse.error = err.message;
            res.status(400).json(jsonResponse);
        } else if (todo === null){
            jsonResponse.error = "Item with id " + id.toString() + " does not exist"
            res.status(400).json(jsonResponse);
        } else {
            Object.assign(todo, req.body)
            todo.save((err, result) => {
                if(err) {
                    console.log(err);
                    jsonResponse.error = err.message;
                    res.status(400);
                } else {
                    jsonResponse.message = "Todo Updated!";
                    jsonResponse.success = true;
                    jsonResponse.error = null;
                    jsonResponse.todo = result;
                }
                res.json(jsonResponse);
            });
        }

    });
};

function completeTodo(req, res) {
    let id = req.params.id
    let now = Date()
    Todo.findById({_id: id}, (err, todo) => {
        var jsonResponse = {
            message: "Failed to find Todo",
            success: false,
            error: "",
            todo: null
        };
        if(err) {
            console.log(err);
            jsonResponse.error = err.message;
            res.status(400).json(jsonResponse);
        } else if (todo === null){
            jsonResponse.error = "Item with id " + id.toString() + " does not exist"
            res.status(400).json(jsonResponse);
        } else {
            todo.completed = true;
            todo.completedAt = now
            todo.save((err, result) => {
                if(err) {
                    console.log(err);
                    jsonResponse.error = err.message;
                    res.status(400);
                } else {
                    jsonResponse.message = "Todo Completed!";
                    jsonResponse.success = true;
                    jsonResponse.error = null;
                    jsonResponse.todo = result;
                }
                res.json(jsonResponse);
            });
        }

    });
}

function deleteTodo(req, res) {
    var jsonResponse = {}
    Todo.deleteOne({_id : req.params.id}, (err, result) => {
        if (err) {
            console.log(err);
            jsonResponse.message = "Failed to Delete Todo";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            res.status(400)
        } else {
            jsonResponse.message = "Successfully Deleted Todo!";
            jsonResponse.success = true;
            jsonResponse.error = null;
        }
        jsonResponse.todo = null;
        res.json(jsonResponse);

    });

};

module.exports = {deleteTodo, putTodo, getTodo, getTodoWithId, postTodo, completeTodo};
