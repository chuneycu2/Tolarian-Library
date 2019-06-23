var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';

$(document).ready(function() {

});

TolarianLibrary.getCards = function() {

  //DOM objects
  var $body = $('body');
  var $newSearch = $('#new-search');
  var $cardList = $('#card-list');

  //displays a loading gif during ajax requests
  $(document).on({
    ajaxStart: function() {
      $body.addClass('loading');
    },
    ajaxStop: function() {
      $body.removeClass('loading');
    }
  });

  //retrieves the search entry from the URL
  function getSearchParams(k) {
   var p = {};
   location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s,k,v){
     p[k] = v
   })
   return k ? p[k] : p;
  }

  //renders each card image
  function renderCardImages(cards) {
    var cards = cards.cards;

    for (var index = 0; index < cards.length; index++) {

      var cardResult = '';
      var imageUrl = cards[index].imageUrl;

      if (imageUrl === undefined) {
        imageUrl = './resources/images/card-unavailable.png';
      };

      var name = cards[index].name;
      var set = cards[index].setName;
      var multiverseID = cards[index].multiverseid;

      if (multiverseID === undefined) {
        multiverseID = cards[index].id;
      }

      if (imageUrl === './resources/images/card-unavailable.png') {
        var cardResult =
        '<div class="card-result" id="' + multiverseID + '">                     ' +
        '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
        '  <div class="placeholder">                                             ' +
        '    <p>' + name + '</p>                                                 ' +
        '    <p>' + set + '</p>                                                  ' +
        '  </div>                                                                ' +
        '</div>                                                                  ';
      } else {
        var cardResult =
        '<div class="card-result" id="' + multiverseID + '">                     ' +
        '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
        '</div>                                                                  ';
      }

    $cardList.append(cardResult);

    }

  };

  //make the ajax request
  $.ajax({
    url: magicAPI + 'cards?name=' + getSearchParams("name"),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $newSearch.removeClass('hide');
      renderCardImages(response);
    }
  });

};
