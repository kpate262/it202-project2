var endpoint = "https://data.cityofchicago.org/resource/7piw-z6r6.json";
var tmdbapikey = "48804f9b78ec648fbe28f7f87eb9e766";
var tmdbEndpoint = "https://api.themoviedb.org/3/search/movie?api_key="
$(document).ready(function(){
  $.get(endpoint+"?$SELECT=*", function(response){
    $.each(response, function(i, v) {
      var title = v.title;
      title = title.replace(/ /g,"+");
      console.log(title);
      var imgLocation = "https://image.tmdb.org/t/p/w500";
      $.get(tmdbEndpoint + tmdbapikey + "&query=" + title, function(response1){
        imgLocation += response1.results[0]["poster_path"];
        console.log(imgLocation);
        console.log(tmdbEndpoint + tmdbapikey + "&query=" + title)
        //console.log(tmdbEndpoint + tmdbapikey + "&query=" + title);
        $(".row").append('<div class="col-sm-4">'+
                            '<div class="card">' +
                                  '<img class="card-img-top img-fluid" src=' + imgLocation +' alt="Card image cap">' +
                                  '<div class="card-block">' +
                                      '<h3 class="card-title">'+ v.title +'</h4>'+
                                      '<h5 class="card-title">Park: '+ v.park +'</h4>' +
                                  '</div>' +
                              '</div>'+
                          '</div>');
       imgLocation = "";
        //console.log(imgLocation);
      });
      //console.log(imgLocation);

    });//each object
  });//get everything
});//document

function autocomplete(input, arr){
  var current;
  input.addEventListener("input", function(e){

  });
}
