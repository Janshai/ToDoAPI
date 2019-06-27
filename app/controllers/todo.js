let mongoose = require('mongoose');
let Todo = require('../models/todo');

function postTodo(req, res) {
    console.log(req.body);
    const todo = new Todo(req.body);
    let query = todo.save(todo, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });

};

function getTodoWithId(req, res) {
    Todo.findById(req.params.id, (err, todo) => {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(todo);
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
    // const id = req.params.id;
    // const details = {'_id': new ObjectID(id)};
    // var todo = null;
    // db.collection('todos').findOne(details, (err, item) => {
    //     if(err) {
    //         res.send(err);
    //     } else {
    //         todo = item;
    //     }
    //
    //     for (var itemsFromBodyIndex in req.body) {
    //         if (req.body.hasOwnProperty(itemsFromBodyIndex)) {
    //             console.log(req.body[itemsFromBodyIndex]);
    //
    //             if(req.body[itemsFromBodyIndex] != null){
    //                 todo[itemsFromBodyIndex] = req.body[itemsFromBodyIndex];
    //             }
    //
    //         }
    //     }
    //
    //     db.collection('todos').update(details, todo, (err, item) => {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             res.json(item);
    //         }
    //     });
    // });
    res.send('hello')
};

function deleteTodo(req, res) {
    Todo.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Book successfully deleted!", result });
    });

};



module.exports = {deleteTodo, putTodo, getTodo, getTodoWithId, postTodo};
