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
    List<Map> jacketsMap = new List<Map>();
    var jacketTable = "jackets";
    var jacketId = "id";

    String selectJacketsTbl = "SELECT * FROM $jacketTable ORDER BY $jacketId DESC LIMIT 8";

    try {
      // var jacketIdMap = (await man.query(jacketIdQuery)).last; // since it's only one element _still
      // var jacketJustId = (await man.query(jacketIdQuery)).map((m)=>m["id"]).toList().first;
      // var testtest = (await man.query(jacketNameQuery)).map((m){
      // return m["name"].length;
      // }).first;
      // jacketsMap.add({(await man.query(jacketIdQuery)).map((m)=>m["id"]).first:{await man.query(jacketNameQuery): await man.query(jacketPriceQuery)}});
      // jacketsMap.add({jacketJustId:{jacketNameMap: jacketPriceMap}});

      var jacketsTableQuery = await man.query(selectJacketsTbl);
      jacketsTableQuery.forEach((element) {
        jacketsMap.add(element);
      });

    }
    catch(e) {
      jacketsMap = null; // dirty
      // print("display_db, invalid query: $jacketsTableQuery");
    }
    await man.close();
    // print("Display db yells: $jacketsMap");
    return jacketsMap;
  }
}