var ObjectID = require('mongodb').ObjectID;
const todo = require('../controllers/todo.js');

module.exports = function(app) {
    // POST
    app.post('/todo', todo.postTodo);
    // GET with id
    app.get('/todo/:id', todo.getTodoWithId);

    // GET all
    app.get('/todo', todo.getTodo);

    // UPDATE

    app.put('/todo/:id', todo.putTodo);

    // DELETE

    app.delete('/todo/:id', todo.deleteTodo);

};