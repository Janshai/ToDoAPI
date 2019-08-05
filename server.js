const mongTestServer = require('mongodb-memory-server');
const express        = require('express');
const bodyParser     = require('body-parser');
const config         = require('config');
const mongoose       = require('mongoose');

let options = {
                useNewUrlParser: true,
              };

const app            = express();

const port = 8000;
let mongoUri = "";
if(config.util.getEnv('NODE_ENV') !== 'prod') {
    const mongoServer = new mongTestServer.MongoMemoryServer();
    mongoServer.getConnectionString().then((uri) => {
        mongoose.connect(uri, options);

        mongoose.connection.on('error', (e) => {
            if (e.message.code === 'ETIMEDOUT') {
                console.log(e);
                mongoose.connect(uri, options);
            }
            console.log(e);
        });


    });

} else {
    mongoUri = config.DBHost
    mongoose.connect(config.DBHost, options);
}
mongoose.connection.once('open', () => {
    console.log('MongoDB successfully connected');
    app.emit('db connected');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));


require('./app/routes/index.js')(app);

app.listen(port)
console.log("We are live");

module.exports = app;
