var endpoint = "https://data.cityofchicago.org/resource/7piw-z6r6.json";
var tmdbapikey = "48804f9b78ec648fbe28f7f87eb9e766";
var tmdbEndpoint = "https://api.themoviedb.org/3/search/movie?api_key="
var movies = [];
var titles = [];
var locations= [];
var sortedByDate = [];
var lati = 0.0;
var long = 0.0;
var counter = 0;

var map;



$(document).ready(function(){
  $('.switch').hide();
  $('#map').hide();

  var switchboxcounter = 0;
  $('#customSwitch1').on("click", function(){
    if(switchboxcounter % 2 == 0){
      $('#customSwitch1').attr('value', 'o2');
      $('.cardsonquerypage').hide();
      $('#map').show();
    }
    else{
      $('#customSwitch1').attr('value', 'o1');
      $('.cardsonquerypage').show();
      $('#map').hide();
    }
    console.log(switchboxcounter);
    switchboxcounter++;
  });

  var checkboxcounter = 0;
  $("#inlineCheckbox1").on("click", function(){
    if(checkboxcounter % 2 == 0){
      $('#inlineCheckbox1').attr('value', 'o2');
    }
    else{
      $('#inlineCheckbox1').attr('value', 'o1');
    }
    console.log(checkboxcounter);
    checkboxcounter++;
  });

  $( ".searchbutton" ).unbind( "click" );

  $(".submitbutton").click(function(e){
    e.preventDefault();
    if($('.alert').length){
      $('.alert').remove();
    }
    if($("#parklocation").val() === "" && $("#moviename").val() === ""
      && $("#inlineFormCustomSelect").val() === "ChooseDay"){
      hideScreens();
      $('#search').show();
      $(".forWarning").append('<div class="alert alert-warning" role="alert">'+
                                  'Please select at least one input!!' +
                              '</div>');
    }
    else{
      hideScreens();
      var buildList = [];
      if($("#inlineFormCustomSelect").val() === "ChooseDay"){
        $('#search').show();
        $(".forWarning").append('<div class="alert alert-warning" role="alert">'+
                                    'Please select a Day!!' +
                                '</div>');
      }
      else{
        console.log("here");
        $.each(movies, function(i, v){
          if($("#inlineCheckbox1").val() === 'o1'){
            console.log("box is checked");
            var date = new Date(v.date);
            var currdate = new Date();
            if(currdate.getFullYear() <= date.getFullYear() && currdate.getDate() <= date.getDate() &&
                currdate.getMonth() <= date.getMonth()){
              if($("#moviename").val() === "" && $("#parklocation").val() !== "" ){
                   if(v.park === $("#parklocation").val() && $("#inlineFormCustomSelect").val() === v.day){
                     buildList.push(v);
                   }
              }
              else if($("#moviename").val() !== "" && $("#parklocation").val() === ""){
                if(v.title === $("#moviename").val() && $("#inlineFormCustomSelect").val() === v.day){
                  buildList.push(v);
                }
              }
              else if($("#moviename").val() !== "" && $("#parklocation").val() !== ""){
                if(v.title === $("#moviename").val() && v.park === $("#parklocation").val() && $("#inlineFormCustomSelect").val() === v.day){
                  buildList.push(v);
                  console.log(v.title + "unchecked");
                }
              }
            }//Check if date is upcoming

          }
          else{
              console.log("unchecked");
              if($("#moviename").val() === "" && $("#parklocation").val() !== "" ){
                   if(v.park === $("#parklocation").val() && $("#inlineFormCustomSelect").val() === v.day){
                     buildList.push(v);
                   }
              }
              else if($("#moviename").val() !== "" && $("#parklocation").val() === ""){
                if(v.title === $("#moviename").val() && $("#inlineFormCustomSelect").val() === v.day){
                  buildList.push(v);
                }
              }
              else if($("#moviename").val() !== "" && $("#parklocation").val() !== ""){
                if(v.title === $("#moviename").val() && v.park === $("#parklocation").val() && $("#inlineFormCustomSelect").val() === v.day){
                  buildList.push(v);
                  console.log(v.title + "unchecked");
                }
              }
          }//if checkbox is checked or not
        });

        if(buildList.length === 0){
          $('#search').show();
          $(".forWarning").append('<div class="alert alert-warning" role="alert">'+
                                      'No upcoming movies found by this movie name or location!!' +
                                  '</div>');
        }
        else{
          $('.switch').show();
          addMovieCards(buildList, 0, '.querypage', 'cardsonquerypage')//each object

          $.each(buildList, function(i, v){
            createMarker(v);
          });
        }//if list length is 0 or not
      }
    }
  });

  function createMarker(v){
    var title = v.title;
    title = title.replace(/ /g,"+");

    $.get(tmdbEndpoint + tmdbapikey + "&query=" + title, function(response1){
      var cc = "";
      if(v.cc == "Y"){
        cc = "Available";
      }
      else{
        cc = "Not Available";
      }

      var overview = "";
      try{
        overview = response1.results[0]["overview"];
      }
      catch(error){
        console.log("No overview for movie " + v.title + "\nError: " + error);
        overview = "No overview available for this movie";
      }

      var date = new Date(v.date);//(v.date).replace("T00:00:00.000", "");

      var options = { month: 'long'};
      var month = new Intl.DateTimeFormat('en-US', options).format(date);


      var contentString = '<div>'+
                            '<div class="card">' +
                                '<div class="card-block">' +
                                    '<h3 class="card-title">'+ v.title +'</h4>'+
                                    '<h6><b>Rating:</b> ' + v.rating + '</h6>'+
                                    '<h6><b>Overview:</b> ' + overview + '</h6>'+
                                    '<h6><b>Location:</b> ' + v.park + '</h6>' +
                                    '<h6><b>Address:</b> ' + v.park_address + '</h6>' +
                                    '<h6><b>Date:</b> ('+ v.day + ') ' + month + " " + date.getDate()+ ", "+ date.getFullYear() + '</h6>' +
                                    '<h6><b>Closed-Caption:</b> ' + cc + '</h6>'+
                                '</div>' +
                              '</div>'+
                          '</div>';
     imgLocation = "";

     var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    try{
      lati = parseFloat(v.location.latitude);
      long = parseFloat(v.location.longitude);
      console.log(lati);
    }
    catch(error){
      lati = 41.8781;
      long = -87.6298;
    }

    var marker = new google.maps.Marker({
      position: {lat: lati, lng: long},
      map: map,
      title: v.title
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });

}

  $('#accordion').on('show hide', function() {
    $(this).css('height', '100%');
  });

  function hideScreens() {
        $(".content").hide();
      }

  $(".nav-link").on("click", function(){
    hideScreens();
    var target = $(this).attr("href");
    if(target !== '#mainpage'){
      $('#mainpage').hide();
    }

    if($('.alert').length){
      $('.alert').remove();
    }


    if($('.cardsonquerypage').length > 0){
      $('.cardsonquerypage').remove();
    }

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.8781, lng: -87.6298},
      zoom: 8
    });

    $('#customSwitch1').attr('value', 'o1');
    switchboxcounter = 0;

    $('.switch').hide();
    $('#map').hide();
    $(target).show();
  });

  $(".navbar-toggler").on("click", function(){
    if(counter % 2 != 0){
      $("body").css("padding-top", "60px");
    }
    else{
      $("body").css("padding-top", "220px");
    }
    counter++;
  });

  $.get(endpoint+"?$SELECT=*", function(response){
    addMovieCards(response, 1, '.mainpage', 'cardsonmainpage');//each object
  });//get everything
});//document


