/*jslint devel: true*/
/*globals $:false*/

// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. Fallback for filter
// 3. When calling global variables, include window
// 3. Move different modules to different classes, maybe use require.js
// 3. On hover of the slideshow don't go next

/* GLOBAL VARIABLES
   ========================================================================== */
// manipulated with jQuery
var headContainer = $('#headContainer');
var basketContainer = $('.basketContainer');
var dimmingBlock = $('.dimmingBlock');
var remodalContainer = $('.remodal');
var cartArticlesContainer = $('.cartArticlesContainer');
var remodalWrapper = $('.remodalWrapper');
var confirmCartBtn = $('.remodal-confirm');
var registerUserBtn = $('#registerUserBtn');
var loginUserBtn = $('#loginUserBtn');
var registerContainer = $('.registerUserContainer');

// manipulated with vanilla JavaScript
var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var newestClothes = document.getElementById("newestClothes");
var cart_sum = document.getElementById("cart_sum");
var cart_quantity_text = document.getElementById("cart_quantity_text");
var cartContent = document.getElementById("cartContent");
var totalToPayText = document.getElementById("totalToPayText");
var emptyCartImg = document.getElementById('emptyCartImg');
var modalHeader = document.getElementById('modalHeader');

// used anywhere
var viewPortHeight = window.innerHeight; // to be later re-calculated
var cart; // to be later instantiated as Cart object
var slideshow; // to be later instantiated as Slideshow object
var effects; // to be later instantiated as Effects object
var currentState = "default"; // default state
var loggedIn = false; // false by default

/* Event listeners
   ========================================================================== */

// ON LOAD
window.addEventListener('load', function() {
  "use strict";
  getNewestClothes();
  adjustHeight();
  setState("default");
});

$(document).ready(function() {
  "use strict";

  /* Window event listeners
   ========================================================================== */
  window.addEventListener('resize', function() {
    adjustHeight();
  });

  window.addEventListener('scroll', function() {
    if(window.scrollY > 0) {
      headContainer.addClass("scrolled");
    }
    if(window.scrollY === 0) {
      headContainer.removeClass("scrolled");
    }
  });

  /* Cart remodal listeners
   ========================================================================== */
  confirmCartBtn.on('click', function() {
    if(loggedIn === false) {
      // Allow the user to register if he has at least 1 item in the cart
      if(cart.orderedItems.length === 0) {
        totalToPayText.textContent = "Can't go with an empty cart :(";
      }
      else {
        repaintForEvent("register");
        setState("register");
      }
    }
    else if(loggedIn === true) {

    }
  });

  /* User events listeners
   ========================================================================== */
  registerUserBtn.on('click', function() {
    if(loggedIn === false) {
      repaintForEvent('register');
      setState("register");
    }
  });

  loginUserBtn.on('click', function() {
    repaintForEvent('login');
  });

});

/* HIGHLY RE-USABLE FUNCTIONS
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

/*
* Set the current state
* Note: setState("default") is being used in dist/remodal.min.js on remodal close
* */
function setState(state) {
  "use strict";
  switch(state) {
    case "default":
      currentState = "default";
      defaultState();
    break;
    case "register":
      currentState = "register";
      registerState();
    break;
  }
}

// NEW, PUT IN CLASS, hide from GLOBAL SCOPE, only setState can use those
function defaultState() {
  "use strict";
  registerContainer.css('display', 'none'); // check
}

//
function registerState() {
  "use strict";
  registerContainer.css('display', 'flex'); // check
}

