import 'package:postgres/postgres.dart';

class ConnectionDB {

  PostgreSQLConnection connection;

  ConnectionDB() {
    connection = new PostgreSQLConnection(
        "localhost",
        5432,
        "webapp", // db name
        username: "postgres",
        password: "prototype115m" // should be avoided
    );
  }
}


