"use strict";
/*jslint devel: true*/
/*globals $, setState, cart:false*/
Object.defineProperty(exports, "__esModule", { value: true });
// Issues
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. https://stackoverflow.com/questions/6904166/should-i-use-window-variable-or-var
// 2. Fallback for filter
// 3. On hover of the slideshow don't go next
// @TODO Make AJAX calls jQuery
var Effects_1 = require("./modules/Effects");
var SlideShow_1 = require("./modules/SlideShow");
var Math_1 = require("./modules/Math");
var Array_1 = require("./modules/Array");
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
var prevSlideBtn = $("#prevSlideBtn");
var nextSlideBtn = $("#nextSlideBtn");
// used anywhere
var viewPortHeight = window.innerHeight; // to be later re-calculated
var currentState = "default"; // default state
var loggedIn = false; // false by default
/* Event listeners
   ========================================================================== */
// ON LOAD
$(window).on('load', function () {
    getNewestClothes();
    adjustHeight();
    setState("default");
});
$(document).ready(function () {
    SlideShow_1.slideshow.showDivs(SlideShow_1.slideshow.slideIndex);
    /* Window event listeners
     ========================================================================== */
    $(window).on('resize', function () {
        adjustHeight();
    });
    $(window).on('scroll', function () {
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
    prevSlideBtn.on('click', function () {
        SlideShow_1.slideshow.plusDivs(-1);
    });
    nextSlideBtn.on('click', function () {
        SlideShow_1.slideshow.plusDivs(+1);
    });
});
// NEW, PUT IN CLASS, hide from GLOBAL SCOPE, only setState can use those
var defaultState = function () {
    registerContainer.css('display', 'none'); // check
};
var registerState = function () {
    registerContainer.css('display', 'flex'); // check
};
/*
* Set the current state
* Note: setState("default") is being used in dist/remodal.min.js on remodal close
* */
// @ts-ignore - Attached to the window object because used as a global - Browserify issue
window.setState = function (state) {
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
    // By default, user is registering, before purchasing items
    if (comingFromCart === void 0) { comingFromCart = false; }
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
    console.log("AJAX send register info from forms");
};
/* Recalculate Remodal window height, case of mobile going sideways etc..*/
var adjustHeight = function () {
    // media query parameter
    // VARIABLES
    // var defaultSize = 0.8;
    var viewPortHeight = window.innerHeight;
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
    var aTag = $("a[name='" + aid + "']");
    $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
};
$("#link").click(function () {
    scrollToAnchor('menuContainer'); // is no longer correct, since header is overlapping with the menuContainer
});
/* Get newest clothes
   ========================================================================== */
var getNewestClothes = function () {
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
        modalHeader.text('Register');
        cleanCart(false);
    }
    else if (event === 'login') {
        // Remodal window is now about Registration
        modalHeader.text('Login');
        cleanCart(false);
    }
};
/* Cart class
   ========================================================================== */
var Cart = function () {
    var _this = this;
    this.cart_sum = 0; // The sum of the user's currently requested clothes
    this.cart_items_quantity = 0; // How much items are currently in the cart
    this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)
    this.articleContainer = ""; // later defined
    this.articleContainerBtn = ""; // later defined
    var cartTotal = function () {
        totalToPayText.text("Total: " + Math_1.mathRoundToSecond(cart.cart_sum) + "$");
    };
    // counter articles quantity in the session ??
    Cart.prototype.addToCart = function (articleId, articlePrice) {
        // Effects
        Effects_1.effects.blurElement('basketContainer', 'class', 0, 900, 'on');
        Effects_1.effects.blurElement('basketContainer', 'class', 1150, 900, 'off');
        Effects_1.effects.displayElement('dimmingBlock', 'class', 0, 500, 'on');
        Effects_1.effects.displayElement('dimmingBlock', 'class', 750, 750, 'off');
        _this.cart_sum += articlePrice;
        cart_sum.text(Math_1.mathRoundToSecond(_this.cart_sum) + "$");
        _this.cart_items_quantity++;
        cart_quantity_text.text("" + _this.cart_items_quantity);
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
        Array_1.removeFromArr(_this.orderedItems, id); // remove from the list of ordered items
        _this.cart_items_quantity--;
        _this.cart_sum -= price;
        cart_quantity_text.text("" + _this.cart_items_quantity);
        cart_sum.text(Math_1.mathRoundToSecond(_this.cart_sum) + "$");
        totalToPayText.text(Math_1.mathRoundToSecond(_this.cart_sum) + "$");
        _this.removeFromDOM(id, true);
        // If the latest removed item happens to be the last one, show that the cart is empty
        if (_this.orderedItems.length === 0) {
            emptyCartImg.css("opacity", "1"); // has css transition
        }
    };
    basketContainer.on("click", function () {
        cart.sendItemsList(cart.orderedItems);
        modalHeader.text('Cart'); // Remodal is now about the cart
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
// @ts-ignore - Made as window object, so the server-side rendered cart.addToCart works, Browserify issue
window.cart = new Cart();
//# sourceMappingURL=maints.js.map