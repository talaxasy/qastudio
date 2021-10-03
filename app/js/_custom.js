document.addEventListener("DOMContentLoaded", function() {

	// Fixed Header
	var header = $(".header");
	var logo = $(".logo");
	var previewH = $(".preview").innerHeight();
	var scrollOffset = $(window).scrollTop();
	checkScroll(scrollOffset);
	$(window).on("scroll", function(){

		scrollOffset = $(this).scrollTop();

		checkScroll(scrollOffset);
	});

	function checkScroll(scrollOffset){
		if (scrollOffset >= previewH) {
			header.addClass("fixed fade");
			logo.addClass("logo-slick");
			$(".mobile-menu").on("click", function(event) {
				$(".header").toggleClass("bg");
			});
		}
		else
		{
			header.removeClass("fixed fade");
			logo.removeClass("logo-slick");
		}
	}

	/* Menu nav toggle */
	$(document).ready(function(){
		$(".mobile-menu").on('click',function(){
			$(this).find(".burger-fragments").toggleClass("open-m");
			$(".header").toggleClass("active");
			$(".nav").toggleClass("active");
		});
	})


	// Smooth scroll
	$("[data-scroll]").on("click", function(event){
		event.preventDefault();
		var blockId = $(this).data('scroll');
		var blockOffset = $(blockId).offset().top;

		$(".nav a").removeClass("active");
		$(this).addClass("active");

		$("html, body").animate({
			scrollTop: blockOffset + 1
		},600);
	});

	// Fixed Header 2
	window.onscroll = magic;
	function magic() {
		if (window.pageYOffset) {
			$(".nav").removeClass("active");
			$(".mobile-menu").find(".burger-fragments").removeClass("open-m");
			$(".header").removeClass("bg");
			$(".header").removeClass("active");
			setTimeout(function(){ $(".nav__link").removeClass("active");},3000);
		}
	}	

	// Magic grid
	$(document).ready(function(){
		let magicGrid = new MagicGrid({
			container: '.portfolio__inner',
			animate: true,
			gutter: 50,
			static: true,
			useMin: true
		});
		magicGrid.listen();
	})

	// Slider reviews
	$('.reviews').slick({
		infinite: true,
		slidesToShow: 3,
		draggable: false,
		slidesToScroll: 1,
		responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 2,
			}
		},
		{
			breakpoint: 876,
			settings: {
				slidesToShow: 1,
			}
		}]
	});


	// Modal window
	$(function(){
		$('.open-modal, .open-modal__event').on('click', function(e){
				e.preventDefault();
				e.stopImmediatePropagation;

				var $this = $(this),
				modal = $($this).data("modal"),
				modalEvent = $($this).data("modal-event");

				document.body.style.overflow = 'hidden';

				$(modal, modalEvent).parents(".modal__overlay, .modal__overlay2").addClass("open");
				setTimeout( function(){
					$(modal, modalEvent).addClass("open");
				}, 350);

				$(document).on('click', function(e){
					var target = $(e.target);

					if ($(target).hasClass("modal__overlay, modal__overlay2")){
						document.body.style.overflow = '';
						$(target).find(".modal, .modal-event").each( function(){
							$(this).removeClass("open");
						});
						setTimeout( function(){
							$(target).removeClass("open");
						}, 350);
					}

				});
			});

			$(".close-modal").on('click', function(e){
				e.preventDefault();
				e.stopImmediatePropagation;

				var $this = $(this),
				modal = $($this).data("modal"),
				modalEvent = $($this).data("modal-event");

				document.body.style.overflow = '';

				$(modal, modalEvent).removeClass("open");
				setTimeout( function(){	
					$(modal, modalEvent).parents(".modal__overlay, .modal__overlay2").removeClass("open");
				}, 350);

			});	
		
		// Hide menu-modal
		if ( $(window).width() <= 565) {
			$("#desktop-modal").removeAttr("data-modal");
		}
	}); // end modals


	//E-mail
	// $('form').on('submit',function(e) { 
	// 	$.ajax({
	// 		url:'https://www.qastudio.by/js/mail.php',
	// 		data:$(this).serialize(),
	// 		type:'POST',
	// 		success:function(data){
	// 			console.log(data);
	// 			swal("Заявка отправлена!", "Спасибо за заявку", "success");
	// 			$(this).find('input').val('');
	// 			$('form').trigger('reset');
	// 		},
	// 		error:function(data){
	// 			swal("Упс...", "Что-то пошло не так :(", "error");
	// 		}
	// 	});
	// 	e.preventDefault();
	// });


});
