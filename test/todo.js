process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let ToDo = require('../app/models/todo');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Todos', () => {
    beforeEach((done) => { //Before each test we empty the database
        ToDo.remove({}, (err) => {
           done();
        });
    });
