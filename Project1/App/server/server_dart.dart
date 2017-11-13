// Copyright (c) 2017, Maksim Dimitrov. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library urls; // not sure if needed

import 'package:http_server/http_server.dart';
import 'package:route/server.dart'; // router library
import 'package:route/pattern.dart'; // router library
import 'package:route/url_pattern.dart'; // router library, not sure if needed
import 'dart:io';
import 'dart:convert';
import 'queries/queries.dart';

main() async {
  var httpRequest;
  var resultsUnencoded;
  var resultsDecoded;

  final updateClient = new UrlPattern(r'/server/update_client');
  final display = new UrlPattern(r'/server/display');
  final homeUrl2 = new UrlPattern(r'/path2');

  var server = await HttpServer.bind(InternetAddress.LOOPBACK_IP_V4, 9000);
  print('Listening on ${server.address}, port ${server.port}');

  var router = new Router(server)
    ..serve(updateClient).listen((HttpRequest){
    print("Entered update client");
  })
    ..serve(display).listen((HttpRequest){
    print("Entered display");
  })
    ..serve(homeUrl2).listen((p){
    // path2
  })
  ..defaultStream.listen((p){

  });

//  await for (HttpRequest request in requestServer) {
//    try {
//      // VARIABLES
//      String url = "..${request.uri.path}".toLowerCase(); // the url of the client request (one level lower)
//      var page = new File('$url'); // file with the given by the client path, later to be checked if exists
//      var queries = new Queries();
//
//      // Handle display requests
//      if(await page.exists()) {
//        if(url.endsWith("display_db.dart")) {
//          // Setting variables
//          httpRequest = await HttpBodyHandler.processRequest(request);
//          resultsUnencoded = httpRequest.body;
//          String table;
//          String column;
//
//          // If the result is not fine
//          if(resultsUnencoded.length == 0) {
//            throw new Exception("Empty request: $resultsUnencoded");
//          }
//          // If the result is fine
//          else {
//            // Sanitize the request
//            resultsUnencoded.replaceAll(new RegExp(r'\(\);\[\]{}%'), (''));
//            // Decode the request
//            resultsDecoded = JSON.decode(resultsUnencoded);
//            table = resultsDecoded['userTable'];
//            column = resultsDecoded['userColumn'];
//          }
//
//          request.response
//            ..headers.contentType = new ContentType('application', 'dart')
//            ..write(await queries.select.selectAllIds(table, column))
//            ..close();
//        }
//      }
//
//      // Handle update requests
//      // if(await page.exists()) { // not needed here
//        if(url.endsWith("update_client")) {
//          httpRequest = await HttpBodyHandler.processRequest(request);
//          resultsUnencoded = httpRequest.body;
//          int id;
//          String value;
//
//          if(resultsUnencoded.length == 0) {
//            throw new Exception("Empty request: $resultsUnencoded");
//          }
//          // If the result is fine
//          else {
//            // Sanitize the request
//            resultsUnencoded.replaceAll(new RegExp(r'\(\);\[\]{}%'), (''));
//            // Decode the request
//            resultsDecoded = JSON.decode(resultsUnencoded);
//            id = resultsDecoded['id'];
//            value = resultsDecoded['value'];
//          }
//
//          var toWrite; // what to be served from the request
//          switch (resultsDecoded['selectValue']) {
//            case "Name":
//              toWrite = await queries.update.updateName(id, value);
//              break;
//            case "Cart_empty_status":
//              toWrite = await queries.update.updateCartStatus(id, value);
//              break;
//            default:
//              toWrite = "Operation unsuccessful";
//          }
//
//          request.response
//          ..headers.contentType = new ContentType('application', 'dart')
//          ..write(toWrite)
//          ..close();
//        }
//      // }
//    }
//    catch(e){
//      print(e); // comment for turning the logging off, TESTY
//      request.response
//      ..headers.contentType = ContentType.TEXT
//      ..statusCode = 503
//      ..write("Bad request")
//      ..close();
//    }
//  }
}