function initSlider() {
    console.log("init slider start");
        change_opacity_of_slider_div_main_view();
            var options = {
                $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
                $AutoPlayInterval: 0,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                $PauseOnHover: 0,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, default value is 1

                $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
                $SlideEasing: $JssorEasing$.$EaseLinear,          //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
                $SlideDuration: 3000,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
                $SlideWidth: Math.floor((getWindowWidth()/3)),                                   //[Optional] Width of every slide in pixels, default value is width of 'slides' container
                $SlideHeight: Math.floor((getWindowWidth()/6)+70),                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
                //$SlideWidth: Math.floor(jQuery('.mbj_notification_container').width() * 1.5),
                //$SlideWidth: Math.floor((getWindowWidth()/2)),
                //$SlideHeight: Math.floor(jQuery('.mbj_notification_container').width() * 1.5),                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
                $SlideSpacing: 5, 					                //[Optional] Space between each slide in pixels, default value is 0
                $DisplayPieces: 6,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
                $ParkingPosition: 0,                              //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
                $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
                $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizontal, 2 vertical, default value is 1
                //$DragOrientation: (device.platform === "iOS") ? 1 : 0                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
            };

            var jssor_slider1 = new $JssorSlider$(currentSliderId, options);
            var jssor_slider2 = new $JssorSlider$(currentSliderId, options);

function ScaleSlider() {
    //var bodyWidth = document.body.clientWidth;
    var bodyWidth = jQuery('div.content-puzzle').width();
    if (bodyWidth){
       
    // without scale atm that why it is 970. should be bodyWidth
    jssor_slider1.$SetScaleWidth(bodyWidth);
    
        // if no beans slider don't move - fix here
        // if(currentSliderId == slider2_container) {
        //     get_mybeans("0");
        //     console.log("getting mybeans inside slider scale");
        // }
    }
    else{
    window.setTimeout(ScaleSlider, 30);
    }
}

function AddFrostedOverlay() {
    jQuery('<div class="frosted-overlay"></div>').insertBefore("#slider1_container");
}

ScaleSlider();
AddFrostedOverlay();
}
