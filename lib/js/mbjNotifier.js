/*																													
*            LOVINGLY CRAFTED BY:																						
*                                       @@@@                        @@@@                   								
*                                      @@@@                        @@@@                   								
*                                     @@@@                        @@@@                    								
*                                    @@@@                        @@@@                    								
*       @@@@@@@@@@@@  @@@@    @@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@  @@@@@@@@@@@@  @@@@   @@@@ 						
*      @@@@          @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@    @@@@    @@@@@@@  							
*     @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@    @@@@      @@@@  							
*            @@@@  @@@@    @@@@  @@@@    @@@@  @@@@    @@@@  @@@@  @@@@            @@@@@@@@   							
*   @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@@@@@@@@@  @@@@  @@@@@@@@@@@@   @@@@   @@@@  							
*                                            @@@@  																		
*                                           @@@@   S  T  R  A  T  E  G  I  C           									
*                                          @@@@   C  O  M  M  U  N  I  C  A  T  I  O  N           						
*                                         @@      																		                                               																		
*                                                   																	
*                                            http://subplex.com															
*		
*
*	Name: 			mbjNotifier.js
*
*	Description: 	A script to provide notifications and other helper behaviors for the MyBeanJar API
*	Author: 		Christopher Charles (cccharle@subplex.com)
*	Dependencies: 	jQuery (2.x) 				(http://jquery.com/)
*					MyBeanJar JavaScript SDK 	(https://github.com/beanjar/MyBeanJar-SDK--Javascript--HTML5)
*					
*/


var mbjUserLoggedIn = false;
var msgAwardSuccess = "Bean Awarded!";
var msgMoreInfo = 'Visit <a href="http://mybeanjar.com">MyBeanJar.com</a> for more info.';
var u = null;
var p = "";
var result = null;
var queuedBeans = 0;
var footerCollapsed = false;

var flashingLoginStatus;
var capsulePlaceholderImageURL = "img/mbj_payload_img.png";

// Timeouts
var capsuleLidTimeout;
var capsuleBodyTimeout;
var capsulePayloadTimeout;
var capsuleFadeOutTimeout;


	
mbjImagePreloader();



function mbjAttemptAward() {

	if (mbjUserLoggedIn){
		console.log("User logged in" + /*as " + u + " : " + p + "*/". Requesting " + queuedBeans + " award Beans");
			
		if (queuedBeans > 0) {
			for (i = queuedBeans; i > 0; i--){
				get_award(u, p, mbjAppID, BeanAwardAlert);
				console.log(queuedBeans + " queued Beans remaining...");
			};
		};
	}
	
	else {	
		mbjAttemptLogin();
	}
}



function mbjAttemptLogin(){
	console.log('Prompting user to log in...');
	
	// Prompt for login/registration
	jQuery( 'div.mbj_notification_container' )
		.fadeIn();
	
	// If login form is submitted...
	jQuery('#mbj_login_form').off('submit').on('submit', function(event) {
		event.preventDefault();
		event.stopPropagation();
		u = jQuery('#mbj_form_u', this).val();
		p = jQuery('#mbj_form_p', this).val();
		console.log("Attempting to log in...");
		console.log("Queued Bean count: " + queuedBeans);

		mbjAttemptAuthenticate();
		console.log("Authentication method called.");
				
	});

	// If registration form is submitted...
	jQuery('#mbj_registration_form').off('submit').on('submit', function(event) {
		event.preventDefault();
		event.stopPropagation();
		u = jQuery('#mbj_form_reg_u', this).val();
		p = jQuery('#mbj_form_reg_p', this).val();
		p2 = jQuery('#mbj_form_reg_p2', this).val();
		email = jQuery('#mbj_form_reg_email', this).val();
		zip = jQuery('#mbj_form_reg_zip', this).val();

		// Add checkbox items to array
		var catArray = [],
    	inputs = document.getElementsByClassName("mbj_checkbox");

		for (var i = inputs.length -1 ; i>= 0; i--) {
    		if (inputs[i].type === "checkbox" && inputs[i].checked) {
          		catArray.push(inputs[i].value);
          	}
         }

		cats = catArray;
		console.log("Attempting to register...");
		console.log("Queued Bean count: " + queuedBeans);

		mbjAttemptRegistration();
				
	});
	
	jQuery('#mbj_notification_close').off('submit').on('submit', function(event) {
		event.preventDefault();
		event.stopPropagation();
		jQuery( '#mbj_notification_container_login' )
			.fadeOut(500, "swing");
			
	});

	jQuery('div.mbj_notification_pane_selector').off('click').on('click', function(event) {
		
		jQuery('div.mbj_notification_pane_selector').each(function(){
			console.log("Check!");

			if (jQuery(this).hasClass('active_selector')){
				jQuery(this).removeClass('active_selector').addClass('inactive_selector');
			}
			else {
				jQuery(this).removeClass('inactive_selector').addClass('active_selector');
			};
		});

		jQuery('div.mbj_login_or_register').each(function(){

			if (jQuery(this).hasClass('active_pane')){
				jQuery(this).removeClass('active_pane').addClass('inactive_pane');
			}
			else {
				jQuery(this).removeClass('inactive_pane').addClass('active_pane');
			};
		});

		// if (jQuery('#mbj_register').hasClass('active_pane')){									// Commented out to temporarily resolve close button vanishing issue

		// 	jQuery('#mbj_notification_container_login')
		// 		.finish()
		// 		.animate({ 'height' : '100%' });
		// }
		
		// else {
		
		// 	jQuery('#mbj_notification_container_login')
		// 		.finish()
		// 		.animate({ 'height' : '100%' });
		
		// };
	});
};



