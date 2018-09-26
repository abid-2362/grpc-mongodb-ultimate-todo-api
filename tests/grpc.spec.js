"use strict";
const path = require("path");
const PROTO_PATH = path.join("proto", "todoService.proto");
const fs = require("fs");
const process = require("process");
const grpc = require("grpc");
// const protoLoader = require('@grpc/proto-loader');
// const serviceDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceDefinition = grpc.load(PROTO_PATH);
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

// const option = parseInt(process.argv[2], 10);
const id = "1234";
let outTodo = {
  id: id, // this id here in this function is just dummy to complete the object. server will store its own generated id.
  title: "learning",
  description: "working",
  done: true
};
// /*
// call the done only when we are done with current
// test and want to move forward to the next test.
test("Add New Todo", async done => {
  client.saveTodo({ todo: outTodo }, function(err, response) {
    expect(err).toBe(null);
    expect(response).toEqual(expect.objectContaining({ isOk: true }));
    done();
  });
});

test("Fetch All Todos", async done => {
  const call = client.getAllTodos({});
  call.on("data", function(todo) {
    expect(todo).toEqual(expect.objectContaining({}));
    done();
  });
});

test("Fetch Specific Todo", async done => {
  // this id is available in my mongodb database
  client.getTodoById({ id: id }, function(err, todo) {
    expect(err).toBe(null);
    expect(todo.todo).toEqual(expect.objectContaining(outTodo));
    done();
  });
});

test("Update Todo", async done => {
  let update = {
    id: id,
    title: "learning how to update",
    description: "Update is working good",
    done: false
  };
  client.updateTodo({ todo: update }, function(err, response) {
    expect(err).toBe(null);
    expect(response).toEqual(expect.objectContaining({ isOk: true }));
    done();
  });
});

test("Delete Todo", async done => {
  client.deleteTodo({ id: id }, function(err, result) {
    expect(err).toBe(null);
    expect(result).toEqual(expect.objectContaining({ isOk: true }));
    done();
  });
});
// */