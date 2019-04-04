/* Slideshow CLASS
   ========================================================================== */
const SlideShow = function() {
    this.slideShowImgs = document.getElementsByClassName("mySlides_js"); // used when randomizing the first slide
    this.slideIndex = Math.floor(Math.random() * this.slideShowImgs.length) + 1;
    this.timeNextSlide = 8000; // to reduce later
    this.automaticSlideshow = setInterval(
        () => {
            slideshow.plusDivs(+1);
        },
        this.timeNextSlide
    );

    SlideShow.prototype.plusDivs = (n) => {
        this.showDivs(this.slideIndex += n);
        clearInterval(this.automaticSlideshow); // stop the timer (done in case the arrows were clicked)
        this.automaticSlideshow = setInterval(() => {slideshow.plusDivs(+1);}, this.timeNextSlide); // start a new timer, lazy way
    };

    SlideShow.prototype.showDivs = (n) => {
        let i;
        const slideShowImgs: any = document.getElementsByClassName("mySlides_js");

        const showElement = () => {
            slideShowImgs[slideshow.slideIndex -1].style.opacity = '1';
            slideShowImgs[slideshow.slideIndex -1].style.display = 'visible';
        };

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
export const slideshow = new SlideShow(); // attached to window - Browserify issue