var endpoint = "https://data.cityofchicago.org/resource/7piw-z6r6.json";
$(document).ready(function(){
  $.get(endpoint+"?$SELECT=*", function(response){
    $.each(response, function(i, v) {
      $(".row").append('<div class="col-sm-4">'+
                          '<div class="card">' +
                                '<img class="card-img-top img-fluid" src="https://picsum.photos/200" alt="Card image cap">' +
                                '<div class="card-block">' +
                                    '<h3 class="card-title">'+ v.title +'</h4>'+
                                    '<h5 class="card-title">Park: '+ v.park +'</h4>' +
                                '</div>' +
                            '</div>'+
                        '</div>');
    });//each object
  });//get everything
});//document

function autocomplete(input, arr){
  var current;
  input.addEventListener("input", function(e){

  });
}