function mbjAttemptAuthenticate(){

	jQuery( 'div.mbj_login_status' ).removeClass( 'success fail' );
	jQuery( 'div.mbj_login_status' ).html( '<div id="spinner_login"></div>' );
	flashLoginStatus();
	SummonSpinner('spinner_login');
	
	authenticate_user(u, p, mbjNotifyAuthenticate);
	console.log("Queued Bean count: " + queuedBeans);
};



function mbjNotifyAuthenticate(result,message){

	console.log("Authenticating...");

	if (result == STATUS_SUCCESS){
		console.log("Result = " + result);
		console.log("Message = " + message);
		console.log("Authentication succeeded.");
		
		mbjUserLoggedIn = true;

		// Hide "sign-up button"
		jQuery("button#footer-signup").fadeOut(200, "swing");
		jQuery(".footer-cta-title").css({
			width: "100%",
			textAlign: "center"
		});
		
		setTimeout(function() {
			jQuery( "div.mbj_login_status" ).addClass( "success" );
			
			jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_success.png"><p class="status success">Login successful.</p>' );
			
			flashLoginStatus();
		
			setTimeout(function() {
				jQuery( "div.mbj_notification_container" )
					.fadeOut(200, "swing");	
			}, 3000);
		}, 200);
		
		if (queuedBeans > 0){
			mbjAttemptAward();
		}
	}
	else {
		console.log("Result = " + result);
		console.log("Message = " + message);
		console.log("Authentication failed.");
			

		setTimeout(function() {
			jQuery( "div.mbj_login_status" ).addClass( "fail" );
			
			jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_fail.png"><p class="status fail">Login failed.</p>' );
			
			flashLoginStatus();
		}, 200);
	}
};



function mbjAttemptRegistration(){

	jQuery( "div.mbj_login_status" ).removeClass( "success fail" );
	jQuery( "div.mbj_login_status" ).html( '<div id="spinner_login"></div>' );
	flashLoginStatus();
	SummonSpinner('spinner_login');

	if (p != p2) {
		console.log("Password mismatch detected");
		mbjNotifyRegistrationPassMismatch();
		mbjAttemptLogin();
	}
	else if (p.length < 6){
		console.log("Invalid password");
		mbjNotifyRegistrationInvalidPass();
		mbjAttemptLogin();
	}
	else {
		console.log("categories :" + categories);
		register_user(u, p, email, zip, cats, mbjNotifyRegistration);
		console.log("Queued Bean count: " + queuedBeans);
	};
};



function mbjNotifyRegistrationPassMismatch(){

	setTimeout(function() {
		jQuery( "div.mbj_login_status" ).addClass( "fail" );
		
		jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_fail.png"><p class="status success">Passwords do not match.</p>' );
		
		flashLoginStatus();

		jQuery( "#mbj_form_reg_p")
			.animate({backgroundColor:'#c21010'}, 200);

		jQuery( "#mbj_form_reg_p2")
			.animate({backgroundColor:'#c21010'}, 200);
	}, 200);
	
	setTimeout(function() {
		jQuery( "#mbj_form_reg_p")
			.animate( {backgroundColor:'#ffffff'}, 200 );

		jQuery( "#mbj_form_reg_p2")
			.animate( {backgroundColor:'#ffffff'}, 200 );
	}, 3000);
};

