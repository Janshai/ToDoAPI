const express        = require('express');
const bodyParser     = require('body-parser');
const config         = require('config');
const mongoose       = require('mongoose');

let options = {
                useMongoClient: true,
                useNewUrlParser: true,

              };

const app            = express();

const port = 8000;

mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));


require('./app/routes/index.js')(app);

app.listen(port)
console.log("We are live");

module.exports = {app};
