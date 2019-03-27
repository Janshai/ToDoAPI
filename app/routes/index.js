const todoRoutes = require('./todo_routes.js')

module.exports = function(app, db) {
    todoRoutes(app, db);
};
