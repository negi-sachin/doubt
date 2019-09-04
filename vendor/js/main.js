$(window).scroll(function(){
    if ($(this).scrollTop() > 50) {
       $('#dynamic').addClass('opaque-navbar');
    } else {
       $('#dynamic').removeClass('opaque-navbar');
    }
});


// bonemarrow
$('.carousel').carousel({
  interval: 2000
})

// navigation progress js
jQuery.fn.progressBar = function(valuenow, append) {
   valuenow = parseInt(jQuery(valuenow)[0]);
   append = jQuery(append)[0];
   var $progress = jQuery(this[0]);
     
   if(append)
       valuenow = parseInt($progress.find('.progress-bar').attr('aria-valuenow')) + valuenow;
   
   if(valuenow > 100)
       valuenow = 100;
   
   if(valuenow > 0 && valuenow <= 100) {
     $progress.find('.progress-bar').attr('aria-valuenow', valuenow);
     $progress.find('.progress-bar').css('width', valuenow+'%');
     $progress.find('.sr-only').text(valuenow+'% Complete');
   } else {
     $progress.find('.progress-bar').attr('aria-valuenow', 0);
     $progress.find('.progress-bar').css('width', '0%');
     $progress.find('.sr-only').text('0% Complete');
   }
   return;
 };
 
 jQuery(document).ready(function(){
   var $ = jQuery;
   var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
   var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.documentElement.getBoundingClientRect().top;
   $(window).scroll(function() {
     scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.documentElement.getBoundingClientRect().top;
     scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
   });
   
   /* Scroll progress */
   var progress = $('#scrollProgress').progressBar(0, false);
   $(window).scroll(function() {
     var totalProgress = (scrollTop/(scrollHeight-$(window).height()))*100;
     $('#scrollProgress').progressBar(totalProgress, false);
   });
   
 });