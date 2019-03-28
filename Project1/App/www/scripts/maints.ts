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
const headContainer = $('#headContainer');
const basketContainer = $('.basketContainer');
const dimmingBlock = $('.dimmingBlock');
const remodalContainer = $('.remodal');
const cartArticlesContainer = $('.cartArticlesContainer');
const remodalWrapper = $('.remodalWrapper');
const confirmCartBtn = $('.remodal-confirm');
const registerUserBtn = $('#registerUserBtn');
const loginUserBtn = $('#loginUserBtn');
const registerContainer = $('.registerUserContainer');
const newestClothes = $('#newestClothes');
const cart_sum = $('#cart_sum');
const cart_quantity_text = $('#cart_quantity_text');
const totalToPayText = $('#totalToPayText');
const modalHeader = $('#modalHeader');
const cartContent = $('#cartContent');
const emptyCartImg = $("#emptyCartImg");

// used anywhere
let viewPortHeight: number = window.innerHeight; // to be later re-calculated
let cart; // to be later instantiated as Cart object
let slideshow; // to be later instantiated as Slideshow object
let effects; // to be later instantiated as Effects object
let currentState: string = "default"; // default state
let loggedIn: boolean = false; // false by default

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
    window.addEventListener('resize',function() {
        adjustHeight();
    });

    window.addEventListener('scroll',function() {
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
        if(currentState === "default") {
            registrationForm(true);
        }
        else if(currentState === "register") {
            console.log("Send registration info");
            // register();
        }

        else if(currentState === "purchase") {
            console.log("Functionality to come");
        }

    });

    /* User events listeners
     ========================================================================== */
    registerUserBtn.on('click', function() {
        registrationForm( false);
    });

    loginUserBtn.on('click', function() {
        repaintForEvent('login');
    });

});

/* HIGHLY RE-USABLE FUNCTIONS
   ========================================================================== */
// Remove element from array by value
function remove(array: number[], element): number {
    "use strict";
    let value: number = array.indexOf(element);

    if (value !== -1) {
        array.splice(value, 1);
    }

    return value;
}

// Round a number to the second decimal
function mathRoundToSecond(num: number): number {
    "use strict";
    return Math.round(num * 100) / 100;
}

/*
* Set the current state
* Note: setState("default") is being used in dist/remodal.min.js on remodal close
* */
function setState(state: string): string {
    "use strict";
    switch(state) {
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
}

// NEW, PUT IN CLASS, hide from GLOBAL SCOPE, only setState can use those
function defaultState(): void {
    "use strict";
    registerContainer.css('display', 'none'); // check
}

function registerState(): void {
    "use strict";
    registerContainer.css('display', 'flex'); // check
}

function registrationForm(comingFromCart: boolean = false): void {
    "use strict";
    // By default, user is registering, before purchasing items

    // If the user isn't logged in [redundant?]
    if(loggedIn === false) {
        // If it's cart registration, force the user to have at least 1 item in the cart
        if(comingFromCart === true) {
            // Allow the user to register if he has at least 1 item in the cart
            if(cart.orderedItems.length === 0) {
                // was textContent
                totalToPayText.text("Can't go with an empty cart :(");
            }
            else {
                repaintForEvent("register");
                setState("register");
            }
        }

        // If it's normal registration directly let the user register
        else if(comingFromCart === false) {
            repaintForEvent("register");
            setState("register");
        }
    }

    // Move out
    else if(loggedIn === true) {
        console.log("functionality to come");
    }
}

function register(): void {
    "use strict";
    console.log("AJAX send register info from forms");
}

/* Recalculate Remodal window height, case of mobile going sideways etc..*/
function adjustHeight(): void {
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
    let remodalContent: number = viewPortHeight * 0.8; // 80% of the view-port
    let remodalContentPx: string = remodalContent + 'px';

    let wrapperContent: number = remodalContent * 0.95; // 5% less than the remodal container
    let wrapperContentPx: string = wrapperContent + 'px';

    let articleContent: number = wrapperContent * 0.77; // 20% less than the remodal container
    let articleContentPx: string = articleContent + 'px';

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
function scrollToAnchor(aid): void{
    "use strict";
    const aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#link").click(function(): void {
    "use strict";
    scrollToAnchor('menuContainer'); // is no longer correct, since header is overlapping with the menuContainer
});

/* Get newest clothes
   ========================================================================== */
function getNewestClothes() {
    "use strict";
    try {
        // VARIABLES
        let xhttp: XMLHttpRequest;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            let DONE: number = 4; // readyState 4 means the request is done.
            let OK: number = 200; // status 200 is a successful return.
            if (this.readyState === DONE && this.status === OK) {
                newestClothes.html(this.responseText);
            }
        };
        xhttp.open("POST", "/dynamic/newest_clothes", true);
        xhttp.send();
    }
    catch(e) {
        console.log('Caught Exception: ' + e.message);
    }
}

