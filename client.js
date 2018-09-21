"use strict";
const path = require("path");
const PROTO_PATH = path.join("proto", "todoService.proto");
const fs = require("fs");
const process = require("process");
const grpc = require("grpc");
// const protoLoader = require('@grpc/proto-loader');
// const serviceDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceDefinition = grpc.load(PROTO_PATH);
console;
const PORT = 9000;
/*
  const cacert = fs.readFileSync("certs/ca.crt"),
    cert = fs.readFileSync("certs/client.crt"),
    key = fs.readFileSync("certs/client.key"),
    kvpair = {
      private_key: key,
      cert_chain: cert
    };
  const creds = grpc.credentials.createSsl(cacert, key, cert);
*/
const creds = grpc.credentials.createInsecure();
const client = new serviceDefinition.TodoService(
  `DESKTOP-AON6DU0:${PORT}`,
  creds
);

const option = parseInt(process.argv[2], 10);

switch (option) {
  case 1:
    saveTodo(client);
    break;

  case 2:
    getAllTodos(client);
    break;

  case 3:
    getTodoById(client);
    break;

  case 4:
    updateTodo(client);
    break;

  case 5:
    deleteTodo(client);
    break;
  default:
    break;
}

function deleteTodo(client) {
  client.deleteTodo({ id: "5ba493b2be19db1960b6f518" }, function(err, result) {
    if (err) console.log(err);
    else console.log(result);
  });
}

function updateTodo(client) {
  let update = {
    id: "5ba491a1da7fef25b04a6d4e",
    title: "learning how to update",
    description: "Update is working good",
    done: false
  };
  client.updateTodo({ todo: update }, function(err, newTodo) {
    if (err) console.log(err);
    else console.log(newTodo);
  });
}

function getAllTodos(client) {
  const call = client.getAllTodos({});

  call.on("data", function(todo) {
    console.log(todo.todo);
  });
}
/*
  function getTodoById(client) {
    const md = new grpc.Metadata();
    md.add("username", "learning");
    md.add("password", "learning1");

    client.getByBadgeNumber({}, md, function() {});
  }
*/

function getTodoById(client) {
  console.log(client);
  client.getTodoById({ id: "5ba493b2be19db1960b6f518" }, function(err, todo) {
    if (err) console.log(err);
    else console.log(todo);
  });
  // 5ba493b2be19db1960b6f518
}
function saveTodo(client) {
  let outTodo = {
    id: "3216548", // this id here in this function is just dummy to complete the object. server will store its own generated id.
    title: "learning",
    description: "working",
    done: true
  };
  client.saveTodo({ todo: outTodo }, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });
}
