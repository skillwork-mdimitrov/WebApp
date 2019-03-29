// Edit only .ts file
// ******************
/*jslint devel: true*/
/*globals $:false*/
// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. https://stackoverflow.com/questions/6904166/should-i-use-window-variable-or-var
// 2. Fallback for filter
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
var newestClothes = $('#newestClothes');
var cart_sum = $('#cart_sum');
var cart_quantity_text = $('#cart_quantity_text');
var totalToPayText = $('#totalToPayText');
var modalHeader = $('#modalHeader');
var cartContent = $('#cartContent');
var emptyCartImg = $("#emptyCartImg");
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
window.addEventListener('load', function () {
    "use strict";
    getNewestClothes();
    adjustHeight();
    setState("default");
});
$(document).ready(function () {
    "use strict";
    /* Window event listeners
     ========================================================================== */
    window.addEventListener('resize', function () {
        adjustHeight();
    });
    window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
            headContainer.addClass("scrolled");
        }
        if (window.scrollY === 0) {
            headContainer.removeClass("scrolled");
        }
    });
    /* Cart remodal listeners
     ========================================================================== */
    confirmCartBtn.on('click', function () {
        if (currentState === "default") {
            registrationForm(true);
        }
        else if (currentState === "register") {
            console.log("Send registration info");
            // register();
        }
        else if (currentState === "purchase") {
            console.log("Functionality to come");
        }
    });
    /* User events listeners
     ========================================================================== */
    registerUserBtn.on('click', function () {
        registrationForm(false);
    });
    loginUserBtn.on('click', function () {
        repaintForEvent('login');
    });
});
/* HIGHLY RE-USABLE FUNCTIONS
   ========================================================================== */
// Remove element from array by value
var remove = function (array, element) {
    "use strict";
    var value = array.indexOf(element);
    if (value !== -1) {
        array.splice(value, 1);
    }
    return value;
};
// Round a number to the second decimal
var mathRoundToSecond = function (num) {
    "use strict";
    return Math.round(num * 100) / 100;
};
// NEW, PUT IN CLASS, hide from GLOBAL SCOPE, only setState can use those
var defaultState = function () {
    "use strict";
    registerContainer.css('display', 'none'); // check
};
var registerState = function () {
    "use strict";
    registerContainer.css('display', 'flex'); // check
};
/*
* Set the current state
* Note: setState("default") is being used in dist/remodal.min.js on remodal close
* */
var setState = function (state) {
    "use strict";
    switch (state) {
        case "default":
            currentState = "default";
            defaultState();
            break;
        case "purchase":
            currentState = "purchase";
            break;
        case "register":
            currentState = "register";
            registerState();
            break;
    }
    return currentState;
};
var registrationForm = function (comingFromCart) {
    "use strict";
    if (comingFromCart === void 0) { comingFromCart = false; }
    // By default, user is registering, before purchasing items
    // If the user isn't logged in [redundant?]
    if (loggedIn === false) {
        // If it's cart registration, force the user to have at least 1 item in the cart
        if (comingFromCart === true) {
            // Allow the user to register if he has at least 1 item in the cart
            if (cart.orderedItems.length === 0) {
                // was textContent
                totalToPayText.text("Can't go with an empty cart :(");
            }
            else {
                repaintForEvent("register");
                setState("register");
            }
        }
        else if (comingFromCart === false) {
            repaintForEvent("register");
            setState("register");
        }
    }
    else if (loggedIn === true) {
        console.log("functionality to come");
    }
};
var register = function () {
    "use strict";
    console.log("AJAX send register info from forms");
};
/* Recalculate Remodal window height, case of mobile going sideways etc..*/
var adjustHeight = function () {
    // media query parameter
    "use strict";
    // VARIABLES
    // var defaultSize = 0.8;
    viewPortHeight = window.innerHeight;
    // if(typeof mediaQuery === 'undefined' && mediaQuery !== null) {
    //   defaultSize = mediaQuery;
    // }
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
    if (dimmingBlock.height() !== viewPortHeight) {
        dimmingBlock.css('height', viewPortHeight);
    }
};
/* Anchor scroll
   ========================================================================== */
var scrollToAnchor = function (aid) {
    "use strict";
    var aTag = $("a[name='" + aid + "']");
    $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
};
$("#link").click(function () {
    "use strict";
    scrollToAnchor('menuContainer'); // is no longer correct, since header is overlapping with the menuContainer
});
/* Get newest clothes
   ========================================================================== */
