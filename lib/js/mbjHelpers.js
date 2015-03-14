function centerHelper(){	
	$('.center').each(function(){
		console.log("This.height: " + $(this).outerHeight());
		console.log("Parent.height: " + $(this).innerHeight());
		$(this).css('left',(((($(this).parent().innerWidth() - ($(this).outerWidth())) / 2)) + 'px'));
		$(this).css('top',(((($(this).parent().innerHeight() - ($(this).outerHeight())) / 2)) + 'px'));
	});
};