// Unite the login and register events in here
function repaintForEvent(event: string) {
    "use strict";
    if(event === 'register') {
        // Remodal window is now about Registration
        modalHeader.html('Register');
        cleanCart(false);
    }

    else if(event === 'login') {
        // Remodal window is now about Registration
        modalHeader.html('Login');
        cleanCart(false);
    }

    // Make the cart clean
    function cleanCart(fadeEmptyCart: boolean = false) {
        if(cartContent.children.length > 0) {
            for (let i = 0; i < cart.orderedItems.length; i++) {
                cart.removeFromDOM(cart.orderedItems[i], false);
            }
        }

        // Hide the empty cart image
        if(emptyCartImg.css("opacity") === '1' || emptyCartImg.css("opacity") === '') {
            if(fadeEmptyCart === false) {
                emptyCartImg.css("transition", "unset");
                emptyCartImg.css("opacity", "0");
            }
            else {
                emptyCartImg.css("opacity", "0");
            }
        }
    }
}

/* Effects CLASS
   ========================================================================== */
const Effects = function() {
    "use strict";
    // Blur an element for a brief period
    Effects.prototype.blurElement =
        function (
            element: string = "class",
            selector: string,
            afterMilliseconds: number = 0,
            forMilliseconds: number = 1000,
            on_or_off: string
        ){

        let elem;

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

        /* State
       ========================================================================== */
        if(on_or_off === 'on') {
            // Blur effect, filter is not that well supported
            setTimeout(function() {
                elem.css({
                    'transition-property': 'filter',
                    'transition-duration': forMilliseconds + 'ms',
                    'transition-timing-function': 'ease',
                    'filter': 'blur(1px)'
                });
            }, afterMilliseconds);
        }
        else if(on_or_off === 'off') {
            setTimeout(function() {
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
        function(
            element,
            selector: string = "class",
            afterMilliseconds: number = 0,
            forMilliseconds: number = 1000,
            on_or_off: string = "on"
        ) {
        let elem;

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

        /* States
       ========================================================================== */
        if(on_or_off === 'on') {
            setTimeout(function() {
                elem.css({
                    'transition-property': 'opacity',
                    'transition-duration': forMilliseconds + 'ms',
                    'transition-timing-function': 'ease-in',
                    'visibility': 'visible',
                    'opacity': 0.85
                });
            }, afterMilliseconds);
        }
        else if(on_or_off === 'off') {
            setTimeout(function() {
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
const SlideShow = function() {
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
        let i;
        const slideShowImgs: any = document.getElementsByClassName("mySlides_js");

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
const Cart = function () {
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
        cart_sum.html(mathRoundToSecond(this.cart_sum) + "$");
        this.cart_items_quantity++;
        cart_quantity_text.html("" + this.cart_items_quantity);

        this.orderedItems.push(articleId);
    };

    Cart.prototype.sendItemsList = function () {
        if (this.orderedItems.length !== 0) {
            emptyCartImg.css("opacity", "0"); // fade out the Empty cart image
            try {
                // VARIABLES
                let xhttp: XMLHttpRequest;
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    let DONE: number = 4; // readyState 4 means the request is done.
                    let OK: number = 200; // status 200 is a successful return.
                    if (this.readyState === DONE && this.status === OK) {
                        cartContent.html(this.responseText);
                    }
                };
                xhttp.open("POST", "/dynamic/generate_cart", true);
                const orderedItemsJSON = JSON.stringify(this.orderedItems);
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
        cart_quantity_text.html("" + this.cart_items_quantity);
        cart_sum.html(mathRoundToSecond(this.cart_sum) + "$");
        totalToPayText.html(mathRoundToSecond(this.cart_sum) + "$");

        this.removeFromDOM(id, true);

        // If the latest removed item happens to be the last one, show that the cart is empty
        if (this.orderedItems.length === 0) {
            emptyCartImg.css("opacity", "1"); // has css transition
        }
    };

    Cart.prototype.removeFromDOM = function (id, removeWithTransition) {
        try {
            this.articleContainer = document.querySelector(`#article${id}`);
            this.articleContainerBtn = document.querySelector(`#articleBtn${id}`);
            this.articleContainer.removeChild(this.articleContainerBtn);
            this.articleContainer.style.opacity = '0';
        }
        catch (e) {
            console.log(`Exception caught ${e}`);
        }

        if(removeWithTransition === true) {
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

    basketContainer.on("click", function () {
        cart.sendItemsList(cart.orderedItems);
        modalHeader.html('Cart'); // Remodal is now about the cart
        // if there are no items in the cart show the empty cart images
        if(cart.orderedItems.length === 0) {
            if(emptyCartImg.css("opacity") === '0' || emptyCartImg.css("opacity") === '') {
                emptyCartImg.css("opacity", "1");
            }
        }

        // Determine and set the max-height so the container doesn't spill out of proportions
        adjustHeight();
    });

    function cartTotal() {
        totalToPayText.html("Total: " + mathRoundToSecond(cart.cart_sum) + "$");
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