var getNewestClothes = function () {
    "use strict";
    try {
        // VARIABLES
        var xhttp = void 0;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (this.readyState === DONE && this.status === OK) {
                newestClothes.html(this.responseText);
            }
        };
        xhttp.open("POST", "/dynamic/newest_clothes", true);
        xhttp.send();
    }
    catch (e) {
        console.log('Caught Exception: ' + e.message);
    }
};
// Unite the login and register events in here
var repaintForEvent = function (event) {
    "use strict";
    // Make the cart clean
    var cleanCart = function (fadeEmptyCart) {
        if (fadeEmptyCart === void 0) { fadeEmptyCart = false; }
        if (cartContent.children.length > 0) {
            for (var i = 0; i < cart.orderedItems.length; i++) {
                cart.removeFromDOM(cart.orderedItems[i], false);
            }
        }
        // Hide the empty cart image
        if (emptyCartImg.css("opacity") === '1' || emptyCartImg.css("opacity") === '') {
            if (fadeEmptyCart === false) {
                emptyCartImg.css("transition", "unset");
                emptyCartImg.css("opacity", "0");
            }
            else {
                emptyCartImg.css("opacity", "0");
            }
        }
    };
    if (event === 'register') {
        // Remodal window is now about Registration
        modalHeader.html('Register');
        cleanCart(false);
    }
    else if (event === 'login') {
        // Remodal window is now about Registration
        modalHeader.html('Login');
        cleanCart(false);
    }
};
/* Effects CLASS
   ========================================================================== */
var Effects = function () {
    "use strict";
    // Blur an element for a brief period
    Effects.prototype.blurElement =
        function (element, selector, afterMilliseconds, forMilliseconds, on_or_off) {
            if (element === void 0) { element = "class"; }
            if (afterMilliseconds === void 0) { afterMilliseconds = 0; }
            if (forMilliseconds === void 0) { forMilliseconds = 1000; }
            var elem;
            /* Element SELECTOR
            ========================================================================== */
            // Select the class to blur
            if (selector === 'class') {
                elem = $('.' + element);
            }
            else if (selector === 'id') {
                elem = $('#' + element);
            }
            else {
                console.log("Expand blurElem() function to accept non id/class selectors");
            }
            /* State
           ========================================================================== */
            if (on_or_off === 'on') {
                // Blur effect, filter is not that well supported
                setTimeout(function () {
                    elem.css({
                        'transition-property': 'filter',
                        'transition-duration': forMilliseconds + 'ms',
                        'transition-timing-function': 'ease',
                        'filter': 'blur(1px)'
                    });
                }, afterMilliseconds);
            }
            else if (on_or_off === 'off') {
                setTimeout(function () {
                    elem.css({
                        'transition-property': 'filter',
                        'transition-duration': forMilliseconds + 'ms',
                        'transition-timing-function': 'ease-out',
                        'filter': 'none'
                    });
                }, afterMilliseconds);
            }
        };
    Effects.prototype.displayElement =
        function (element, selector, afterMilliseconds, forMilliseconds, on_or_off) {
            if (selector === void 0) { selector = "class"; }
            if (afterMilliseconds === void 0) { afterMilliseconds = 0; }
            if (forMilliseconds === void 0) { forMilliseconds = 1000; }
            if (on_or_off === void 0) { on_or_off = "on"; }
            var elem;
            /* Element SELECTOR
           ========================================================================== */
            // Select the class to dim/undim
            if (selector === 'class') {
                elem = $('.' + element);
            }
            else if (selector === 'id') {
                elem = $('#' + element);
            }
            else if (selector === 'tagName') {
                elem = $('' + element);
            }
            else {
                console.log("Expand show() function to accept non id/class selectors");
            }
            /* States
           ========================================================================== */
            if (on_or_off === 'on') {
                setTimeout(function () {
                    elem.css({
                        'transition-property': 'opacity',
                        'transition-duration': forMilliseconds + 'ms',
                        'transition-timing-function': 'ease-in',
                        'visibility': 'visible',
                        'opacity': 0.85
                    });
                }, afterMilliseconds);
            }
            else if (on_or_off === 'off') {
                setTimeout(function () {
                    elem.css({
                        'transition-property': 'opacity, visibility',
                        'transition-duration': forMilliseconds + 'ms',
                        'transition-timing-function': 'ease-out',
                        'opacity': 0,
                        'visibility': 'hidden'
                    });
                }, afterMilliseconds);
            }
        };
};
effects = new Effects();
/* Slideshow CLASS
   ========================================================================== */
