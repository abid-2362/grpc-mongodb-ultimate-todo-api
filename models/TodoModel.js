const mongoose = require('mongoose');

let TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  }
});
const TodoModel = mongoose.model('Todo', TodoSchema);
module.exports = TodoModel;