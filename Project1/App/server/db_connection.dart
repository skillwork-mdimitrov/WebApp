import 'package:mapper/mapper.dart';
// import 'package:postgres/postgres.dart';

class ConnectionDB {
//  PostgreSQLConnection connection;
//
//  ConnectionDB() {
//    connection = new PostgreSQLConnection(
//        "localhost",
//        5432,
//        "webapp", // db name
//        username: "postgres",
//        password: "prototype115m" // should be avoided
//    );
//  }

  connect() async {
    var pool =
        new Pool('localhost', 5432, 'webapp', 'postgres', 'prototype115m');
    await pool.start();
    new Database()
      ..add(() => new Manager(pool, new Application()..data = {}).init());

    // var man = await new Database().init();
    // List<Map> r = await man.query('sds');
    // return man;
  }
}

//main() async {
//  await new ConnectionDB().connect();
//  var m = await new Database().init();
//  // prin(await m.query('select * from jackets'));
//}
