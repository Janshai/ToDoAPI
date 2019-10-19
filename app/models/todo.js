let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//todo schema definition
let TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    categories: { type: [String], default: []},
    completed: { type: Boolean, default: false},
    completedAt: {type: Date, required: false},
    points: {type: Number, default: 1},
    priority: {type: String, required: false},
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
