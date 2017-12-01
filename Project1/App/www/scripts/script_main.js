/*jslint devel: true*/

// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. JS Architecture
// 2. Change the default db user

// GLOBAL VARIABLES
var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var newestClothes = document.getElementById("newestClothes");
var cart_sum_button = document.getElementById("cart_sum");
var cart_quantity_text = document.getElementById("cart_quantity_text");
var cart; // to be later a cart object

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
  this.cart_sum_rounded = 0; // Will store the rounded version of the cart_sum
  this.cart_items_quantity = 0; // How much items are currently in the cart

  // counter articles quantity in the session
  Cart.prototype.addToCart = function (articleId, articlePrice) {
    this.cart_sum += articlePrice;
    this.cart_sum_rounded = Math.round(this.cart_sum * 100) / 100; // hacky solution, 2 decimals after the dot
    cart_sum_button.innerHTML = this.cart_sum_rounded  + "$";
    this.cart_items_quantity++;
    cart_quantity_text.innerHTML = this.cart_items_quantity;
  };
};
cart = new Cart();

/* Show cart contents _START */

// Consider removing
$("#go_to_cart_btn").click(function(){
  "use strict";

});