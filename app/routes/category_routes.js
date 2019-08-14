const category = require('../controllers/category.js');

module.exports = function(app) {
    // POST
    app.post('/category', category.postCategory);

    // GET with id
    app.get('/category/:id', category.getCategoryByID);

    // GET all
    app.get('/category', category.getAllCategories);

    // UPDATE
    app.put('/category/:id', category.putCategory);

    // DELETE
    app.delete('/category/:id', category.deleteCategory);
};
