const todoRoutes = require('./todo_routes.js');
const categoryRoutes = require('./category_routes.js')

module.exports = function(app) {
    todoRoutes(app);
    categoryRoutes(app);
};
