let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//todo schema definition
let TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
TodoSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the ToDoSchema for use elsewhere.
module.exports = mongoose.model('todo', TodoSchema);