function initMap() {
  console.log("map");
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8781, lng: -87.6298},
    zoom: 8
  });
}//initMap()

//Used as refrence https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

autocomplete(document.getElementById("moviename"), titles);
autocomplete(document.getElementById("parklocation"), locations);


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

function addMovieCards(movieobjects, mainpagecards, targetclass, cardclass){
  if(mainpagecards == 0){

  }
  console.log(movieobjects);
  $.each(movieobjects, function(i, v) {
    if(mainpagecards == 1){
      movies.push(v);
      var dup = 0;
      for(var j = 0; j < i; j++){
        if(titles[j] === v.title){
          dup = 0;
          break;
        }
        else{
          if(j+1 == i){
            dup = 1;
          }
          continue;
        }
      }
      if(dup == 1){
        titles.push(v.title);
      }

      dup = 0;
      for(var j = 0; j < i; j++){
        if(locations[j] === v.park){
          dup = 0;
          break;
        }
        else{
          if(j+1 == i){
            dup = 1;
          }
          continue;
        }
      }

      if(dup == 1){
        locations.push(v.park);
      }

    }
    var title = v.title;
    title = title.replace(/ /g,"+");

    var imgLocation = "https://image.tmdb.org/t/p/w500";
    $.get(tmdbEndpoint + tmdbapikey + "&query=" + title, function(response1){
      try{
        imgLocation += response1.results[0]["poster_path"];
      }
      catch(error){
        imgLocation = "https://picsum.photos/id/870/200/300?grayscale&blur=2";
        console.log("Couldn't the poster image for " + v.title + ". \nError: " + error);
      }

      var cc = "";
      if(v.cc == "Y"){
        cc = "Available";
      }
      else{
        cc = "Not Available";
      }

      var overview = "";
      try{
        overview = response1.results[0]["overview"];
      }
      catch(error){
        console.log("No overview for movie " + v.title + "\nError: " + error);
        overview = "No overview available for this movie";
      }

      var date = new Date(v.date);//(v.date).replace("T00:00:00.000", "");

      var options = { month: 'long'};
      var month = new Intl.DateTimeFormat('en-US', options).format(date);


      $(targetclass).append('<div class="col-sm-4 '+ cardclass + '">'+
                          '<div class="card">' +
                                '<img class="card-img-top img-fluid" src=' + imgLocation +' alt="Card image cap">' +
                                '<div class="card-block">' +
                                    '<h3 class="card-title">'+ v.title +'</h4>'+
                                    '<h6><b>Rating:</b> ' + v.rating + '</h6>'+
                                    '<h6><b>Overview:</b> ' + overview + '</h6>'+
                                    '<h6><b>Location:</b> ' + v.park + '</h6>' +
                                    '<h6><b>Address:</b> ' + v.park_address + '</h6>' +
                                    '<h6><b>Date:</b> ('+ v.day + ') ' + month + " " + date.getDate()+ ", "+ date.getFullYear() + '</h6>' +
                                    '<h6><b>Closed-Caption:</b> ' + cc + '</h6>'+
                                '</div>' +
                              '</div>'+
                          '</div>');
     imgLocation = "";
      //console.log(imgLocation);
    });
    //console.log(imgLocation);

  });//each object
}
