/*jslint devel: true*/

// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. Change the default db user
// 2. Fallback for filter

/* GLOBAL VARIABLES
   ========================================================================== */

var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var headContainer = $('#headContainer');
var goToCartButton = $('.basketContainer');
var newestClothes = document.getElementById("newestClothes");
var cart_sum = document.getElementById("cart_sum");
var cart_quantity_text = document.getElementById("cart_quantity_text");
var cartContent = document.getElementById("cartContent");
var totalToPayText = document.getElementById("totalToPayText");
var remodalContainer = document.getElementsByClassName('remodal');
var cartArticlesContainer = document.getElementsByClassName('cartArticlesContainer');
var cartWrapper = document.getElementsByClassName('cartWrapper');
var emptyCartImg = document.getElementById('emptyCartImg');

var cart; // to be later instantiated as cart object
var slideshow; // to be later instantiated as slideshow object

/* GLOBAL FUNCTIONS
   ========================================================================== */

// Remove element from array by value
function remove(array, element) {
  "use strict";
  var value = array.indexOf(element);

  if (value !== -1) {
    array.splice(value, 1);
  }
}

// Round a number to the second decimal
function mathRoundToSecond(num) {
  "use strict";
  var result;
  result = Math.round(num * 100) / 100;
  return result;
}

// Make effects class I guess

// Blur an element for a brief period
function blurElement(element, selector, afterMilliseconds, forMilliseconds) {
  "use strict";
  // VARIABLES
  var elem = "";
  var afterTime = 0; // immediately blur
  var forTime = 1000; // blur for a second

  // Select the class to blur
  if(selector === 'class') {
    elem = $('.' +element);
  }
  // Select the id element to blur
  else if(selector === 'id') {
    elem = $('#' +element);
  }
  // Element couldn't be selected, expand
  else {
    console.log("Expand blurElem() function to accept non id/class selectors");
  }

  // Delay before the blur
  if(afterMilliseconds !== 'undefined') {
    afterTime = afterMilliseconds;
  }

  // Duration of the blur
  if(forMilliseconds !== 'undefined') {
    forTime = forMilliseconds;
  }

  // Blur effect, filter is that well support
  setTimeout(function() {
    elem.css({
    'transition-property': 'all',
    'transition-duration': forMilliseconds + 'ms',
    'transition-timing-function': 'ease',
    'opacity': '0'
    });
  }, afterMilliseconds);
}

// Unblur element
function unblurElement(element, selector, afterMilliseconds, forMilliseconds) {
  "use strict";
  // VARIABLES
  var elem = "";
  var afterTime = 0; // immediately unblur
  var forTime = 1000; // unblur for a second

  // Select the class to unblur
  if(selector === 'class') {
    elem = $('.' +element);
  }
  // Select the id element to unblur
  else if(selector === 'id') {
    elem = $('#' +element);
  }
  // Element couldn't be selected, expand
  else {
    console.log("Expand blurElem() function to accept non id/class selectors");
  }

  // Delay before the unblur
  if(afterMilliseconds !== 'undefined') {
    afterTime = afterMilliseconds;
  }

  // Duration of the unblur
  if(forMilliseconds !== 'undefined') {
    forTime = forMilliseconds;
  }

  // Unblur effect
  setTimeout(function() {
    elem.css({
    'transition-property': 'all',
    'transition-duration': forMilliseconds + 'ms',
    'transition-timing-function': 'ease-out',
    'opacity': '1'
    });
  }, afterMilliseconds);
}

function adjustRemodalHeight(mediaQuery) {
  "use strict";
  var defaultSize = 0.8;
  if(mediaQuery === 'undefined') { // check if 'undefined' is same as undefined
    defaultSize = mediaQuery;
  }
  // Determine and set the height so the container doesn't spill out of proportions
  var remodalContent = window.innerHeight * 0.8; // 80% of the view-port
  var remodalContentPx = remodalContent + 'px';

  var wrapperContent = remodalContent * 0.95; // 5% less than the remodal container
  var wrapperContentPx = wrapperContent + 'px';

  var articleContent = wrapperContent * 0.77; // 20% less than the remodal container
  var articleContentPx = articleContent + 'px';

  $(remodalContainer).css('height', remodalContentPx);
  $(cartArticlesContainer).css('height', articleContentPx);
  $(cartArticlesContainer).css('overflow-y', 'auto'); // hides the scroll if it's unnecessary
  $(cartWrapper).css('height', wrapperContentPx);
  $(cartWrapper).css('overflow', 'hidden');
}

/* Slideshow CLASS
   ========================================================================== */

