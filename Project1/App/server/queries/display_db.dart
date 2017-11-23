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
    // var dbConnection = new ConnectionDB(); // instance of db connection
    await new ConnectionDB().connect();
    var man = await new Database().init();
    List<Map> jacketsMap = new List<Map>();

    var table = "jackets";
    var jacketsName = "name";
    var prices = "price";

    String jacketName = "SELECT $jacketsName FROM $table WHERE id=1;";
    String jacketPrice = "SELECT $prices FROM $table WHERE id=1;";
    String jacketId = "SELECT id FROM $table WHERE id=1";

    String almightyQuery = "SELECT * FROM $table";

    try {
      // jacketsMap.add(await man.query(query));
      jacketsMap.add({await man.query(jacketId):{await man.query(jacketName): await man.query(jacketPrice)}});

    }
    catch(e) {
      jacketsMap = null; // dirty
      // print("display_db, invalid query: $query");
    }
    await man.close();
    return jacketsMap;
  }
}