function mbjNotifyRegistrationInvalidPass(){

	setTimeout(function() {
		jQuery( "div.mbj_login_status" ).addClass( "fail" );
		
		jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_fail.png"><p class="status success">Password must be at least 6 alphanumeric characters. Special characters not allowed.</p>' );
		
		flashLoginStatus();

		jQuery( "#mbj_form_reg_p")
			.animate({backgroundColor:'#c21010'}, 200);

		jQuery( "#mbj_form_reg_p2")
			.animate({backgroundColor:'#c21010'}, 200);
	}, 200);
	
	setTimeout(function() {
		jQuery( "#mbj_form_reg_p")
			.animate( {backgroundColor:'#ffffff'}, 200 );

		jQuery( "#mbj_form_reg_p2")
			.animate( {backgroundColor:'#ffffff'}, 200 );
	}, 3000);
};

function mbjNotifyRegistrationInvalidZip(){

	setTimeout(function() {
		jQuery( "div.mbj_login_status" ).addClass( "fail" );
		
		jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_fail.png"><p class="status success">Invalid ZIP code.</p>' );
		
		flashLoginStatus();

		jQuery( "#mbj_form_reg_zip")
			.animate({backgroundColor:'#c21010'}, 200);
	}, 200);
	
	setTimeout(function() {
		jQuery( "#mbj_form_reg_zip")
			.animate( {backgroundColor:'#ffffff'}, 200 );
	}, 3000);
};

function mbjNotifyRegistration(result,message){
	if (result == STATUS_SUCCESS){
		console.log("Result = " + result);
		console.log("Message = " + message);
		console.log("Registration succeeded.");
		
		mbjUserLoggedIn = true;
		
		// award Bean for successful registration
		queuedBeans++;
			
		setTimeout(function() {
			jQuery( "div.mbj_login_status" ).addClass( "success" );
			
			jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_success.png"><p class="status success"> ' + message + ' </p>' );
			
			flashLoginStatus();
		
			setTimeout(function() {
				jQuery( "div.mbj_notification_container" )
					.fadeOut(200, "swing");
			}, 3000);
		}, 200);
		
		if (queuedBeans > 0){
			mbjAttemptAward();
		}
	}
	else {
		console.log("Result = " + result);
		console.log("Message = " + message);
		console.log("Registration failed.");
			

		setTimeout(function() {
			jQuery( "div.mbj_login_status" ).addClass( "fail" );
			
			jQuery( "div.mbj_login_status" ).html( '<img src="img/ui_action_fail.png"><p class="status fail">Registration failed. ' + message + ' </p>' );
			
			flashLoginStatus();
		}, 200);
		mbjAttemptLogin();	
	}
};


function flashLoginStatus(){
	if (!flashingLoginStatus){
		flashingLoginStatus = true;
		jQuery( "div.mbj_login_status" )
			.finish()
			.animate({
				opacity: 1
			}, 0)
			.slideDown()
			.fadeIn(200)
			.delay(3000)
			.animate({
				opacity: 0
			}, 200)
			.slideUp(function(){
				flashingLoginStatus = false;
			}
		);
	}
};