/* Recalculate Remodal window height, case of mobile going sideways etc..*/
function adjustHeight(mediaQuery) {
  "use strict";
  // VARIABLES
  var defaultSize = 0.8;
  viewPortHeight = window.innerHeight;

  if(typeof mediaQuery === 'undefined' && mediaQuery !== null) {
    defaultSize = mediaQuery;
  }

  /* Remodal container
   ========================================================================== */
  // Determine and set the height so the container doesn't spill out of proportions
  var remodalContent = viewPortHeight * 0.8; // 80% of the view-port
  var remodalContentPx = remodalContent + 'px';

  var wrapperContent = remodalContent * 0.95; // 5% less than the remodal container
  var wrapperContentPx = wrapperContent + 'px';

  var articleContent = wrapperContent * 0.77; // 20% less than the remodal container
  var articleContentPx = articleContent + 'px';

  remodalContainer.css('height', remodalContentPx);
  cartArticlesContainer.css('height', articleContentPx);
  cartArticlesContainer.css('overflow-y', 'auto'); // hides the scroll if it's unnecessary
  remodalWrapper.css('height', wrapperContentPx);
  remodalWrapper.css('overflow', 'hidden');

  /* Dimming block
   ========================================================================== */
  if(dimmingBlock.height() !== viewPortHeight) {
    dimmingBlock.css('height', viewPortHeight);
  }
}

/* Anchor scroll
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

/* Get newest clothes
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

// Unite the login and register events in here
function repaintForEvent(event) {
  "use strict";
  if(event === 'register') {
    // Remodal window is now about Registration
    modalHeader.innerHTML = 'Register';

    cleanCart();

    /*
      Create div
      Style the div (doesn't apply until created)
      Append the div in the modal container
     */
  }

  else if(event === 'login') {
    // Remodal window is now about Registration
    modalHeader.innerHTML = 'Login';

    cleanCart();
  }

  // Make the cart clean
  function cleanCart(fadeEmptyCart) {
    // By default, don't fade the empty cart image
    var fadeEmptyCartField = false;
    // If argument is passed, overwrite the default
    if(typeof fadeEmptyCart !== 'undefined' && fadeEmptyCart === null) {
      fadeEmptyCartField = fadeEmptyCart;
    }

    if(cartContent.children.length > 0) {
      for (var i = 0; i < cart.orderedItems.length; i++) {
        cart.removeFromDOM(cart.orderedItems[i], false);
      }
    }

    // Hide the empty cart image
    if(emptyCartImg.style.opacity === '1' || emptyCartImg.style.opacity === '') {
      if(fadeEmptyCartField === false) {
        emptyCartImg.style.transition = "unset";
        emptyCartImg.style.opacity = '0';
      }
      else {
        emptyCartImg.style.opacity = '0';
      }
    }
  }
}

/* Register window
   ========================================================================== */
var registerUser = function() {
  "use strict";

};

/* Effects CLASS
   ========================================================================== */