var SlideShow = function() {
  "use strict";
  this.slideIndex = 1;
  this.automaticSlideshow = setInterval(
    function (){
      slideshow.plusDivs(+1);
    },
    900000 // reduce later
  );

  SlideShow.prototype.plusDivs = function(n) {
    this.showDivs(this.slideIndex += n);
    // clearInterval(this.automaticSlideshow); // stop the timer (done in case the arrows were clicked)
    clearInterval(this.automaticSlideshow); // stop the timer (done in case the arrows were clicked)
    this.automaticSlideshow = setInterval(function(){slideshow.plusDivs(+1);}, 900000); // start a new timer, lazy way
  };

  SlideShow.prototype.showDivs = function(n) {
    var i;
    var slideShowImgs = document.getElementsByClassName("mySlides_js");

    function showElement() {
      slideShowImgs[slideshow.slideIndex -1].style.opacity = 1;
      slideShowImgs[slideshow.slideIndex -1].style.display = 'visible';
    }

    if (n > slideShowImgs.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slideShowImgs.length;
    }
    for (i = 0; i < slideShowImgs.length; i++) {
      slideShowImgs[i].style.opacity = 0;
      slideShowImgs[i].style.display = 'hidden';
    }
    setTimeout(showElement(), 3500);
  };

};
slideshow = new SlideShow();
slideshow.showDivs(slideshow.slideIndex);

/* Anchor scroll START
   ========================================================================== */

function scrollToAnchor(aid){
  "use strict";
  var aTag = $("a[name='"+ aid +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#link").click(function() {
  "use strict";
  scrollToAnchor('menuContainer'); // is no longer correct, since header is overlapping with the menuContainer
});

/* Anchor scroll END
   ========================================================================== */

/* Get newest clothes START
   ========================================================================== */

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

/* Get newest clothes END
   ========================================================================== */

/* Cart class START
   ========================================================================== */

var Cart = function() {
  "use strict";
  this.cartContent = document.getElementById('cartContent');
  this.cart_sum = 0; // The sum of the user's currently requested clothes
  this.cart_items_quantity = 0; // How much items are currently in the cart
  this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)
  this.articleContainer = ""; // later defined
  this.articleContainerBtn = ""; // later defined

  // counter articles quantity in the session
  Cart.prototype.addToCart = function (articleId, articlePrice) {

    blurElement('basketContainer', 'class', 0, 500);
    setTimeout(function() {
      unblurElement('basketContainer', 'class', 0);
    }, 500);

    this.cart_sum += articlePrice;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum)  + "$";
    this.cart_items_quantity++;
    cart_quantity_text.innerHTML = this.cart_items_quantity;

    this.orderedItems.push(articleId);

  };

  Cart.prototype.sendItemsList = function () {
    if(this.orderedItems.length !== 0) {
      emptyCartImg.style.opacity = 0; // fade the Empty cart image
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
    remove(this.orderedItems, id); // remove from the list of ordered items

    this.cart_items_quantity--;
    this.cart_sum -= price;

    cart_quantity_text.innerHTML = this.cart_items_quantity;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum) + "$";
    totalToPayText.innerHTML = mathRoundToSecond(this.cart_sum) + "$";

    this.removeFromDOM(id);

    // If the latest removed item happens to be the last one, show that the cart is empty
    if(this.orderedItems.length === 0) {
      emptyCartImg.style.opacity = '1'; // has css transition
    }
  };

  Cart.prototype.removeFromDOM = function(id) {
    this.articleContainer = document.getElementById('article' + id);
    this.articleContainerBtn = document.getElementById('articleBtn' + id);
    this.articleContainer.removeChild(this.articleContainerBtn);
    this.articleContainer.style.opacity = '0';
    setTimeout(function(){
      try {
        cart.cartContent.removeChild(cart.articleContainer);
      }
      catch(e) {

      }
    },
    1000);
  };

  $("body").on("click", ".basketContainer", function () {
    cart.sendItemsList(cart.orderedItems);

    // Determine and set the max-height so the container doesn't spill out of proportions
    adjustRemodalHeight();

  });

  function cartTotal() {
    totalToPayText.innerHTML = "Total: " + mathRoundToSecond(cart.cart_sum) + "$";
  }
};
cart = new Cart();

/* Cart class END
   ========================================================================== */

$(document).ready(function() {
  "use strict";
  window.addEventListener('scroll',function() {
    if(window.scrollY > 0) {
      headContainer.addClass("scrolled");
    }
    if(window.scrollY === 0) {
      headContainer.removeClass("scrolled");
    }
  });
});

