let mongoose = require('mongoose');
let Todo = require('../models/todo');

function postTodo(req, res) {
    const todo = new Todo(req.body);
    let validation = todo.validateSync();
    let query = todo.save(todo, (err, result) => {
        if(err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });

};

function getTodoWithId(req, res) {
    Todo.findById(req.params.id, (err, todo) => {
        if(err) {
            res.send(err)
        } else if(todo === null){
            res.status(400);
            res.json({error: `Item with id $(req.params.id.toString()) does not exist`});
        } else {
            res.json(todo);
        }

    });
};

function getTodo(req, res) {
    let query = Todo.find({});
    query.exec((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
};

function putTodo(req, res) {
    Todo.findById({_id: req.params.id}, (err, todo) => {
        if(err) {
            res.send(err)
        } else if (todo === null){
            res.status(400);
            res.json({error: `Item with id $(req.params.id.toString()) does not exist`});
        } else {
            Object.assign(todo, req.body)
            todo.save((err, todo) => {
                if(err) {
                    res.send(err);
                } else {
                    res.json({ message: 'Todo updated!', todo });
                }

            });
        }

    });
};

function deleteTodo(req, res) {
    Todo.deleteOne({_id : req.params.id}, (err, result) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json({ message: "Todo successfully deleted!", result });
        }

    });

};



module.exports = {deleteTodo, putTodo, getTodo, getTodoWithId, postTodo};