var Effects = function() {
  "use strict";
  // Blur an element for a brief period
  Effects.prototype.blurElement = function (element, selector, afterMilliseconds, forMilliseconds, on_or_off) {
    /* VARIABLES
   ========================================================================== */
    var state = 'on';
    var elem = "";
    var afterTime = 0; // immediately blur, by default
    var forTime = 1000; // blur for a second, by default

    /* Element SELECTOR
   ========================================================================== */
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

    /* Method arguments
   ========================================================================== */
    // Delay before the blur
    if(typeof afterMilliseconds !== 'undefined' && afterMilliseconds !== null) {
      afterTime = afterMilliseconds;
    }
    // Duration of the blur
    if(typeof forMilliseconds !== 'undefined' && forMilliseconds === null) {
      forTime = forMilliseconds;
    }
    // Dim or undim the element
    if(typeof forMilliseconds !== 'undefined' && afterMilliseconds !== null) {
      state = on_or_off;
    }

    /* State
   ========================================================================== */
    if(state === 'on') {
    // Blur effect, filter is not that well supported
    setTimeout(function() {
        elem.css({
          'transition-property': 'filter',
          'transition-duration': forTime + 'ms',
          'transition-timing-function': 'ease',
          'filter': 'blur(1px)'
        });
      }, afterTime);
    }
    else if(state === 'off') {
      setTimeout(function() {
        elem.css({
          'transition-property': 'filter',
          'transition-duration': forTime + 'ms',
          'transition-timing-function': 'ease-out',
          'filter': 'none'
        });
      }, afterTime);
    }
  };

  Effects.prototype.displayElement = function(element, selector, afterMilliseconds, forMilliseconds, on_or_off) {
    var state = 'on'; // dim, by default
    var elem = "";
    var afterTime = 0; // immediately dim, default
    var forTime = 1000; // dim it for a second, default

    /* Element SELECTOR
   ========================================================================== */
    // Select the class to dim/undim
    if(selector === 'class') {
      elem = $('.' +element);
    }
    // Select the id element to dim/undim
    else if(selector === 'id') {
      elem = $('#' +element);
    }
    // Select the element by tag name to dim/undim
    else if(selector === 'tagName') {
      elem = $('' +element);
    }
    // Element couldn't be selected, expand
    else {
      console.log("Expand show() function to accept non id/class selectors");
    }

    /* Method arguments
   ========================================================================== */
    // Delay before the dim/undim
    if(typeof afterMilliseconds !== 'undefined' && afterMilliseconds !== null) {
      afterTime = afterMilliseconds;
    }

    // Duration of the dim/undim
    if(typeof forMilliseconds !== 'undefined' && afterMilliseconds !== null) {
      forTime = forMilliseconds;
    }

    // Dim or undim the element
    if(typeof forMilliseconds !== 'undefined' && afterMilliseconds !== null) {
      state = on_or_off;
    }

    /* States
   ========================================================================== */
    if(state === 'on') {
      setTimeout(function() {
        elem.css({
          'transition-property': 'opacity',
          'transition-duration': forTime + 'ms',
          'transition-timing-function': 'ease-in',
          'visibility': 'visible',
          'opacity': 0.85
        });
      }, afterTime);
    }
    else if(state === 'off') {
      setTimeout(function() {
        elem.css({
          'transition-property': 'opacity, visibility',
          'transition-duration': forTime + 'ms',
          'transition-timing-function': 'ease-out',
          'opacity': 0,
          'visibility': 'hidden'
        });
      }, afterTime);
    }
  };
};
effects = new Effects();

/* Slideshow CLASS
   ========================================================================== */
var SlideShow = function() {
  "use strict";
  this.slideShowImgs = document.getElementsByClassName("mySlides_js"); // used when randomizing the first slide
  this.slideIndex = Math.floor(Math.random() * this.slideShowImgs.length) + 1;
  this.timeNextSlide = 90000; // to reduce later
  this.automaticSlideshow = setInterval(
      function (){
        slideshow.plusDivs(+1);
      },
      this.timeNextSlide
  );

  SlideShow.prototype.plusDivs = function(n) {
    this.showDivs(this.slideIndex += n);
    clearInterval(this.automaticSlideshow); // stop the timer (done in case the arrows were clicked)
    this.automaticSlideshow = setInterval(function(){slideshow.plusDivs(+1);}, this.timeNextSlide); // start a new timer, lazy way
  };

  SlideShow.prototype.showDivs = function(n) {
    var i;
    var slideShowImgs = document.getElementsByClassName("mySlides_js");

    function showElement() {
      slideShowImgs[slideshow.slideIndex -1].style.opacity = '1';
      slideShowImgs[slideshow.slideIndex -1].style.display = 'visible';
    }

    if (n > slideShowImgs.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slideShowImgs.length;
    }
    for (i = 0; i < slideShowImgs.length; i++) {
      slideShowImgs[i].style.opacity = '0';
      slideShowImgs[i].style.display = 'hidden';
    }
    setTimeout(showElement(), 3500);
  };

};
slideshow = new SlideShow();
slideshow.showDivs(slideshow.slideIndex);

/* Cart class
   ========================================================================== */
