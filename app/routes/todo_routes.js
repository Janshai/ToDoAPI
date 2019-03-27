var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    // POST
    app.post('/todo', (req, res) => {
        console.log(req.body);
        const todo = {title: req.body.title, description: req.body.description};
        db.collection('todos').insert(todo, (err, result) => {
            if(err) {
                res.send(err);
            } else {
                res.send(result.ops[0]);
            }
        });

    });

    // GET
    app.get('/todo/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('todos').findOne(details, (err, item) => {
            if(err) {
                res.send(err);
            } else {
                res.send(item);
            }
        });
    });

    // UPDATE

    app.put('/todo/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        var todo = null;
        db.collection('todos').findOne(details, (err, item) => {
            if(err) {
                res.send(err);
            } else {
                todo = item;
            }

            for (var itemsFromBodyIndex in req.body) {
                if (req.body.hasOwnProperty(itemsFromBodyIndex)) {
                    console.log(req.body[itemsFromBodyIndex]);

                    if(req.body[itemsFromBodyIndex] != null){
                        todo[itemsFromBodyIndex] = req.body[itemsFromBodyIndex];
                    }

                }
            }

            db.collection('todos').update(details, todo, (err, item) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(item);
                }
            });
        });



    });

    // DELETE

    app.delete('/todo/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('todos').remove(details, (err, item) => {
            if(err) {
                res.send(err);
            } else {
                res.send('Deleted todo with id: ' + id);
            }
        });
    });

};