var SlideShow = function () {
    "use strict";
    var _this = this;
    this.slideShowImgs = document.getElementsByClassName("mySlides_js"); // used when randomizing the first slide
    this.slideIndex = Math.floor(Math.random() * this.slideShowImgs.length) + 1;
    this.timeNextSlide = 1000; // to reduce later
    this.automaticSlideshow = setInterval(function () {
        slideshow.plusDivs(+1);
    }, this.timeNextSlide);
    SlideShow.prototype.plusDivs = function (n) {
        _this.showDivs(_this.slideIndex += n);
        clearInterval(_this.automaticSlideshow); // stop the timer (done in case the arrows were clicked)
        _this.automaticSlideshow = setInterval(function () { slideshow.plusDivs(+1); }, _this.timeNextSlide); // start a new timer, lazy way
    };
    SlideShow.prototype.showDivs = function (n) {
        var i;
        var slideShowImgs = document.getElementsByClassName("mySlides_js");
        var showElement = function () {
            slideShowImgs[slideshow.slideIndex - 1].style.opacity = '1';
            slideShowImgs[slideshow.slideIndex - 1].style.display = 'visible';
        };
        if (n > slideShowImgs.length) {
            _this.slideIndex = 1;
        }
        if (n < 1) {
            _this.slideIndex = slideShowImgs.length;
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
    var _this = this;
    this.cart_sum = 0; // The sum of the user's currently requested clothes
    this.cart_items_quantity = 0; // How much items are currently in the cart
    this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)
    this.articleContainer = ""; // later defined
    this.articleContainerBtn = ""; // later defined
    var cartTotal = function () {
        totalToPayText.html("Total: " + mathRoundToSecond(cart.cart_sum) + "$");
    };
    // counter articles quantity in the session ??
    Cart.prototype.addToCart = function (articleId, articlePrice) {
        // Effects
        effects.blurElement('basketContainer', 'class', 0, 900, 'on');
        effects.blurElement('basketContainer', 'class', 1150, 900, 'off');
        effects.displayElement('dimmingBlock', 'class', 0, 500, 'on');
        effects.displayElement('dimmingBlock', 'class', 750, 750, 'off');
        _this.cart_sum += articlePrice;
        cart_sum.html(mathRoundToSecond(_this.cart_sum) + "$");
        _this.cart_items_quantity++;
        cart_quantity_text.html("" + _this.cart_items_quantity);
        _this.orderedItems.push(articleId);
    };
    Cart.prototype.sendItemsList = function () {
        if (_this.orderedItems.length !== 0) {
            emptyCartImg.css("opacity", "0"); // fade out the Empty cart image
            try {
                // VARIABLES
                var xhttp = void 0;
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    var DONE = 4; // readyState 4 means the request is done.
                    var OK = 200; // status 200 is a successful return.
                    if (this.readyState === DONE && this.status === OK) {
                        cartContent.html(this.responseText);
                    }
                };
                xhttp.open("POST", "/dynamic/generate_cart", true);
                var orderedItemsJSON = JSON.stringify(_this.orderedItems);
                xhttp.send(orderedItemsJSON);
                cartTotal();
            }
            catch (e) {
                console.log('Caught Exception: ' + e.message);
            }
        }
    };
    Cart.prototype.removeFromDOM = function (id, removeWithTransition) {
        try {
            _this.articleContainer = document.querySelector("#article" + id);
            _this.articleContainerBtn = document.querySelector("#articleBtn" + id);
            _this.articleContainer.removeChild(_this.articleContainerBtn);
            _this.articleContainer.style.opacity = '0';
        }
        catch (e) {
            console.log("Exception caught " + e);
        }
        if (removeWithTransition === true) {
            setTimeout(function () {
                try {
                    cart.articleContainer.remove();
                }
                catch (e) {
                }
            }, 1000);
        }
        else {
            cart.articleContainer.remove();
        }
    };
    Cart.prototype.removeFromCart = function (id, price) {
        remove(_this.orderedItems, id); // remove from the list of ordered items
        _this.cart_items_quantity--;
        _this.cart_sum -= price;
        cart_quantity_text.html("" + _this.cart_items_quantity);
        cart_sum.html(mathRoundToSecond(_this.cart_sum) + "$");
        totalToPayText.html(mathRoundToSecond(_this.cart_sum) + "$");
        _this.removeFromDOM(id, true);
        // If the latest removed item happens to be the last one, show that the cart is empty
        if (_this.orderedItems.length === 0) {
            emptyCartImg.css("opacity", "1"); // has css transition
        }
    };
    basketContainer.on("click", function () {
        cart.sendItemsList(cart.orderedItems);
        modalHeader.html('Cart'); // Remodal is now about the cart
        // if there are no items in the cart show the empty cart images
        if (cart.orderedItems.length === 0) {
            if (emptyCartImg.css("opacity") === '0' || emptyCartImg.css("opacity") === '') {
                emptyCartImg.css("opacity", "1");
            }
        }
        // Determine and set the max-height so the container doesn't spill out of proportions
        adjustHeight();
    });
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
