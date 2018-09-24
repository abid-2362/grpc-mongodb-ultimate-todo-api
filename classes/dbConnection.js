const mongoose = require("mongoose");
const pg = require('pg');
class DBConnect {
  async mongoDB() {
    await mongoose
    .connect(
      "mongodb://localhost:27017/grpcTodo",
      { useNewUrlParser: true }
    )
    .then(function() {
      console.log("mongodb connected");
    })
    .catch(function(err) {
      console.log("Error in mongodb connection", err);
    });
  }

  postgreSQL() {
    const client = new pg.Client({
      host: 'localhost',
      user: 'postgres',
      password: 'admin',
      database: 'node_todo',
      port: 5432,
    });
    client.connect();
    return client;
  }
}
module.exports = DBConnect;