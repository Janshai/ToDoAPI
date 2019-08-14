let mongoose = require('mongoose');
let Category = require('../models/category');


function postCategory(req, res) {
    const category = new Category(req.body);
    let validation = category.validateSync();
    var jsonResponse = {};
    let query = category.save(category, (err, result) => {
        if(err) {
            console.log(err)
            jsonResponse.message = "Failed to create Category";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.category = null;
            res.status(400)
        } else {
            jsonResponse.message = "Created Category!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.category = result;
        }
        res.json(jsonResponse);
    });
}

function putCategory(req, res) {
    var jsonResponse = {
        message: "Updating Category Unsuccessful",
        success: false,
        error: ""
    };
    let id = req.params.id;
    Category.findById({_id: id}, (err, category) => {
        if(err) {
            console.log(err)
            jsonResponse.error = err.message;
            jsonResponse.category = null
            res.status(400);
            res.json(jsonResponse)
        } else if (category === null){
            jsonResponse.error = "Item with id $(id.toString()) does not exist";
            jsonResponse.category = null
            res.status(400);
            res.json(jsonResponse)
        } else {
            Object.assign(category, req.body)
            category.save((err, result) => {
                if(err) {
                    console.log(err)
                    res.status(400)
                    jsonResponse.error = err.message;
                } else {
                    jsonResponse.message = "Updated Category with id $(id.toString()) successfully!";
                    jsonResponse.success = true;
                    jsonResponse.error = null;
                    jsonResponse.category = result;
                }
                res.json(jsonResponse)
            });
        }
        ;
    });

}

function getAllCategories(req, res) {
    let query = Category.find({});
    var jsonResponse = {};
    query.exec((err, result) => {
        if (err) {
            jsonResponse.message = "Finding all Categories Unsuccessful";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.categories = null;
            console.log(err);
            res.status(400);
        } else {
            jsonResponse.message = "Finding all Categories Successful";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.categories = result;
        }
        res.json(jsonResponse);
    });
}

function getCategoryByID(req, res) {
    var jsonResponse = {};
    Category.findById(req.params.id, (err, result) => {
        if(err) {
            jsonResponse.message = "Finding Category with id $(req.params.id.toString()) Unsuccessful";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.category = null;
            console.log(err);
            res.status(400);
        } else if(result === null){
            res.status(400);
            jsonResponse.message = "Finding Category with id $(req.params.id.toString()) Unsuccessful";
            jsonResponse.success = false;
            jsonResponse.error = "Category with id $(req.params.id.toString()) does not exist";
            jsonResponse.category = null;
        } else {
            jsonResponse.message = "Found Category with id $(req.params.id.toString()) Successfully!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.category = result;
        }
        res.json(jsonResponse);
    });
}

function deleteCategory(req, res) {
    Category.deleteOne({_id : req.params.id}, (err, result) => {
        jsonResponse = {};
        if (err) {
            console.log(err);
            jsonResponse.message = "Deletion Unsuccessful";
            jsonResponse.success = false;
            jsonResponse.error = err.message;
            jsonResponse.category = null;
            res.status(400);
        } else {
            jsonResponse.message = "Todo successfully deleted!";
            jsonResponse.success = true;
            jsonResponse.error = null;
            jsonResponse.category = null;
        }
        res.json(jsonResponse);
    });
}

module.exports = {postCategory, putCategory, getAllCategories, getCategoryByID, deleteCategory}
