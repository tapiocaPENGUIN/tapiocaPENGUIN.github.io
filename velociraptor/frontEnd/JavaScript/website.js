<!--Image Toggles -->
$(document).ready(function(){
  $("#img-field1").click(function(){
    $("#img-tog1").toggle();
  })
})
$(document).ready(function(){
  $("#img-field2").click(function(){
    $("#img-tog2").toggle();  
  })
})
$(document).ready(function(){
  $("#img-field3").click(function(){
    $("#img-tog3").toggle();
  })
})

<!--Video Toggles -->
$(document).ready(function(){
  $("#vid-field1").click(function(){
    $("#video-tog1").toggle();
  })
})

$(document).ready(function(){
  $("#vid-field2").click(function(){
    $("#video-tog2").toggle();
  })
})

$(document).ready(function(){
  $("#vid-field3").click(function(){
    $("#video-tog3").toggle();
  })
})

$(document).ready(function(){
  $("#vid-field4").click(function(){
    $("#video-tog4").toggle();
  })
})

$(document).ready(function(){
  $("#raptor").click(function(e){
    e.preventDefault();
    var content = $("#faq").html();
    var content2 = $("#new-title").html();
    var content3 = $("#new-header").html();
    $("#old-header").replaceWith('<h5 class="display-5">' + content3 + '</h5');
    $("#remove").replaceWith('<div>' + content + '</div>');
    $("#home-page").replaceWith('<h1 class="display-1">' + content2 + '</h1');
  })
})

// $(document).ready(function(){
//   $("#vid-field5").click(function(){
//     $("#video-tog5").toggle();
//   })
// })

// var url = "http://allorigins.me/get?url=" + encodeURIComponent("http://www.nfl.com/rulebook/beginnersguidetofootball");
// $.get(url, function(response){
//
//   console.log(response);
// })
//
// var myText = response.match(</?\bdiv\b[^>]*>);
// function test(){
//   document.write(myText);
// }
