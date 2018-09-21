const mongoose = require("mongoose");
const TodoModel = require("../models/TodoModel");
class TodoDbClass {
  constructor(payload) {
    this.payload = payload;
    this.TodoModel = TodoModel;
  }

  saveTodo() {
    let $this = this;
    return new Promise(function(resolve, reject) {
      let todoToSave = new $this.TodoModel($this.payload);
      todoToSave.save(function(err, todo) {
        if (err) reject(err);

        resolve(todo);
      });
    });
  }

  getAllTodos() {
    let $this = this;
    return new Promise(function(resolve, reject) {
      $this.TodoModel.find($this.payload, function(err, todos) {
        if (err) reject(err);
        resolve(todos);
      });
    });
  }

  getTodoById() {
    let $this = this;
    return new Promise(function(resolve, reject) {
      $this.TodoModel.findById($this.payload._id, function(err, todo) {
        if (err) reject(err);
        resolve(todo);
      });
    });
  }

  updateTodo() {
    let $this = this;
    let todoId = $this.payload.id;
    let update = $this.payload;
    delete(update.id);
    return new Promise(function(resolve, reject) {
      $this.TodoModel.findByIdAndUpdate(todoId, update, {new: true}, function(err, result){
        if(err)
          reject(err);
        else resolve(result);
      });
    });
  }

  deleteTodo() {
    let $this = this;
    let todoId = $this.payload.id;
    return new Promise(function(resolve, reject) {
      TodoModel.deleteOne({_id: todoId}, function(err, result){
        if(err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = TodoDbClass;