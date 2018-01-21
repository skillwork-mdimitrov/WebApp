import '../db_connection.dart';
/* This file has left from the process prototyping and it's currently unused */
/* Unsuccessful operation Strings should end with ', E' */

class UpdateDB {
  // Fields
  String table;
  String value;
  int id;

  updateName(int id, String value) async {
    // VARIABLES
    var dbConnection = new ConnectionDB(); // instance of db connection
    var results;
    String table = "testtbl";
    this.id = id;
    this.value = value;

    String updateNameQuery = "UPDATE $table SET name='$value' WHERE id=$id";

    // await dbConnection.connection.open();
    try {
      // await dbConnection.connection.query(updateNameQuery);
      results = "Succesfull. [$value] updated";
    }
    catch(e) {
      results = "Cannot update id[$id] with the given name[$value], E";
    }
    // await dbConnection.connection.close();
    return results;
  }

  updateCartStatus(int id, String value) async{
    // VARIABLES
    var dbConnection = new ConnectionDB(); // instance of db connection
    var results;
    String table = "testtbl";
    String person = "name";
    this.id = id;
    this.value = value;

    String updateCartQuery = "UPDATE $table SET cartemptystatus='$value' WHERE id=$id";

    // await dbConnection.connection.open();
    try {
      // await dbConnection.connection.query(updateCartQuery);
      results = "Successful. Id[$id] with status[$value] - updated";
    }
    catch(e) {
      String getPersonString = "SELECT $person FROM $table WHERE id=$id";
      var getPersonQuery;
      try {
        // getPersonQuery = await dbConnection.connection.query(getPersonString);
        if(getPersonQuery.isEmpty) {
          getPersonQuery = "[No such person]";
        }
      }
      catch(e) {
        getPersonQuery = "[Unknown]";
      }
      results = "Couldn't update $getPersonQuery, id[$id] with value[$value], E";
    }
    // await dbConnection.connection.close();
    return results;
  }

}