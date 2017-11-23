// Problems
// 1 - Serious problem, 2 - problem with mediocre impact, 3 - Details
// 2. JS Architecture

// VARIABLES
var newestClothesContainer = document.getElementsByClassName("newSectionFigure");
var newestClothes = document.getElementById("newestClothes");

// Slide show START

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
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
  var aTag = $("a[name='"+ aid +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#link").click(function() {
  scrollToAnchor('menuContainer');
});

// Anchor scroll END

/* Get newest clothes *START* */

function getNewestClothes() {
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