function SummonSpinner(div_id){
	var opts = {
		lines: 12, // The number of lines to draw
		length: 7, // The length of each line
		width: 2, // The line thickness
		radius: 5, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#fff', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	};
	var target = document.getElementById(div_id);
	var spinner = new Spinner(opts).spin(target);
};


BeanAwardAlert = function(result,award){ 
	
	console.log("Retrieving award from server.");
	console.log(result);
	
	// check to see if request was successful
	
	if (result == STATUS_SUCCESS){
		var awardImage = awardArray.imageurl;
		queuedBeans--;
		console.log("Request successful!");
		jQuery( '.bean_notification_image' )
			.replaceWith( '<img class="bean_notification_image" id="mbj_award_img" src="' + awardImage + '">' );
		jQuery( '#mbj_award_img' )
			.replaceWith( '<img class="mbj_capsule_payload_contents" id="mbj_award_img" src="' + awardImage + '">' );
		// mbjCapsuleAward();
		jQuery( "div.bean_notification_window" )
			.fadeIn(500, "swing");
		jQuery( "div.bean_notification_window" )
			.html( '<img class="mbj_award_img" src="' + awardImage + '"><p class="mbj_caption">' + msgMoreInfo + '</p>' );//( '<img src="/mbj/mbj_sdk/code/img/mbj_notifier_header.png"><div id="spinner_award"></div><p class="mbj_caption">' + msgMoreInfo + '</p>' );
		jQuery( "div.bean_notification_window" )
			.delay(10000)
			.fadeOut(500, "swing");
	}
	
	else if (failArray.message == "No beans available for your category and/or location.") {
		console.log("WARNING: " + failArray.message);
	}

	else {
		console.log("Request failed.");
		jQuery( '#mbj_award_img' )
			.replaceWith( '<img class="mbj_capsule_payload_contents" id="mbj_award_img" src="' + capsulePlaceholderImageURL + '">' );
		jQuery( "div.bean_notification_window" )
			.html( '<img src="/mbj/mbj_sdk/code/img/mbj_notifier_header.png"><img class="bean_notification_image" src="img/ui_action_fail.png"><p class="mbj_caption">' + msgMoreInfo + '</p>' )
			.delay(5000)
			.fadeOut(500, "swing");
	}
};




function mbjAddAwardBean(){
	queuedBeans++
	console.log("Queued Bean count: " + queuedBeans);
	if (mbjUserLoggedIn){
		mbjAttemptAward();
	}
	else{
		mbjAttemptLogin();
	}
}



function mbjCapsuleAward(){
	
	// Animation to accompany Bean awarding. Displays award within gashapon-style capsule.

	clearTimeout(capsuleLidTimeout);
	clearTimeout(capsuleBodyTimeout);
	clearTimeout(capsulePayloadTimeout);
	clearTimeout(capsuleFadeOutTimeout);

	mbjResetCapsule();

	$('.mbj_capsule_container').removeClass('hidden').css({display: "block"});

	sxAutocenterer();
	
	$('.mbj_capsule').stop().fadeIn().removeClass('mbj_anim_capsule_init').addClass('mbj_anim_fullscale');

	$('.mbj_capsule_lid').stop().animate({
		top: "+=250px",
		},
		1000, function() {
			console.log("done!");
			var capsuleLidTimeout = setTimeout(function(){
				$('.mbj_capsule_lid').addClass('mbj_anim_rotatepartial').stop().animate({left: "-=1500px", opacity: 0}, 100)
			}, 800);
	});

	$('.mbj_capsule_body').stop().animate({
		top: "-=250px",
		},
		1000, function() {
			console.log("done!");
			var capsuleBodyTimeout = setTimeout(function(){
				$('.mbj_capsule_body').addClass('mbj_anim_rotatepartial').stop().animate({left: "+=1500px", opacity: 0}, 100)
			}, 800);
	});

	$('#mbj_payload_overlay').stop().animate({
		opacity: "0",
		},
		2800, function() {
			console.log("done!");
	});

	var capsulePayloadTimeout = setTimeout(function(){
		$('.mbj_capsule_payload').removeClass('mbj_anim_halfscale').addClass('mbj_anim_fullscale')
	}, 2000);

	var capsuleFadeOutTimeout = setTimeout(function(){
		$('.mbj_capsule_container').stop().fadeOut().removeClass('mbj_anim_capsule_fullscale').addClass('mbj_anim_init');
	}, 10000);

};

function mbjResetCapsule(){
	
	// Resets capsule back to initial conditions

	jQuery('.mbj_capsule_container').addClass('hidden');
	jQuery('.mbj_capsule').hide().removeClass('mbj_anim_fullscale').addClass('mbj_anim_capsule_init');

	jQuery( "img.mbj_award_img" ).replaceWith( '<img class="mbj_capsule_payload_contents mbj_award_img" src="img/mbj_payload_img.png">' );
	
	jQuery('.mbj_capsule_lid').css({
		top: "0px",
		left: "0px",
		opacity: 1
	}).removeClass('mbj_anim_rotatepartial');
	
	jQuery('.mbj_capsule_body').css({
		top: "0px",
		left: "0px",
		opacity: 1
	}).removeClass('mbj_anim_rotatepartial');

	jQuery('.mbj_capsule_payload').css({
		top: "30px",
		left: "30px",
		opacity: 1
	}).removeClass('mbj_anim_fullscale').addClass('mbj_anim_halfscale');

	jQuery('#mbj_payload_overlay').css({
		opacity: 1
	});
};


// FOOTER COLLAPSE TOGGLE 
jQuery(document).ready(function(){
	jQuery(".mbj-footer").click(function(event){
		var target = jQuery(event.target);
		if (!target.is("#footer-signup")) {
			if (!footerCollapsed){
				footerHeight = jQuery("#main_container").height();
				console.log(footerHeight);
				jQuery("#main_container").animate({opacity: 0}, 200, function(){
					jQuery("#main_container").animate({height: 0}, 800, function(){
						footerCollapsed = true;
					});
				});
			}
			else {
				jQuery("#main_container").animate({height: footerHeight}, 800, function(){
					jQuery("#main_container").animate({opacity: 1}, 200, function(){
						footerCollapsed = false;
					});
				});
			}
		}
	});
});



function mbjImagePreloader(){
	jQuery('body').html( '<div class="nada"><img src="img/ui_action_fail.png"><img src="img/ui_action_success.png"><img src="img/ui_action_close.png"></div>' );
};
