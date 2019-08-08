let mongoose = require('mongoose');
let Category = require('../models/category');


function postCategory(req, res) {
    const category = new Category(req.body);
    let validation = category.validateSync();
    var jsonResponse = {};
    let query = category.save(category, (err, result) => {
        if(err) {
            console.log(err)
            jsonResponse = {
                message: "Creating Category Unsuccessful",
                success: false,
                error: err.message,
                category: null
            };
            res.status(400)
        } else {
            jsonResponse = {
                message: "Successfully Created Category!",
                success: true,
                errors: null,
                category: result
            };
        }
        res.json(jsonResponse);
    });
}

function putCategory(req, res) {
    var jsonResponse = {
        message: "Updating Category Unsuccessful",
        success: false,
        error: "",
        category: null
    };
    let id = req.params.id;
    Category.findById({_id: id}, (err, category) => {
        if(err) {
            console.log(err)
            jsonResponse.error = err.message;
            res.status(400);
            res.json(jsonResponse)
        } else if (category === null){
            jsonResponse.error = "Item with id $(id.toString()) does not exist";
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

}

function getCategoryByID(req, res) {

}

function deleteCategory(req, res) {

}

module.exports = {postCategory, putCategory, getAllCategories, getCategoryByID, deleteCategory}
