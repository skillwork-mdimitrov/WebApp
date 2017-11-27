import 'dart:async';

import '../db_connection.dart';
import 'package:mapper/mapper.dart';

class DisplayDB {
  // Fields
  String table;
  String column;
  String criteria;

  selectAllIds(String table, String column, [String criteria]) async {
    // VARIABLES
    var dbConnection = new ConnectionDB(); // instance of db connection
    var results;
    this.table = table;
    this.column = column;
    this.criteria = criteria;

    String simpleQuery = "SELECT $column FROM $table${criteria==null ? '' : 'WHERE $criteria '} ORDER BY id;";

    // await dbConnection.connection.open();
    try {
      // results = await dbConnection.connection.query(simpleQuery);
    }
    catch(e) {
      results = "Invalid query";
      // print("display_db, invalid query: $simpleQuery");
    }
    // await dbConnection.connection.close();
    return results;
  }

  newestClothes() async {
    // VARIABLES
    await new ConnectionDB().connect();
    var man = await new Database().init();
    List<Map> jacketsTableQuery;
    String jacketTable = "jackets";
    String jacketId = "id";

    String selectJacketsTbl = "SELECT * FROM $jacketTable ORDER BY $jacketId DESC LIMIT 8";

    try {
      jacketsTableQuery = await man.query(selectJacketsTbl);
    }
    catch(e) {
      // print("display_db, invalid query: $jacketsTableQuery");
      jacketsTableQuery = null; // dirty
    }
    await man.close();
    // print("Display db yells: $jacketsMap");
    return jacketsTableQuery;
  }
}

/*Future performTransaction(Future f(ConnectionDB connection)) async {
  var c = await new ConnectionDB().connect();
  try {
    var r = await f(c);
  } catch (e) {

  } finally {
    await c.close();
    rethrow;
  }
}*/
