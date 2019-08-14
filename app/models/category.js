let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {type: String, required: true},
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('category', CategorySchema);
