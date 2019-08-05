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
            it('Returns a 200 response, an ID, and the database stores the Todo correctly', () => {
                const input = {
                    title: 'Test',
                };
                var id = 0;
                return chai.request(app)
                    .post('/todo')
                    .send(input)
                    .then(response => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.have.property('_id');
                        id = response.body._id;
                        return ToDo.find(input);
                    })
                    .then(result => {
                        expect(result).to.have.lengthOf(1);
                        const item = result[0];
                        expect(item.title).to.be.equal(input.title);
                        expect(item._id.toString()).to.be.equal(id);

                    });
            });
        });

        describe('With incorrect types', () => {
            it('Is not currently possible', () => {
                expect(true).to.be.equal(true);
            })
        });

        // describe('With no title (a required field)', () => {
        //     it('Returns a 400 response, an error message and no data is added to the database', () => {
        //         const input = {
        //         };
        //         return chai.request(app)
        //             .post('/todo')
        //             .send(input)
        //             .then(response => {
        //                 expect(response).to.have.status(400);
        //                 expect(response.body).to.have.property('errors');
        //                 return ToDo.find(input);
        //             })
        //             .then(result => {
        //                 expect(result).to.have.lengthOf(0);
        //             })
        //     });
        // });
        // describe('With no X (an optional field)', () => {
        //     it('Returns a 200 response, an ID, and the database stores the Todo correctly', () => {
        //         const input = {
        //             title: 'Test'
        //         };
        //         var id = 0;
        //         return chai.request(app)
        //             .post('/todo')
        //             .send(input)
        //             .then(response => {
        //                 expect(response).to.have.status(200);
        //                 expect(response.body).to.have.property('_id');
        //                 id = response.body._id;
        //                 return ToDo.find(input);
        //             })
        //             .then(result => {
        //                 expect(result).to.have.lengthOf(1);
        //                 const item = result[0];
        //                 expect(item.title).to.be.equal(input.title);
        //                 expect(item._id.toString()).to.be.equal(id);
        //
        //             });
        //     });
        // });

    });

    describe('Delete a todo', () => {
        describe('Delete a todo that exists', () => {
            it('Returns a 200 response, and the todo is no longer in the database', done => {
                let todo = new ToDo({ title: 'test', description: 'this is a test'});
                todo.save((err, todo) => {
                    chai.request(app)
                        .delete('/todo/' + todo._id)
                        .send(todo)
                        .then(res => {
                            expect(res).to.have.status(200);
                            return ToDo.find(todo);
                        })
                        .then(result => {
                            expect(result).to.have.lengthOf(0);
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
                                return ToDo.findById(todo.id);
                            })
                            .then(result => {
                                expect(result.title).to.be.equal(updatedTodo.title);
                                done();
                            })

                    });
                });
            });
            // describe('With some fields missing', () => {
            //     it('Returns a 200 response, and the todo in the database combines the new values with pre-existing values', (done) => {
            //         let originalTodo = new ToDo({ title: 'Original title'});
            //         let updatedTodo = {};
            //         originalTodo.save((err, todo) => {
            //             return chai.request(app)
            //                 .put('/todo/' + todo.id.toString())
            //                 .send(updatedTodo)
            //                 .then(response => {
            //                     expect(response).to.have.status(200);
            //                     return ToDo.findById(todo.id);
            //                 })
            //                 .then(result => {
            //                     expect(result.title).to.be.equal(originalTodo.title);
            //                     done();
            //                 })
            //             });
            //
            //         });
            //     });
            // });
            describe('With incorrect types', () => {
                it('This is not currently possible', () => {
                    expect(true).to.be.equal(true);
                })
            });
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
                        expect(response.body).to.have.property('error');
                    })
            })
        });

    describe('Get todos', () => {
        describe('Get all todos', () => {
            describe('When there are no todos', () => {
                it('it should return an empty array', () => {
                    chai.request(server)
                    .get('/todo')
                    .end((err, response) => {
                        expect(response).to.have.status(200);
                        expect(response.body).to.be.a('array');
                        expect(response.body).to.have.lengthOf(0);
                    });
                });
            });

            describe('When there are some todos', () => {
                it('it should return an array of todos', () => {
                    let todos = [{ title: 'todo 1'},
                                 { title: 'todo 2'},
                                 { title: 'todo 3'}];
                    ToDo.collection.insertMany(todos, (err, docs) =>{
                        chai.request(server)
                        .get('/todo')
                        .end((err, response) => {
                            expect(response).to.have.status(200);
                            expect(response.body).to.be.a('array');
                            expect(response.body).to.have.lengthOf(3);

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
                            expect(response.body._id.toString()).to.be.equal(todo.id);
                            expect(response.body).to.have.property('title');
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
                            expect(response.body).to.have.property('error');

                        })
                });
            });
        });
    });

});
});
