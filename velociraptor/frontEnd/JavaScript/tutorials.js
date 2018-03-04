// $(document).ready(function(){
//   $(window).resize(function(){
//     if ($(window).width() < 770 || $(window).height() < 970){
//       console.log("Hello Betch");
//       $("body").hide();
//     }
//     else {
//       $(".row").show();
//     }
//   })
$(document).ready(function(){
  if ($(window).width() < 770){
    $("body").hide();
    document.write("Screen to small to run simulation. Please use desktop.")
  }
})
// $(document).ready(function(){
//     if ($(window).width() < 770 && $(window).load()) {
//         $("#main-content").hide();
//         console.log("started to small");
//     }
//
//     if($(window).load()){
//         if ($(window).width() < 770) {
//         $("#main-content").hide();
//         console.log("sts2");
//         }
//     }
//
// $(window).resize(function() {
//     if ($(window).width() < 770 && $(window).load()) {
//         $("#main-content").hide();
//         console.log("resized to small");
//     }
//     else{
//         $("#main-content").show();
//     }
//
//     if($(window).load()){
//         if ($(window).width() < 770) {
//         $("#main-content").hide();
//         }
//     }
//     else{
//         $("#main-content").show();
//     }
//
// });});
