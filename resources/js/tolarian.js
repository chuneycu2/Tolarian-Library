var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';
var magicAPISets = 'https://api.magicthegathering.io/v1/sets';
var scryfallAPI = 'https://api.scryfall.com/cards/search?q=name:';
var scryfallAdvancedSearch = 'https://api.scryfall.com/cards/search?q=';
var tcgPlayer_productId = 'https://api.tcgplayer.com/v1.9.0/catalog/products/'; // + product ID

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
      var tcgPlayerID = cards[index].tcgplayer_id;

      if (tcgPlayerID === undefined) {
        tcgPlayerID = cards[index].oracle_id;
      }

      if (imageUrl === './resources/images/card-unavailable.png') {
        var cardResult =
        '<div class="card-result" id="' + tcgPlayerID + '">                     ' +
        '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
        '  <div class="placeholder">                                             ' +
        '    <p>' + name + '</p>                                                 ' +
        '    <p>' + set + '</p>                                                  ' +
        '  </div>                                                                ' +
        '</div>                                                                  ';
      } else {
        var cardResult =
        '<div class="card-result" id="' + tcgPlayerID + '">                     ' +
        '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
        '</div>                                                                  ';
      }

    $cardList.append(cardResult);

    }

  };

  function renderCardDetails(cards) {

    var $cardList = $('#card-list');
    var $cardResult = $('.card-result');
    var $cardDetail = $('#card-detail');
    var $body = $('body');

    function visualizeManaCost(manaCost) {
      //change string from {3}{U}{W} to <img src"..."" /><img src"..."" /><img src"..."" />;

    }

    function getLegalities() {
      <div class="spec-row legalities">
        <div class="column">
          <div class="format">
            <div class="not-legal">
              <p>NOT LEGAL</p>
            </div>
            <p class="format-name">Standard</p>
          </div>
          <div class="format">
            <div class="not-legal">
              <p>NOT LEGAL</p>
            </div>
            <p class="format-name">Modern</p>
          </div>
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">Legacy</p>
          </div>
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">Vintage</p>
          </div>
        </div>
        <div class="column">
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">EDH</p>
          </div>
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">Frontier</p>
          </div>
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">Pauper</p>
          </div>
          <div class="format">
            <div class="legal">
              <p>LEGAL</p>
            </div>
            <p class="format-name">Penny</p>
          </div>
        </div>
      </div>
    }

    //parses through a card object sent by the $cardResult click handler
    function cardDetails(card) {
      var imageUrl = card.image_uris.large;
      var name = card.name;
      var manaCost = card.mana_cost;
      var types = card.type_line;
      var cardText = card.oracle_text;
      var flavorText = card.flavorText;
      var artist = card.artist;
      var legalities = card.legalities //object
      var tcg_url = card.purchase_uris.tcgplayer;

      var cardHTML =

      "<p id='back' class='back-to-results'>← Back to search results</p>" +
      "<section class='result'>" +
      "  <div class='info-row'>" +
      "    <div class='card-image'>" +
      "      <img src=" + imageUrl + " alt=" + name + " />" +
      "       <div class='language-views'>" +
      "        <div class='language-button'>" +
      "          <p>EN</p>" +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>ES</p>" +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>FR</p>" +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>DE</p> " +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>IT</p>" +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>JA</p>" +
      "        </div>" +
      "        <div class='language-button'>" +
      "          <p>汉语</p>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "    <div class='card-details'>" +
      "      <div class='spec-row'>" +
      "        <p>" + name + "</p>" +
               visualizeManaCost(manaCost) +
      "      </div>" +
      "      <div class='spec-row'>" +
      "        <p>" + types + "</p>" +
      "      </div>" +
      "      <div class='spec-row flavor'>" +
      "        <p>" + cardText + "</p>" +
      "        <p id='flavor-text'>" + flavorText + "</p>" +
      "      </div>" +
      "      <div class='spec-row'>" +
      "        <p id='artist'>Illustrated by " + artist + "</p>" +
      "      </div>" +
            getLegalities() +
      "    </div>" +
      "    <div class='card-prices'>" +
      "      <div class='printing'>" +
      "        <div class='print-info'>" +
      "          <i class='ss ss-c16 ss-2x ss-white'></i>" +
      "          <div class='set-data'>" +
      "            <p>Commander 2016 (C16)</p>" +
      "            <p>#143 &middot; Rare</p>" +
      "          </div>" +
      "        </div>" +
      "        <div class='prices'>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Low</p>" +
      "            <p class='low'>$5.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Median</p>" +
      "            <p class='median'>$10.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>High</p>" +
      "            <p class='high'>$15.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Foil</p>" +
      "            <p class='foil'>$1000.00</p>" +
      "          </div>" +
      "          <div class='market-value shop'>" +
      "            <p class='label'>Shop</p>" +
      "            <a href=" + tcg_url + "><i class='fa fa-shopping-cart'></i></a>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "      <div class='printing'>" +
      "        <div class='print-info'>" +
      "          <i class='ss ss-cn2 ss-2x ss-white'></i>" +
      "          <div class='set-data'>" +
      "            <p>Conspiracy: Take the Crown (CN2)</p>" +
      "            <p>#178 &middot; Rare</p>" +
      "          </div>" +
      "        </div>" +
      "        <div class='prices'>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Low</p>" +
      "            <p class='low'>$5.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Median</p>" +
      "            <p class='median'>$10.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>High</p>" +
      "            <p class='high'>$15.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Foil</p>" +
      "            <p class='foil'>$1000.00</p>" +
      "          </div>" +
      "          <div class='market-value shop'>" +
      "            <p class='label'>Shop</p>" +
      "            <a href=" + tcgUrl + "><i class='fa fa-shopping-cart'></i></a>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "      <div class='printing'>" +
      "        <div class='print-info'>" +
      "          <i class='ss ss-sth ss-2x ss-white'></i>" +
      "          <div class='set-data'>" +
      "            <p>Stronghold (STH)</p>" +
      "            <p>#102 &middot; Rare</p>" +
      "          </div>" +
      "        </div>" +
      "        <div class='prices'>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Low</p>" +
      "            <p class='low'>$5.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Median</p>" +
      "            <p class='median'>$10.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>High</p>" +
      "            <p class='high'>$15.00</p>" +
      "          </div>" +
      "          <div class='market-value'>" +
      "            <p class='label'>Foil</p>" +
      "            <p class='foil'>$1000.00</p>" +
      "          </div>" +
      "          <div class='market-value shop'>" +
      "            <p class='label'>Shop</p>" +
      "            <a href=" + tcgUrl + "><i class='fa fa-shopping-cart'></i></a>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "  <div class='rulings-row'>" +
      "    <p id='rulings-header'>Rulings and information for Burgeoning</p>" +
      "    <div class='rulings'>" +
      "      <div class='ruling'>" +
      "        <p>Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. <br> <span class='date'>(01-01-2019)</span></p>" +
      "      </div>" +
      "        <p>Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. <br> <span class='date'>(01-01-2019)</span></p>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</section>";

      return cardHTML;
    }

    $cardResult.on('click', function() {
      var tcgPlayerID = $(this).attr('id');

      for (var index = 0; index < cards.length; index++) {
        if (tcgPlayerID == cards[index].tcgplayer_id) {
          var cardHTML = cardDetails(cards[index]);
          $cardResult.detach();
          $cardList.append(cardHTML);
          window.scrollTo(0, 0);
        }
      }
    }

    $(document).on('click', '#back', function() {
      $cardList.empty();
      $cardList.append($cardResult);
    });

  }

  var normalSearch = {
    url: scryfallAPI + TolarianLibrary.getNameParam("name"),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $newSearch.removeClass('hide');
      renderCardImages(response.data);
      console.log(response.data);
      //renderCardDetails(response.data);
      $backToTop.removeClass('hide');
    }
  };

  var advancedSearch = {
    url: scryfallAdvancedSearch + TolarianLibrary.getScryfallParams(),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $newSearch.removeClass('hide');
      renderCardImages(response.data);
      console.log(response.data);
      //renderCardDetails(response.data);
      $backToTop.removeClass('hide');
    }
  }

  //make the ajax request by checking the URL
  var urlTest = window.location.search;

  if (urlTest.startsWith("?name=")) {
    $.ajax(normalSearch);
  } else {
    $.ajax(advancedSearch);
  };

};
