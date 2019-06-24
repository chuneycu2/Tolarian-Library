var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';
var magicAPISets = 'https://api.magicthegathering.io/v1/sets';
var scryfallAPI = 'https://api.scryfall.com/cards/search?q=name:';
var scryfallAdvancedSearch = 'https://api.scryfall.com/cards/search?q=';
var tcgPlayer_productId = 'https://api.tcgplayer.com/v1.9.0/catalog/products/'; // + product ID

$(document).ready(function() {

});

TolarianLibrary.getNameParam = function(k) {
  //retrieves the search entry from the URL
  var p = {};
  location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s,k,v){
    p[k] = v
  })
  return k ? p[k] : p;
}

TolarianLibrary.getScryfallParams = function() {
  var url = window.location.search;
  url = url.replace('?', '');
  //console.log(url);
  return url;
}

TolarianLibrary.getCards = function() {

  //DOM objects
  var $body = $('body');
  var $newSearch = $('#new-search');
  var $cardList = $('#card-list');
  var $backToTop = $('#backToTop');

  //displays a loading gif during ajax requests
  $(document).on({
    ajaxStart: function() {
      $body.addClass('loading');
    },
    ajaxStop: function() {
      $body.removeClass('loading');
    }
  });

  //renders each card image
  function renderCardImages(cards) {
    var cards = cards.data;

    for (var index = 0; index < cards.length; index++) {

      var cardResult = '';
      var imageUrl = cards[index].image_uris;

      if (imageUrl === undefined) {
        imageUrl = cards[index].card_faces[0].image_uris.large;
      } else {
        imageUrl = cards[index].image_uris.large;
      }

      var name = cards[index].name;
      var set = cards[index].set_name;
      var multiverseID = cards[index].multiverse_ids;

      if (multiverseID === undefined) {
        multiverseID = cards[index].oracle_id;
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

  var normalSearch = {
    url: scryfallAPI + TolarianLibrary.getNameParam("name"),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $newSearch.removeClass('hide');
      renderCardImages(response);
      $backToTop.removeClass('hide');
      console.log(normalSearch.url);
    }
  };

  var advancedSearch = {
    url: scryfallAdvancedSearch + TolarianLibrary.getScryfallParams(),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $newSearch.removeClass('hide');
      renderCardImages(response);
      $backToTop.removeClass('hide');
      console.log(advancedSearch.url);
    }
  }

  //console.log(TolarianLibrary.getScryfallParams());
  var urlTest = window.location.search;
  //make the ajax request
  if (urlTest.startsWith("?name=")) {
    $.ajax(normalSearch);
  } else {
    $.ajax(advancedSearch);
  };

};
