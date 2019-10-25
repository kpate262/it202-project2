var endpoint = "https://data.cityofchicago.org/resource/7piw-z6r6.json";
var tmdbapikey = "48804f9b78ec648fbe28f7f87eb9e766";
var tmdbEndpoint = "https://api.themoviedb.org/3/search/movie?api_key="
var movies = [];
var titles = [];
var locations= [];
var sortedByDate = [];

var counter = 0;

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
    //movies = response;
    //console.log(movies);
    $.each(response, function(i, v) {
      movies.push(v);
      titles.push(v.title);
      locations.push(v.park);
      var title = v.title;
      title = title.replace(/ /g,"+");
      //console.log(title);
      var imgLocation = "https://image.tmdb.org/t/p/w500";
      $.get(tmdbEndpoint + tmdbapikey + "&query=" + title, function(response1){
        try{
          imgLocation += response1.results[0]["poster_path"];
        }
        catch(error){
          imgLocation = "https://picsum.photos/id/870/200/300?grayscale&blur=2";
          console.log("Couldn't the poster image for " + v.title + ". \nError: " + error);
        }
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
                                  '<div id="' + id2 + '" class="collapse" aria-labelledby="' + id1 + '" >'+
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
