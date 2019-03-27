const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db.js');

const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));


MongoClient.connect(db.url, (err, database) => {

    if (err) return console.log(err);
    const datab = database.db('todo-api');
    require('./app/routes/index.js')(app, datab);

    app.listen(port, () => {
        console.log("We are live");
    });
});
