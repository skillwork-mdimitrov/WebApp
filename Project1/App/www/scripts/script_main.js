/*jslint devel: true*/

// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. JS Architecture

// GLOBAL VARIABLES
var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var newestClothes = document.getElementById("newestClothes");
var cart_sum_button = document.getElementById("cart_sum");
var cart_quantity_text = document.getElementById("cart_quantity_text");

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


var cart_sum = 0; // The sum of the user's currently requested clothes
var cart_sum_rounded = 0; // Will store the rounded version of the cart_sum
var cart_items_quantity = 0; // How much items are currently in the cart
// counter articles quantity in the session
function addToCart(articleId, articlePrice) {
  "use strict";
  cart_sum += articlePrice;
  cart_sum_rounded = Math.round(cart_sum * 100) / 100; // hacky solution, 2 decimals after the dot
  cart_sum_button.innerHTML = cart_sum_rounded  + "$";
  cart_items_quantity++;
  cart_quantity_text.innerHTML = cart_items_quantity;
}

/* Show cart contents _START */

$("#go_to_cart_btn").click(function(){
  "use strict";

});