process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let Category = require('../app/models/category');
let app = require('../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;


chai.use(chaiHttp);


// before(function (done) {
//     app.on("db connected", function(){
//         done();
//     });
// });

describe('Categories', () => {
    beforeEach((done) => { //Before each test we empty the database
        Category.deleteMany({}, (err) => {
        });
        done();
    });

    describe('Create a Category', () => {
        describe('With correct and complete input', () => {
            it('Returns a 200 response with a body in the correct format, the category, and the database stores the Category correctly', () => {
                const input = {
                    name: 'Test',
                };
                var id = 0;
                return chai.request(app)
                    .post('/category')
                    .send(input)
                    .then(response => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(true);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.equal(null);
                        expect(response.body).to.have.property('category');
                        expect(response.body.category).to.have.property('_id');
                        id = response.body.category._id;
                        return Category.findById(id);
                    })
                    .then(result => {
                        expect(result.name).to.be.equal(input.name);
                        expect(result._id.toString()).to.be.equal(id);
                    });
            });
        });
    });

    describe('Delete a category', () => {
        describe('Delete a category that exists', () => {
            it('Returns a 200 response with a body in the correct format, and the category is no longer in the database', done => {
                let category = new Category({ name: 'test'});
                category.save((err, category) => {
                    chai.request(app)
                        .delete('/category/' + category._id)
                        .send(category)
                        .then(response => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            return Category.findById(category._id);
                        })
                        .then(result => {
                            expect(result).to.be.equal(null);
                        })
                        done();
                })


            })
        });

        describe('Delete a category that doesn\'t exist', () => {
            it('Returns a 200 response', () => {
                // There's no real issue for the client if they try to delete something and it's not there
                return chai.request(app)
                    .delete('/category/' + '5d1581eccae5cc2183cf13fa')
                    .send()
                    .then(response => {
                        expect(response).to.have.status(200);
                    })
            })
        });
    });

    describe('Update a category', () => {
        describe('Update a category that exists', () => {
            describe('With all fields given', () => {
                it('Returns a 200 response, and the category in the database matches the input', (done) => {
                    let originalCategory = new Category({ name: 'Original name'});
                    let updatedCategory = { name: 'Updated name'};
                    originalCategory.save((err, category) => {
                        return chai.request(app)
                            .put('/category/' + category.id.toString())
                            .send(updatedCategory)
                            .then(response => {
                                expect(response).to.have.status(200);
                                expect(response.body).to.have.property('message');
                                expect(response.body).to.have.property('success');
                                expect(response.body.success).to.be.equal(true);
                                expect(response.body).to.have.property('error');
                                expect(response.body.error).to.be.equal(null);
                                expect(response.body).to.have.property('category');
                                return Category.findById(category.id);
                            })
                            .then(result => {
                                expect(result.title).to.be.equal(updatedCategory.title);
                                done();
                            })
                    });
                });
            });
        });

        describe('Update a category that doesn\'t exist', () => {
            it('Returns a 400 response and an error message', () => {
                return chai.request(app)
                    .put('/category/5d1581eccae5cc2183cf13fa')
                    .send(
                        {
                            name:'I Don\'t exist'
                        })
                    .then(response => {
                        expect(response).to.have.status(400);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(false);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.not.equal(null);
                        expect(response.body).to.have.property('category');
                        expect(response.body.category).to.be.equal(null);
                    })
            })
        });
    });

    describe('Get category', () => {
        describe('Get all categories', () => {
            describe('When there are no categories', () => {
                it('it should return an empty array', () => {
                    chai.request(server)
                    .get('/category')
                    .end((err, response) => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(true);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.equal(null);
                        expect(response.body).to.have.property('categories');
                        expect(response.body.categories).to.be.a('array');
                        expect(response.body.categories).to.have.lengthOf(0);
                    });
                });
            });

            describe('When there are some categories', () => {
                it('it should return an array of categories', () => {
                    let categories = [{ name: 'category 1'},
                                      { name: 'category 2'},
                                      { name: 'category 3'}];
                    Category.collection.insertMany(categories, (err, docs) =>{
                        chai.request(server)
                        .get('/category')
                        .end((err, response) => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            expect(response.body).to.have.property('categories');
                            expect(response.body.categories).to.be.a('array');
                            expect(response.body.categories).to.have.lengthOf(3);

                        });
                    });

                });
            });
        });

        describe('Get categories with id', () => {
            describe('An id that exists', () => {
                it('Returns a 200 status and the correct category', () => {
                    let category = new Category({name: 'a title'});
                    category.save((err, category) => {
                        return chai.request(server)
                        .get('/category/' + category.id.toString())
                        .send()
                        .then((response => {

                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            expect(response.body).to.have.property('category');
                            expect(response.body.category._id.toString()).to.be.equal(category.id);
                            expect(response.body.category).to.have.property('name');
                        }))
                    })
                });
            });
            describe('An id that doesn\'t exist', () => {
                it('Returns a 400 status', () => {
                    return chai.request(app)
                        .get('/category/5d1581eccae5cc2183cf13fa')
                        .send()
                        .then(response => {
                            expect(response).to.have.status(400);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(false);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.not.equal(null);
                            expect(response.body).to.have.property('category');
                            expect(response.body.category).to.be.equal(null);
                        })
                });
            });
        });
    });

});
