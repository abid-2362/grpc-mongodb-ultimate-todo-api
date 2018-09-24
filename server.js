const path = require("path");
const PROTO_PATH = path.join("proto", "todoService.proto");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const serviceDefinition = protoLoader.loadSync(PROTO_PATH);
const PORT = 9000;
// const TodoDb = require("./classes/todoDBClass"); //mongodb class
const TodoDb = require("./classes/todoDBClassSql"); //postgredb class

// const TodoDb = TodoDbClassPSQL;
/*
  // to create secure server, need certificates for ssl, I have created self signed certificates with open ssl
  const cacert = fs.readFileSync("certs/ca.crt"),
    cert = fs.readFileSync("certs/server.crt"),
    key = fs.readFileSync("certs/server.key"),
    kvpair = {
      private_key: key,
      cert_chain: cert
    };

  const creds = grpc.ServerCredentials.createSsl(cacert, [kvpair]);
*/
const credentials = grpc.ServerCredentials.createInsecure();
const server = new grpc.Server();

server.addService(serviceDefinition.TodoService, {
  getAllTodos: getAllTodos,
  saveTodo: saveTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
  getTodoById: getTodoById
});

server.bind(`0.0.0.0:${PORT}`, credentials);
console.log(`Starting server on port ${PORT}`);
server.start();

// methods implementations
function saveTodo(call, callback) {
  let incomingTodo = call.request.todo;
  let payload = {
    title: incomingTodo.title,
    description: incomingTodo.description,
    done: incomingTodo.done
  };
  console.log('saveTodo on server initiated');
  let db = new TodoDb(payload);
  console;
  db.saveTodo()
    .then(function() {
      // no need to send todo back to client.
      callback(null, { isOk: true });
    })
    .catch(function(err) {
      callback(err, {isOk: false});
    });
}

function getAllTodos(call) {
  let db = new TodoDb({});
  db.getAllTodos()
    .then(function(todos) {
      // no need to send todo back to client.
      todos.forEach(function(todo) {
        let todoToSend = {
          id: todo._id ? todo._id : todo.id,
          title: todo.title,
          description: todo.description,
          done: todo.done
        };
        call.write({ todo: todoToSend });
      });
      call.end();
    })
    .catch(function(err) {
      // handle error -> some sort of logging function can be called here.
      console.log(err);
    });
}

function getTodoById(call, callback) {
  let todoId = call.request.id;
  let db = new TodoDb({ _id: todoId });
  db.getTodoById()
    .then(function(todo) {
      callback(null, { todo: todo });
    })
    .catch(function(err) {
      // log error for future reference
      console.log(err);
      // and send a general message to the client.
      let error = new Error(
        "We are unable to find this task, please make sure you provided correct id"
      );
      callback(error, null);
    });
}

function updateTodo(call, callback) {
  let incomingTodo = call.request.todo;
  let db = new TodoDb(incomingTodo);
  db.updateTodo()
    .then(function(result) {
      callback(null, { isOk: true });
    })
    .catch(function(err) {
      // handle error -> some sort of logging
      console.log(err);
      let error = new Error(
        "Unable to update the todo, make sur you are requesting the correct resource to be updated"
      );
      callback(error, null);
    });
}

function deleteTodo(call, callback) {
  let todoId = call.request.id;
  let db = new TodoDb({ id: todoId });
  db.deleteTodo()
    .then(function() {
      callback(null, { isOk: true });
    })
    .catch(function(err) {
      // handle error.
      console.log(err);
      let error = new Error(
        "Unable to delete task, please check if you are making a valid request of deletion"
      );
      callback(error, null);
    });
}

