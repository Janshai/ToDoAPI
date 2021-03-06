process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let ToDo = require('../app/models/todo');
let app = require('../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;


chai.use(chaiHttp);


before(function (done) {
    app.on("db connected", function(){
        done();
    });
});

//Our parent block
describe('Todos', () => {
    beforeEach((done) => { //Before each test we empty the database
        ToDo.deleteMany({}, (err) => {
        });
        done();
    });

    describe('Create a Todo', () => {
        describe('With correct and complete input', () => {
            it('Returns a 200 response with a body in the correct format, the todo, and the database stores the Todo correctly', () => {
                const input = {
                    title: 'Test',
                };
                var id = 0;
                return chai.request(app)
                    .post('/todo')
                    .send(input)
                    .then(response => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(true);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.equal(null);
                        expect(response.body).to.have.property('todo');
                        expect(response.body.todo).to.have.property('_id');
                        id = response.body.todo._id;
                        return ToDo.findById(id);
                    })
                    .then(result => {
                        expect(result.title).to.be.equal(input.title);
                        expect(result._id.toString()).to.be.equal(id);
                    });
            });
        });

        // describe('With incorrect types', () => {
        //     it('Returns a 400 response, an error message and no data is added to the database', () => {
        //         const input = {
        //             title: "Test",
        //             categories: "not the right type"
        //         };
        //         return chai.request(app)
        //             .post('/todo')
        //             .send(input)
        //             .then(response => {
        //                 expect(response).to.have.status(400);
        //                 expect(response.body).to.have.property('message');
        //                 expect(response.body).to.have.property('success');
        //                 expect(response.body.success).to.be.equal(false);
        //                 expect(response.body).to.have.property('error');
        //                 expect(response.body.error).to.be.not.equal(null);
        //                 return ToDo.find(input);
        //             })
        //             .then(result => {
        //                 expect(result).to.have.lengthOf(0);
        //             })
        //     });
        // });

        describe('With no title (a required field)', () => {
            it('Returns a 400 response, an error message and no data is added to the database', () => {
                const input = {
                    categories: ["anidentifier", "identifier2"]
                };
                return chai.request(app)
                    .post('/todo')
                    .send(input)
                    .then(response => {
                        expect(response).to.have.status(400);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(false);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.not.equal(null);
                        return ToDo.find(input);
                    })
                    .then(result => {
                        expect(result).to.have.lengthOf(0);
                    })
            });
        });

        describe('With no categories (an optional field)', () => {
            it('Returns a 200 response, an ID, and the database stores the Todo correctly', () => {
                const input = {
                    title: 'Test'
                };
                var id = 0;
                return chai.request(app)
                    .post('/todo')
                    .send(input)
                    .then(response => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(true);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.equal(null);
                        expect(response.body).to.have.property('todo');
                        expect(response.body.todo).to.have.property('_id');
                        expect(response.body.todo).to.have.property('createdAt');
                        expect(response.body.todo).to.have.property('title');
                        expect(response.body.todo).to.have.property('categories');
                        id = response.body.todo._id;
                        return ToDo.findById(id);
                    })
                    .then(result => {
                        expect(result.title).to.be.equal(input.title);
                        expect(result.categories).to.be.a('array');
                        expect(result.categories).to.have.lengthOf(0);

                    });
            });
        });

    });

    describe('Delete a todo', () => {
        describe('Delete a todo that exists', () => {
            it('Returns a 200 response with a body in the correct format, and the todo is no longer in the database', done => {
                let todo = new ToDo({ title: 'test'});
                todo.save((err, todo) => {
                    chai.request(app)
                        .delete('/todo/' + todo._id)
                        .send(todo)
                        .then(response => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            return ToDo.findById(todo._id);
                        })
                        .then(result => {
                            expect(result).to.be.equal(null);
                        })
                        done();
                })


            })
        });

        describe('Delete a todo that doesn\'t exist', () => {
            it('Returns a 200 response', () => {
                // There's no real issue for the client if they try to delete something and it's not there
                return chai.request(app)
                    .delete('/todo/' + '5d1581eccae5cc2183cf13fa')
                    .send()
                    .then(response => {
                        expect(response).to.have.status(200);
                    })
            })
        });
    });

    describe('Update a todo', () => {
        describe('Update a todo that exists', () => {
            describe('With all fields given', () => {
                it('Returns a 200 response, and the todo in the database matches the input', (done) => {
                    let originalTodo = new ToDo({ title: 'Original title'});
                    let updatedTodo = { title: 'Updated title'};
                    originalTodo.save((err, todo) => {
                        return chai.request(app)
                            .put('/todo/' + todo.id.toString())
                            .send(updatedTodo)
                            .then(response => {
                                expect(response).to.have.status(200);
                                expect(response.body).to.have.property('message');
                                expect(response.body).to.have.property('success');
                                expect(response.body.success).to.be.equal(true);
                                expect(response.body).to.have.property('error');
                                expect(response.body.error).to.be.equal(null);
                                expect(response.body).to.have.property('todo');
                                return ToDo.findById(todo.id);
                            })
                            .then(result => {
                                expect(result.title).to.be.equal(updatedTodo.title);
                                done();
                            })

                    });
                });
            });
            describe('With some fields missing', () => {
                it('Returns a 200 response, and the todo in the database combines the new values with pre-existing values', (done) => {
                    let originalTodo = new ToDo(
                        {
                            title: "Original title",
                            categories: []
                        }
                    );
                    let updatedTodo = {
                        categories: ["anewcategory"]
                    };
                    originalTodo.save((err, todo) => {
                        return chai.request(app)
                            .put('/todo/' + todo.id.toString())
                            .send(updatedTodo)
                            .then(response => {
                                expect(response).to.have.status(200);
                                expect(response.body).to.have.property('message');
                                expect(response.body).to.have.property('success');
                                expect(response.body.success).to.be.equal(true);
                                expect(response.body).to.have.property('error');
                                expect(response.body.error).to.be.equal(null);
                                expect(response.body).to.have.property('todo');
                                return ToDo.findById(todo.id);
                            })
                            .then(result => {
                                expect(result.title).to.be.equal(originalTodo.title);
                                expect(result.categories).to.be.a('array');
                                expect(result.categories[0]).to.be.a('string');
                                expect(result.categories[0]).to.be.equal(updatedTodo.categories[0]);
                                done();
                            })
                            done()
                        });
                    });
                });
                // describe('With incorrect types', () => {
                //     it('Returns a 200 response, and the todo in the database combines the new values with pre-existing values', (done) => {
                //         let originalTodo = new ToDo(
                //             {
                //                 title: "Original title",
                //                 categories: []
                //             }
                //         );
                //         let updatedTodo = {
                //             categories: "anewcategory"
                //         };
                //         originalTodo.save((err, todo) => {
                //             return chai.request(app)
                //                 .put('/todo/' + todo.id.toString())
                //                 .send(updatedTodo)
                //                 .then(response => {
                //                     expect(response).to.have.status(400);
                //                     expect(response.body).to.have.property('message');
                //                     expect(response.body).to.have.property('success');
                //                     expect(response.body.success).to.be.equal(false);
                //                     expect(response.body).to.have.property('error');
                //                     expect(response.body.error).to.be.not.equal(null);
                //                     expect(response.body).to.have.property('todo');
                //                     return ToDo.findById(todo.id);
                //                 })
                //                 .then(result => {
                //                     expect(result.title).to.be.equal(originalTodo.title);
                //                     expect(result.categories).to.be.a('array');
                //                     expect(result.categories).to.be.equal(updatedTodo.categories);
                //                     done();
                //                 })
                //                 done()
                //             });
                //         });
                // });
            });

        describe('Update a todo that doesn\'t exist', () => {
            it('Returns a 400 response and an error message', () => {
                return chai.request(app)
                    .put('/todo/5d1581eccae5cc2183cf13fa')
                    .send(
                        {
                            title:'I Don\'t exist'
                        })
                    .then(response => {
                        expect(response).to.have.status(400);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(false);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.not.equal(null);
                        expect(response.body).to.have.property('todo');
                        expect(response.body.todo).to.be.equal(null);
                    })
            })
        });
    });

    describe('Get todos', () => {
        describe('Get all todos', () => {
            describe('When there are no todos', () => {
                it('it should return an empty array', () => {
                    chai.request(server)
                    .get('/todo')
                    .end((err, response) => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('message');
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.be.equal(true);
                        expect(response.body).to.have.property('error');
                        expect(response.body.error).to.be.equal(null);
                        expect(response.body).to.have.property('todos');
                        expect(response.body.todos).to.be.a('array');
                        expect(response.body.todos).to.have.lengthOf(0);
                    });
                });
            });

            describe('When there are some todos', () => {
                it('it should return an array of todos', () => {
                    let todos = [{ title: 'todo 1', completed: false},
                                 { title: 'todo 2', completed: false},
                                 { title: 'todo 3', completed: false}];
                    ToDo.collection.insertMany(todos, (err, docs) =>{
                        chai.request(server)
                        .get('/todo')
                        .end((err, response) => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            expect(response.body).to.have.property('todos');
                            expect(response.body.todos).to.be.a('array');
                            expect(response.body.todos).to.have.lengthOf(3);

                        });
                    });

                });
            });
        });

        describe('Get todos with id', () => {
            describe('An id that exists', () => {
                it('Returns a 200 status and the correct todo', () => {
                    let todo = new ToDo({title: 'a title'});
                    todo.save((err, todo) => {
                        return chai.request(server)
                        .get('/todo/' + todo.id.toString())
                        .send()
                        .then((response => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(true);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.equal(null);
                            expect(response.body).to.have.property('todo');
                            expect(response.body.todo._id.toString()).to.be.equal(todo.id);
                            expect(response.body.todo).to.have.property('title');
                        }))
                    })
                });
            });
            describe('An id that doesn\'t exist', () => {
                it('Returns a 400 status', () => {
                    return chai.request(app)
                        .get('/todo/5d1581eccae5cc2183cf13fa')
                        .send()
                        .then(response => {
                            expect(response).to.have.status(400);
                            expect(response.body).to.have.property('message');
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.be.equal(false);
                            expect(response.body).to.have.property('error');
                            expect(response.body.error).to.be.not.equal(null);
                            expect(response.body).to.have.property('todo');
                            expect(response.body.todo).to.be.equal(null);
                        })
                });
            });
        });
    });

});
