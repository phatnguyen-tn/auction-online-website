$(document).ready(function () {

	/*------------------
		  hide the password
	  --------------------*/
	$('.toggle-password').on('click', function () {
		$(this).toggleClass("zmdi-eye zmdi-eye-off");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});

	/*------------------
		  Single Product
	  --------------------*/
	$('.product-thumbs-track > .pt').on('click', function () {
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if (imgurl != bigImg) {
			$('.product-big-img').attr({ src: imgurl });
			$('.zoomImg').attr({ src: imgurl });
		}
	});

	/*------------------
		  wishbtn
	  --------------------*/
	$('.wishlist-btn').on('click', function () {
		$(this).toggleClass('color-f151167 color-666666');
		var element = $('.wishlist-btn > i');
		element.toggleClass('fa-heart fa-heart-o');
	});

	/*------------------
		  go to forgetpassword page button
	  --------------------*/
	$('.forget-pw-btn').on('click', function () {
		$('.login-page').css('display', 'none');
		$('.forgetpassword-page').css('display', 'flex');
	});

	/*------------------
		  back login page button
	  --------------------*/
	$('.back-login-btn').on('click', function () {
		$('.login-page').css('display', 'flex');
		$('.forgetpassword-page').css('display', 'none');
		$('.signup-page').css('display', 'none');
	});

	/*------------------
		  sign up button
	  --------------------*/
	  $('.signup-btn').on('click', function () {
		$('.login-page').css('display', 'none');
		$('.forgetpassword-page').css('display', 'none');
		$('.signup-page').css('display', 'flex');
	});

});
