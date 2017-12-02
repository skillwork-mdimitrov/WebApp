// Copyright (c) 2017, Maksim Dimitrov. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import 'dart:io';
import 'dart:convert';
import 'package:http_server/http_server.dart';
import 'package:route/server.dart';
import 'package:route/url_pattern.dart';
import 'queries/queries.dart';

main() async {
  // Define routes
  final updateClient = new UrlPattern(r'/update_client');
  final displayClients = new UrlPattern(r'/display_clients');
  final newestClothes = new UrlPattern(r'/newest_clothes');
  final generateCart = new UrlPattern(r'/generate_cart');
  Queries db = new Queries(); // quick solution to make sure the connection is open just once
  db.open_connection();

  var server = await HttpServer.bind(InternetAddress.LOOPBACK_IP_V4, 9000);
  print('Listening on ${server.address}, port ${server.port}');

  var router = new Router(server)
    ..serve(updateClient).listen((request) async {
    try {
      var httpRequest = await HttpBodyHandler.processRequest(request);
      var resultsUnencoded = httpRequest.body;
      var queries = new Queries(); // maybe it's not that optimised here
      int id;
      String value;
      String selectValue;

      if (resultsUnencoded.length == 0) {
        throw new Exception("Empty request: $resultsUnencoded");
      }
      // If the result is fine
      else {
        // Sanitize the request
        resultsUnencoded.replaceAll(new RegExp(r'\(\);\[\]{}%'), (''));
        // Decode the request
        var resultsDecoded = JSON.decode(resultsUnencoded);
        id = resultsDecoded['id'];
        value = resultsDecoded['value'];
        selectValue = resultsDecoded['selectValue'];
      }

      var toWrite; // what to be served from the request
      switch (selectValue) {
        case "Name":
          toWrite = await queries.update.updateName(id, value);
          break;
        case "Cart_empty_status": // careful, linked with HTML text value
          toWrite = await queries.update.updateCartStatus(id, value);
          break;
        default:
          toWrite = "Operation unsuccessful";
      }

      request.response
        ..headers.contentType = new ContentType('application', 'dart')
        ..write(toWrite)
        ..close();
    }
    catch(e){
      print(e); // comment for turning the logging off
      request.response
      ..headers.contentType = ContentType.TEXT
      ..statusCode = 503
      ..write("Failed to update. Bad request")
      ..close();
    }
  })

    ..serve(generateCart).listen((request) async {
    try {
      Queries queries = new Queries();
      var httpRequest = await HttpBodyHandler.processRequest(request);
      List<Map> cartItemsList = new List<Map>();
      String requestBody = httpRequest.body;
      var requestBodyJSON = JSON.decode(requestBody); // makes the request type a list

      String clothesPath = "images/clothes";
      String toWrite = "";

      for(var elem in requestBodyJSON) {
        cartItemsList.add(await queries.select.clothesInTheCart(elem));
      }

      for(var elem in cartItemsList) {
        print(elem);
//        toWrite +=
//        '''
//        <div class="articleContainer">
//        <div class="articleImageContainer">
//          <div class="articleImageScaled">
//            <img src="images/clothes/hoodie_jacket.png" alt="Jordan Jacket" class="articleImage">
//          </div>
//        </div>
//        <div class="articleInformation">
//          <div class="general">
//            <p>Jordan Jacket</p>
//            <p>17.99</p>
//          </div>
//          <div class="quantity">
//            <p class="colorBlack">x1</p>
//          </div>
//        </div>
//      </div>
//      ''';
      }


      // If there are no items in the cart
//      if (requestBody.length == 0) {
//        requestBody = "No clothes in the cart";
//      }

      request.response
        ..headers.contentType = new ContentType('application', 'dart')
        ..write("hey")
        ..close();
    }
    catch(e){
      print(e); // comment for turning the logging off
      request.response
        ..headers.contentType = ContentType.TEXT
        ..statusCode = 503
        ..write("Failed to generate the cart in such a way. Bad request")
        ..close();
    }
  })

    ..serve(newestClothes).listen((request) async {
      try {
        Queries queries = new Queries();
        List<Map> jacketsList = await queries.select.newestClothes();
        String toWrite = "";
        String clothesPath = "images/clothes";

        for(var element in jacketsList) {
          toWrite +=
          '''
            <div class="newClothesContainer">
            <img src="images/add_to_basket.png" alt="addToBasket" id="addToBasket" onclick="cart.addToCart(${element['id']}, ${element['price']})">
              <div class="newClothesImage">
                <div class="newClothesImageScaled">
                  <img class="object-fit-cover" src="$clothesPath/${element['filename']}" alt="${element['name']}">
                </div>
              </div>
              <div class="newClothesInfo">
                <p>${element['name']}</p>
                <p>${element['price']}\$</p>
              </div>
            </div>
          ''';
        }

        request.response
          ..headers.contentType = ContentType.HTML
          ..write(toWrite)
          ..close();
      }
      catch(e){
        print(e); // comment for turning the logging off
        request.response
          ..headers.contentType = ContentType.TEXT
          ..statusCode = 503
          ..write("Failed to display newest clothes. Bad request")
          ..close();
      }
    })

  ..defaultStream.listen((request){
    request.response
    ..headers.contentType = ContentType.TEXT
    ..statusCode = 503
    ..write("Bad request")
    ..close();
  });
}