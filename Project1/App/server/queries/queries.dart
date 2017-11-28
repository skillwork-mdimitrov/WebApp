import 'display_db.dart';
import 'update_db.dart';

class Queries {
  DisplayDB select;
  UpdateDB update;

  Queries() {
    select = new DisplayDB();
    update = new UpdateDB();
  }

  open_connection() async {
    await select.open_db_connection();
  }
}