/*jslint devel: true*/

// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. JS Architecture
// 2. Change the default db user

// GLOBAL VARIABLES
var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var newestClothes = document.getElementById("newestClothes");
var cart_sum = document.getElementById("cart_sum");
var cart_quantity_text = document.getElementById("cart_quantity_text");
var cartContent = document.getElementById("cartContent");
var totalToPayText = document.getElementById("totalToPayText");
var cart; // to be later a cart object

// GLOBAL functions

// Remove element from array
function remove(array, element) {
  "use strict";
  var index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

// Round a number to the second decimal
function mathRoundToSecond(num) {
  "use strict";
  var result;
  result = Math.round(num * 100) / 100;
  return result;
}



// Slide show START

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  "use strict";
  showDivs(slideIndex += n);
}

function showDivs(n) {
  "use strict";
  var i;
  var x = document.getElementsByClassName("mySlides_js");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "";
}

// Slide show END

// Anchor scroll START

function scrollToAnchor(aid){
  "use strict";
  var aTag = $("a[name='"+ aid +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#link").click(function() {
  "use strict";
  scrollToAnchor('menuContainer');
});

// Anchor scroll END

/* Get newest clothes *START* */

function getNewestClothes() {
  "use strict";
  try {
    // VARIABLES
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (this.readyState === DONE && this.status === OK) {
        // document.getElementById("textToBeChanged").innerHTML = this.responseText // check this
        newestClothes.innerHTML = this.responseText;
      }
    };
    xhttp.open("POST", "/dynamic/newest_clothes",  true);
    xhttp.send();
  }
  catch(e) {
    console.log('Caught Exception: ' + e.message);
  }
}
/* SHOW INFO FROM DB *END* */

var Cart = function() {
  "use strict";
  this.cart_sum = 0; // The sum of the user's currently requested clothes
  this.cart_items_quantity = 0; // How much items are currently in the cart
  this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)

  // counter articles quantity in the session
  Cart.prototype.addToCart = function (articleId, articlePrice) {
    this.cart_sum += articlePrice;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum)  + "$";
    this.cart_items_quantity++;
    cart_quantity_text.innerHTML = this.cart_items_quantity;

    this.orderedItems.push(articleId);
  };

  Cart.prototype.sendItemsList = function () {
    if(this.orderedItems.length !== 0) {
      try {
        // VARIABLES
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          var DONE = 4; // readyState 4 means the request is done.
          var OK = 200; // status 200 is a successful return.
          if (this.readyState === DONE && this.status === OK) {
            cartContent.innerHTML = this.responseText;
          }
        };
        xhttp.open("POST", "/dynamic/generate_cart",  true);
        var orderedItemsJSON = JSON.stringify(this.orderedItems);
        xhttp.send(orderedItemsJSON);
        cartTotal();
      }
      catch(e) {
        console.log('Caught Exception: ' + e.message);
      }
    }
  };

  Cart.prototype.removeFromCart = function(id, price) {
    remove(this.orderedItems, id);

    this.cart_items_quantity--;
    this.cart_sum -= price;

    cart_quantity_text.innerHTML = this.cart_items_quantity;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum) + "$";
    totalToPayText.innerHTML = mathRoundToSecond(this.cart_sum) + "$";
  };

  $("#go_to_cart_btn").click(function(){
    cart.sendItemsList(cart.orderedItems);
  });

  function cartTotal() {
    totalToPayText.innerHTML = "Total: " + mathRoundToSecond(cart.cart_sum) + "$";
  }
};
cart = new Cart();

/* Show cart contents _START */