var Cart = function () {
  "use strict";
  this.cart_sum = 0; // The sum of the user's currently requested clothes
  this.cart_items_quantity = 0; // How much items are currently in the cart
  this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)
  this.articleContainer = ""; // later defined
  this.articleContainerBtn = ""; // later defined

  // counter articles quantity in the session ??
  Cart.prototype.addToCart = function (articleId, articlePrice) {

    // Effects
    effects.blurElement('basketContainer', 'class', 0, 900, 'on');
    effects.blurElement('basketContainer', 'class', 1150, 900, 'off');
    effects.displayElement('dimmingBlock', 'class', 0, 500, 'on');
    effects.displayElement('dimmingBlock', 'class', 750, 750, 'off');

    this.cart_sum += articlePrice;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum) + "$";
    this.cart_items_quantity++;
    cart_quantity_text.innerHTML = "" + this.cart_items_quantity;

    this.orderedItems.push(articleId);
  };

  Cart.prototype.sendItemsList = function () {
    if (this.orderedItems.length !== 0) {
      emptyCartImg.style.opacity = '0'; // fade out the Empty cart image
      try {
        // VARIABLES
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          var DONE = 4; // readyState 4 means the request is done.
          var OK = 200; // status 200 is a successful return.
          if (this.readyState === DONE && this.status === OK) {
            cartContent.innerHTML = this.responseText;
          }
        };
        xhttp.open("POST", "/dynamic/generate_cart", true);
        var orderedItemsJSON = JSON.stringify(this.orderedItems);
        xhttp.send(orderedItemsJSON);
        cartTotal();
      }
      catch (e) {
        console.log('Caught Exception: ' + e.message);
      }
    }
  };

  Cart.prototype.removeFromCart = function (id, price) {
    remove(this.orderedItems, id); // remove from the list of ordered items

    this.cart_items_quantity--;
    this.cart_sum -= price;
    cart_quantity_text.innerHTML = "" + this.cart_items_quantity;
    cart_sum.innerHTML = mathRoundToSecond(this.cart_sum) + "$";
    totalToPayText.innerHTML = mathRoundToSecond(this.cart_sum) + "$";

    this.removeFromDOM(id, true);

    // If the latest removed item happens to be the last one, show that the cart is empty
    if (this.orderedItems.length === 0) {
      emptyCartImg.style.opacity = '1'; // has css transition
    }
  };

  Cart.prototype.removeFromDOM = function (id, removeWithTransition) {
    try {
      this.articleContainer = document.getElementById('article' + id);
      this.articleContainerBtn = document.getElementById('articleBtn' + id);
      this.articleContainer.removeChild(this.articleContainerBtn);
      this.articleContainer.style.opacity = '0';
    }
    catch (e) {

    }

    if(removeWithTransition === true) {
      setTimeout(function () {
        try {
          cartContent.removeChild(cart.articleContainer);
        }
        catch (e) {

        }
      }, 1000);
    }
    else {
      cartContent.removeChild(cart.articleContainer);
    }
  };

  basketContainer.on("click", function () {
    cart.sendItemsList(cart.orderedItems);
    modalHeader.innerHTML = 'Cart'; // Remodal is now about the cart
    // if there are no items in the cart show the empty cart images
    if(cart.orderedItems.length === 0) {
      if(emptyCartImg.style.opacity === '0' || emptyCartImg.style.opacity === '') {
        emptyCartImg.style.opacity = '1';
      }
    }

    // Determine and set the max-height so the container doesn't spill out of proportions
    adjustHeight();
  });

  function cartTotal() {
    totalToPayText.innerHTML = "Total: " + mathRoundToSecond(cart.cart_sum) + "$";
  }
};
cart = new Cart();

/* Additions

// require(['Cart']  ,function(c){
//   "use strict";
//   c
// });

//var CartModule = (function() {

//  return {
//    cart : Cart
//  };
//}());

//cart = new CartModule.cart();

*/
