var endpoint = "https://data.cityofchicago.org/resource/7piw-z6r6.json";
var tmdbapikey = "48804f9b78ec648fbe28f7f87eb9e766";
var tmdbEndpoint = "https://api.themoviedb.org/3/search/movie?api_key="
var movies = [];
var sortedByDate = [];

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

$(document).ready(function(){
  $('#accordion').on('show hide', function() {
    $(this).css('height', '100%');
  });

  function hideScreens() {
        $(".content").hide();
      }

  $(".nav-link").on("click", function(){
    hideScreens();
    var target = $(this).attr("href");
    $(target).show();
  });

  $.get(endpoint+"?$SELECT=*", function(response){
    //movies = response;
    //console.log(movies);
    $.each(response, function(i, v) {
      movies.push(v);
      var title = v.title;
      title = title.replace(/ /g,"+");
      //console.log(title);
      var imgLocation = "https://image.tmdb.org/t/p/w500";
      $.get(tmdbEndpoint + tmdbapikey + "&query=" + title, function(response1){
        imgLocation += response1.results[0]["poster_path"];
        //console.log(imgLocation);
        //console.log(tmdbEndpoint + tmdbapikey + "&query=" + title)
        //console.log(tmdbEndpoint + tmdbapikey + "&query=" + title);
        var temp = (v.title).replace(/ /g,"");
        //console.log(i+temp);

        var id1 = create_UUID();
        var id2 = create_UUID();

        var cc = "";
        if(v.cc == "Y"){
          cc = "Available";
        }
        else{
          cc = "Not Available";
        }

        var date = (v.date).replace("T00:00:00.000", "");
        $(".mainpage").append('<div class="col-sm-4">'+
                            '<div class="card">' +
                                  '<img class="card-img-top img-fluid" src=' + imgLocation +' alt="Card image cap">' +
                                  '<div class="card-block">' +
                                      '<h3 class="card-title">'+ v.title +'</h4>'+
                                  '</div>' +
                                  '<div class="card-header" id="' + id1 + '">'+
                                    '<h5 class="mb-0">' +
                                      '<button class="btn btn-link" data-toggle="collapse" data-target="#' + id2 + '" aria-expanded="false" aria-controls="' + id2 + '">'+
                                        'Info'+
                                      '</button>'+
                                    '</h5>' +
                                  '</div>' +
                                  '<div id="' + id2 + '" class="collapse" aria-labelledby="' + id1 + '" data-parent="#accordion">'+
                                    '<div class="card-body">'+
                                      '<h6>Location: ' + v.park + '</h6>' +
                                      '<h6>Address: ' + v.park_address + '</h6>' +
                                      '<h6>Date: ' + date + '</h6>' +
                                      '<h6>Closed-Caption: ' + cc + '</h6>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                          '</div>');
       imgLocation = "";
        //console.log(imgLocation);
      });
      //console.log(imgLocation);

    });//each object
  });//get everything
  //sortedByDate = movies.slice().sort((a, b) => b.date - a.date)
  //console.log(sortedByDate);
  //console.log(movies);
});//document

function autocomplete(input, arr){
  var current;
  input.addEventListener("input", function(e){

  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
