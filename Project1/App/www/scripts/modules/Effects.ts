/* Effects CLASS
   ========================================================================== */
const Effects = () => {
    // Blur an element for a brief period
    Effects.prototype.blurElement =
        (
            element: string = "class",
            selector: string,
            afterMilliseconds: number = 0,
            forMilliseconds: number = 1000,
            on_or_off: string
        ) => {

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
                setTimeout(() => {
                    elem.css({
                        'transition-property': 'filter',
                        'transition-duration': forMilliseconds + 'ms',
                        'transition-timing-function': 'ease',
                        'filter': 'blur(1px)'
                    });
                }, afterMilliseconds);
            }
            else if(on_or_off === 'off') {
                setTimeout(() => {
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
        (
            element,
            selector: string = "class",
            afterMilliseconds: number = 0,
            forMilliseconds: number = 1000,
            on_or_off: string = "on"
        ) => {
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
                setTimeout(() => {
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
                setTimeout(() => {
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
export const effects = new Effects();