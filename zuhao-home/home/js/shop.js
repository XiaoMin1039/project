$(function () {
    var i = 0;
   setInterval(function () {
       var top = $('.notice ul').position().top;
       $('.notice ul').css('top',(top-27)+'px');
       i++;
       if(i == 17){
           $('.notice ul').css('top',8);
           i = 0;
       }
   },5000);
});