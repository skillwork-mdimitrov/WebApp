/*jslint devel: true*/
/*globals $, setState, cart:false*/

// Issues
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. https://stackoverflow.com/questions/6904166/should-i-use-window-variable-or-var
// 2. Fallback for filter
// 3. On hover of the slideshow don't go next

import { effects } from "./modules/Effects";
import { slideshow } from "./modules/SlideShow";
import { mathRoundToSecond } from "./modules/Math";
import { removeFromArr } from "./modules/Array";

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
const prevSlideBtn = $("#prevSlideBtn");
const nextSlideBtn = $("#nextSlideBtn");

// Unknown to TS variables/functions
declare const cart: any;
declare function setState(state: string): string;

// used anywhere
let viewPortHeight: number = window.innerHeight; // to be later re-calculated
let currentState: string = "default"; // default state
let loggedIn: boolean = false; // false by default

/* Event listeners
   ========================================================================== */

// ON LOAD
window.addEventListener('load', () => {
    getNewestClothes();
    adjustHeight();
    setState("default");
});

$(document).ready(() => {
    slideshow.showDivs(slideshow.slideIndex);

    /* Window event listeners
     ========================================================================== */
    window.addEventListener('resize',() =>{
        adjustHeight();
    });

    window.addEventListener('scroll',() => {
        if(window.scrollY > 0) {
            headContainer.addClass("scrolled");
        }
        if(window.scrollY === 0) {
            headContainer.removeClass("scrolled");
        }
    });

    /* Cart remodal listeners
     ========================================================================== */
    confirmCartBtn.on('click', () => {
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
    registerUserBtn.on('click', () => {
        registrationForm(false);
    });

    loginUserBtn.on('click', () => {
        repaintForEvent('login');
    });

    prevSlideBtn.on('click', () => {
        slideshow.plusDivs(-1);
    });

    nextSlideBtn.on('click', () => {
        slideshow.plusDivs(+1);
    });

});

// NEW, PUT IN CLASS, hide from GLOBAL SCOPE, only setState can use those
const defaultState = (): void => {
    registerContainer.css('display', 'none'); // check
};

const registerState = (): void => {
    registerContainer.css('display', 'flex'); // check
};

/*
* Set the current state
* Note: setState("default") is being used in dist/remodal.min.js on remodal close
* */
// @ts-ignore - Attached to the window object because used as a global - Browserify issue
window.setState = (state: string): string => {
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
};

const registrationForm = (comingFromCart: boolean = false): void => {
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
};

const register = (): void => {
    console.log("AJAX send register info from forms");
};

/* Recalculate Remodal window height, case of mobile going sideways etc..*/
const adjustHeight = (): void => {
    // media query parameter
    
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
};

/* Anchor scroll
   ========================================================================== */
const scrollToAnchor = (aid): void =>{
    const aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
};

$("#link").click((): void => {
    scrollToAnchor('menuContainer'); // is no longer correct, since header is overlapping with the menuContainer
});

/* Get newest clothes
   ========================================================================== */
const getNewestClothes = () => {
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
};

// Unite the login and register events in here
const repaintForEvent = (event: string) => {
    // Make the cart clean
    const cleanCart = (fadeEmptyCart: boolean = false) => {
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
    };

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
};

/* Cart class
   ========================================================================== */
const Cart = function () {
    this.cart_sum = 0; // The sum of the user's currently requested clothes
    this.cart_items_quantity = 0; // How much items are currently in the cart
    this.orderedItems = []; // Will store the ordered items, later send to the server (so he can generate the cart)
    this.articleContainer = ""; // later defined
    this.articleContainerBtn = ""; // later defined

    const cartTotal = () => {
        totalToPayText.html("Total: " + mathRoundToSecond(cart.cart_sum) + "$");
    };

    // counter articles quantity in the session ??
    Cart.prototype.addToCart = (articleId, articlePrice) => {
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

    Cart.prototype.sendItemsList = () => {
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

    Cart.prototype.removeFromDOM = (id, removeWithTransition) => {
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
            setTimeout(() => {
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

    Cart.prototype.removeFromCart = (id, price) => {
        removeFromArr(this.orderedItems, id); // remove from the list of ordered items

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

    basketContainer.on("click", () => {
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
};
// @ts-ignore - Made as window object, so the server-side rendered cart.addToCart works, Browserify issue
window.cart = new Cart();

/* Additions

// require(['Cart']  ,function(c){
//   
//   c
// });

//var CartModule = (function() {

//  return {
//    cart : Cart
//  };
//}());

//cart = new CartModule.cart();

*/
