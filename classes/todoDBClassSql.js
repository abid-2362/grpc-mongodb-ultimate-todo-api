// import , Response } from "express";
const DBConnect = require("./dbConnection");
const db = new DBConnect();
// db.postgreSQL(); // connects to postgreSQL Database

// import DBConnect from "../dbConnection";
class TodoDbClassPSQL {
  constructor(payload) {
    this.payload = payload;
    this.client = db.postgreSQL();
  }

  saveTodo() {
    console.log("saveTodo initiated");
    // return;
    let $this = this;
    return new Promise(function(resolve, reject) {
      let client = $this.client;
      const task = $this.payload;
      let id;
      if ($this.payload._id) {
        id = $this.payload._id;
      } else {
        id = null;
      }
      (async function() {
        let response;
        try {
          if (id) {
            response = await client.query(
              `INSERT INTO todo_info(id,title,description,done)
            VALUES($1,$2,$3,$4) RETURNING id, title, description, done`,
              [id, task.title, task.description, task.done]
            );
          } else {
            response = await client.query(
              `INSERT INTO todo_info(title,description,done)
            VALUES($1,$2,$3) RETURNING id, title, description, done`,
              [task.title, task.description, task.done]
            );
          }
          client.end();
          const resSend = response.rowCount
            ? response.rows[0]
            : { message: "Can't add new Todo", status: false };
          /*
            we will not send this data back to client, as it
            is not defined in protocol buffer if we need to
            send that back, then we have to define it in
            protocol buffer definition as well.
          */
          resolve(resSend);
        } catch (err) {
          /*
            we will not send this data back to client, as it
            is not defined in protocol buffer if we need to
            send that back, then we have to define it in
            protocol buffer definition as well.
          */
          reject([{ message: "Can't add new Todo", status: false }, err]);
        }
      })();
    });
  }

  getAllTodos() {
    let $this = this;
    let client = $this.client;
    return new Promise(function(resolve, reject) {
      (async function() {
        try {
          const response = await client.query("SELECT * FROM todo_info");
          client.end();
          resolve(response.rows);
          // res.status(200).send(response.rows);
        } catch (err) {
          // [{ message: "Server Not Found Error!", status: false }, err]
          reject(err);
        }
      })();
    });
  }

  getTodoById() {
    let $this = this;
    let client = $this.client;
    return new Promise(function(resolve, reject) {
      const id = $this.payload._id;
      (async function() {
        try {
          const response = await client.query(
            "SELECT * FROM todo_info WHERE ID = $1",
            [id]
          );
          client.end();
          resolve(response.rows[0]);
        } catch (err) {
          // [{ message: "Server Error!", status: false }, err];
          reject(err);
        }
      })();
    });
  }

  updateTodo(req, res) {
    let $this = this;
    let client = $this.client;
    return new Promise(function(resolve, reject) {
      let { title, description, done } = $this.payload;
      if (!done) {
        done = false;
      }
      const id = $this.payload.id;
      (async function() {
        try {
          const response = await client.query(
            `UPDATE todo_info
            SET (title, description, done) = ($1, $2, $3)
            WHERE id = $4
            RETURNING id, title, description, done`,
            [title, description, done, id]
          );
          client.end();
          const resSend = response.rowCount ? response.rows[0] : null;
          if (resSend) resolve(resSend);
          else reject("Id not found to update");
        } catch (err) {
          reject(err);
        }
      })();
    });
  }

  deleteTodo(req, res) {
    let $this = this;
    let client = $this.client;
    return new Promise(function(resolve, reject) {
      const id = $this.payload.id;
      (async function() {
        try {
          const response = await client.query(
            `DELETE FROM todo_info WHERE ID = $1`,
            [id]
          );
          client.end();
          const resSend = response.rowCount ? true : false;
          if(resSend) resolve(resSend);
          else reject('Already deleted');
        } catch (err) {
          reject(err);
        }
      })();
    });
  }
}

module.exports = TodoDbClassPSQL;
