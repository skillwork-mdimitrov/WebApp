import 'package:postgres/postgres.dart';

class ConnectionDB {

  PostgreSQLConnection connection;

  ConnectionDB() {
    connection = new PostgreSQLConnection(
        "localhost",
        5432,
        "postgres", // db name
        username: "postgres",
        password: "prototype115m"
    );
  }
}


