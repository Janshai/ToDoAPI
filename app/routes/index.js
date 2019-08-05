const todoRoutes = require('./todo_routes.js');

module.exports = function(app) {
    todoRoutes(app);
};
