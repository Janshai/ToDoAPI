let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {type: String, required: true},
        colour: {type: String, default: "White"},
        emoji: {type: String, required: false}

    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('category', CategorySchema);
