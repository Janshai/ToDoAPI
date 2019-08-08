let mongoose = require('mongoose');
let Todo = require('../models/todo');

function postTodo(req, res) {
    var jsonResponse = {};
    const todo = new Todo(req.body);
    let validation = todo.validateSync();
    let query = todo.save(todo, (err, result) => {
        if(err) {
            console.log(err);
            jsonResponse.message("Failed to create Todo");
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.todo = null;
            res.status(400)
        } else {
            jsonResponse.message("Created Todo!");
            jsonResponse.success = true;
            jsonResponse.error = err.message;
            jsonResponse.todo = result;
        }
        res.json(jsonResponse);
    });

};

function getTodoWithId(req, res) {
    Todo.findById(req.params.id, (err, result) => {
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
        } else if(todo === null){
            jsonResponse.error = "Item with id $(req.params.id.toString()) does not exist";
            res.status(400);
        } else {
            jsonResponse.message = "Found Todo!";
            jsonResponse.success = true;
            jsonResponse.error = "Item with id $(req.params.id.toString()) does not exist";
            jsonResponse.todo = result;
        }
        res.json(jsonResponse);
    });
};

function getTodo(req, res) {
    var jsonResponse = {};
    let query = Todo.find({});
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
    Todo.findById({_id: req.params.id}, (err, todo) => {
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
            jsonResponse.error = "Item with id $(req.params.id.toString()) does not exist"
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

module.exports = {deleteTodo, putTodo, getTodo, getTodoWithId, postTodo};
