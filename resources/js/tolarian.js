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
  var $search = $('#search');
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
      //change string from {3}{U}{W} to "<i class='ms ms-cost ms-shadow" + class + "'></i>..."
      const symbolClassPairs = {
        'T': 'ms-tap',
        'Q': 'ms-untap',
        'W': 'ms-w',
        'U': 'ms-u',
        'B': 'ms-b',
        'R': 'ms-r',
        'G': 'ms-g',
        '1': 'ms-1',
        '2': 'ms-2',
        '3': 'ms-3',
        '4': 'ms-4',
        '5': 'ms-5',
        '6': 'ms-6',
        '7': 'ms-7',
        '8': 'ms-8',
        '9': 'ms-9',
        '10': 'ms-10',
        '11': 'ms-11',
        '12': 'ms-12',
        '13': 'ms-13',
        '14': 'ms-14',
        '15': 'ms-15',
        '16': 'ms-16',
        '17': 'ms-17',
        '18': 'ms-18',
        '19': 'ms-19',
        '20': 'ms-20',
        'X': 'ms-x',
        'Y': 'ms-y',
        'Z': 'ms-z',
        'P': 'ms-p',
        'S': 'ms-s',
        'E': 'ms-e',
        '2/W': 'ms-2w',
        '2/U': 'ms-2u',
        '2/B': 'ms-2b',
        '2/R': 'ms-2r',
        '2/G': 'ms-2g',
        'W/U': 'ms-wu',
        'W/B': 'ms-wb',
        'U/B': 'ms-ub',
        'U/R': 'ms-ur',
        'B/R': 'ms-br',
        'B/G': 'ms-bg',
        'R/G': 'ms-rg',
        'R/W': 'ms-rw',
        'G/W': 'ms-gw',
        'G/U': 'ms-gu',
        'W/P': 'ms-wp',
        'U/P': 'ms-up',
        'B/P': 'ms-bp',
        'R/P': 'ms-rp',
        'G/P': 'ms-gp',
        '1/2': 'ms-1-2',
        '100': 'ms-100',
        '1000000': 'ms-1000000'
      }

      var valuePairs = Object.entries(symbolClassPairs);
      var noBrackets = manaCost.replace(/{|}/g, ' '); // 3 U W
      var costArray = noBrackets.split(' ');

      var charHtml = '';

      for (var i = 0; i < costArray.length; i++) {
        if (costArray[i] !== '') {
          for (var z = 0; z < valuePairs.length; z++) {
            if (valuePairs[z][0] === costArray[i]) {
              charHtml += "<i class='ms ms-cost ms-shadow " + valuePairs[z][1] + "'></i>";
            }
          }
        }
      }
      return charHtml;
    }

    function visualizeOracleText(text) {
      // change brackets to $symbols - done
      // change + or - # to loyalty symbol
      // italicize reminder text
      const symbolClassPairs = {
        '{T}': 'ms-tap',
        '{Q}': 'ms-untap',
        '{W}': 'ms-w',
        '{U}': 'ms-u',
        '{B}': 'ms-b',
        '{R}': 'ms-r',
        '{G}': 'ms-g',
        '{C}': 'ms-c',
        '{1}': 'ms-1',
        '{2}': 'ms-2',
        '{3}': 'ms-3',
        '{4}': 'ms-4',
        '{5}': 'ms-5',
        '{6}': 'ms-6',
        '{7}': 'ms-7',
        '{8}': 'ms-8',
        '{9}': 'ms-9',
        '{10}': 'ms-10',
        '{11}': 'ms-11',
        '{12}': 'ms-12',
        '{13}': 'ms-13',
        '{14}': 'ms-14',
        '{15}': 'ms-15',
        '{16}': 'ms-16',
        '{17}': 'ms-17',
        '{18}': 'ms-18',
        '{19}': 'ms-19',
        '{20}': 'ms-20',
        '{X}': 'ms-x',
        '{Y}': 'ms-y',
        '{Z}': 'ms-z',
        '{P}': 'ms-p',
        '{S}': 'ms-s',
        '{E}': 'ms-e',
        '{2/W}': 'ms-2w',
        '{2/U}': 'ms-2u',
        '{2/B}': 'ms-2b',
        '{2/R}': 'ms-2r',
        '{2/G}': 'ms-2g',
        '{W/U}': 'ms-wu',
        '{W/B}': 'ms-wb',
        '{U/B}': 'ms-ub',
        '{U/R}': 'ms-ur',
        '{B/R}': 'ms-br',
        '{B/G}': 'ms-bg',
        '{R/G}': 'ms-rg',
        '{R/W}': 'ms-rw',
        '{G/W}': 'ms-gw',
        '{G/U}': 'ms-gu',
        '{W/P}': 'ms-wp',
        '{U/P}': 'ms-up',
        '{B/P}': 'ms-bp',
        '{R/P}': 'ms-rp',
        '{G/P}': 'ms-gp',
        '{1/2}': 'ms-1-2',
        '{100}': 'ms-100',
        '{1000000}': 'ms-1000000'
      }
      const loyaltyClassPairs = {
        '0': 'ms-loyalty-up ms-loyalty-0',
        '+1': 'ms-loyalty-up ms-loyalty-1',
        '+2': 'ms-loyalty-up ms-loyalty-2',
        '+3': 'ms-loyalty-up ms-loyalty-3',
        '+4': 'ms-loyalty-up ms-loyalty-4',
        '+5': 'ms-loyalty-up ms-loyalty-5',
        '+6': 'ms-loyalty-up ms-loyalty-6',
        '+7': 'ms-loyalty-up ms-loyalty-7',
        '+8': 'ms-loyalty-up ms-loyalty-8',
        '+9': 'ms-loyalty-up ms-loyalty-9',
        '+10': 'ms-loyalty-up ms-loyalty-10',
        '-1': 'ms-loyalty-down ms-loyalty-1',
        '-2': 'ms-loyalty-down ms-loyalty-2',
        '-3': 'ms-loyalty-down ms-loyalty-3',
        '-4': 'ms-loyalty-down ms-loyalty-4',
        '-5': 'ms-loyalty-down ms-loyalty-5',
        '-6': 'ms-loyalty-down ms-loyalty-6',
        '-7': 'ms-loyalty-down ms-loyalty-7',
        '-8': 'ms-loyalty-down ms-loyalty-8',
        '-9': 'ms-loyalty-down ms-loyalty-9',
        '-10': 'ms-loyalty-down ms-loyalty-10',
        '-11': 'ms-loyalty-down ms-loyalty-11',
        '-12': 'ms-loyalty-down ms-loyalty-12',
        '-13': 'ms-loyalty-down ms-loyalty-13',
        '-14': 'ms-loyalty-down ms-loyalty-14',
        '-15': 'ms-loyalty-down ms-loyalty-15'
      }

      var valuePairs = Object.entries(symbolClassPairs);

      var oracleText = text;
      var symbols = oracleText.match(/([+-]+[0-9]\d*|0)|(\{.*?\})/g);

      String.prototype.replaceAll = function(search, replace) {
        if (replace === undefined) {
          return this.toString();
        }
        return this.split(search).join(replace);
      }

      if (symbols !== null) {
        for (sym = 0; sym < symbols.length; sym++) {
          for (key = 0; key < valuePairs.length; key++) {
            if (symbols[sym] === valuePairs[key][0]) {
              oracleText = oracleText.replaceAll(symbols[sym], "<i class='ms ms-cost " + valuePairs[key][1] + "'></i>");
            }
          }
        }
        oracleText = "<p>" + oracleText + "</p>";
        return oracleText;
      } else {
        oracleText = "<p>" + oracleText + "</p>";
        return oracleText;
      }
    }

    function getFlavor(flavor) {
      var flavorText = '';

      if (flavor === '') {
        return flavorText;
      } else {
        flavorText +=
        "<p id='flavor-text'>" + flavor + "</p>";
        return flavorText;
      }
    }

    function getLegalities(legalities) {

      const legalArray = Object.entries(legalities);
      const formats = [
        "commander",
        "frontier",
        "legacy",
        "modern",
        "pauper",
        "penny",
        "standard",
        "vintage"
      ];

      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      var column1Html = '';
      var column2Html = '';
      var count = 0;

      for (var i = 0; i < legalArray.length; i++) {

        var legalStr = legalArray[i][1];
        var isLegal = legalStr.replace('_', ' ');

        for (var f = 0; f < formats.length; f++) {

          if (formats[f] === legalArray[i][0] && count < 4) {

          column1Html +=

          "<div class='format'>" +
          "<div class='" + legalArray[i][1] + "'>" +
          "<p>" + isLegal.toUpperCase() + "</p>" +
          "</div>" +
          "<p class='format-name'>" + capitalize(formats[f]) + "</p>" +
          "</div>";

          count++;

          } else if (formats[f] === legalArray[i][0] && count >= 4) {

          column2Html +=

          "<div class='format'>" +
          "<div class='" + legalArray[i][1] + "'>" +
          "<p>" + isLegal.toUpperCase() + "</p>" +
          "</div>" +
          "<p class='format-name'>" + capitalize(formats[f]) + "</p>" +
          "</div>";

          }
        }
      }

      var legalitiesDiv =

      "<div class='spec-row legalities'>" +
      "  <div class='column'>" +

      column1Html +

      "  </div>" +
      "  <div class='column'>" +

      column2Html +

      "  </div>" +
      "</div>";

      return legalitiesDiv;

    }

    function getPrintings(url) {

      function renderPrinting(cards) {
        var printRow = '';

        for (var card = 0; card < cards.length; card++) {
          var prices = [];

          $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "http://api.tcgplayer.com/v1.27.0/pricing/product/162150" + cards.tcgplayer_id,
            "method": "GET",
            "headers": {
              "Authorization": "Bearer pDEkTuj7VuuCpQvtkDRzZ7OK05rb0F3_N3FpuHnN2V_lgdAZdWimcO4z_UO4mSyMxCwS8P5-OjkkWz8ZiI71dosYC-0eIaRqK0V72raIM3bFj0VTm48M3bxTYWXDLhp_3H8qJH29pNbRpr0OD1cBr0NJnuUobyJpo9oIwMRDpRhKXDzrtxo0nKEnN0uOnINJ-pcG3ieQG5I6DyESGD0MY1_ys_amQ9c4a2Wc8QHSxCs-tr2YGoKzfRu3GQzZjvv5gT-8BSbbXQvKC1ZTfIT1pi6WG9FHJSNRP-sXD5K_MUYd1HRMKkdw5GDGPqioUvMqNGBliQ",
              "Accept": "*/*",
              "Cache-Control": "no-cache",
              "Postman-Token": "02721bfc-3fdc-4274-92b8-27fd622a7b13,463f4346-6a8d-42e7-81de-87d850e80c38",
              "cache-control": "no-cache"
            }
          }).done(function(response) {
            prices.push(response.results[0].lowPrice);
            prices.push(response.results[0].midPrice);
            prices.push(response.results[0].highPrice);
            if (response.results[1].midPrice) {
              prices.push(response.results[1].midPrice);
            } else {
              prices.push("N/A");
            }
          })

          var printRow = printRow +
          "      <div class='printing'>" +
          "        <div class='print-info'>" +
          "          <i class='ss ss-" + cards.set + " ss-2x ss-white'></i>" +
          "          <div class='set-data'>" +
          "            <p>" + cards.set_name + "</p>" +
          "            <p>#" + cards.collector_number + " &middot; " + cards.rarity + "</p>" +
          "          </div>" +
          "        </div>" +
          "        <div class='prices'>" +
          "          <div class='market-value'>" +
          "            <p class='label'>Low</p>" +
          "            <p class='low'>" + prices[0] + "</p>" +
          "          </div>" +
          "          <div class='market-value'>" +
          "            <p class='label'>Median</p>" +
          "            <p class='median'>" + prices[1] + "</p>" +
          "          </div>" +
          "          <div class='market-value'>" +
          "            <p class='label'>High</p>" +
          "            <p class='high'>" + prices[2] + "</p>" +
          "          </div>" +
          "          <div class='market-value'>" +
          "            <p class='label'>Foil</p>" +
          "            <p class='foil'>" + prices[3] + "</p>" +
          "          </div>" +
          "          <div class='market-value shop'>" +
          "            <p class='label'>Shop</p>" +
          "            <a href=" + cards.purchase_uris.tcg_player + " target='_blank'><i class='fa fa-shopping-cart'></i></a>" +
          "          </div>" +
          "        </div>" +
          "      </div>";
        }
        return printRow;
      }

      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        success: function(response) {
          renderPrinting(response.data);
        }
      });

    }

    //parses through a card object sent by the $cardResult click handler
    function cardDetails(card) {
      var imageUrl = card.image_uris.large;
      var name = card.name;
      var manaCost = card.mana_cost;
      var types = card.type_line;
      var cardText = card.oracle_text;
      var flavorText = card.flavor_text;

      if (flavorText === undefined) {
        flavorText = '';
      }

      var artist = card.artist;
      var legalities = card.legalities //object
      var tcg_url = card.purchase_uris.tcgplayer;
      var printings = card.prints_search_uris;


      var cardHTML =

      "<div id='back'class='action-button'>" +
      "  <button>Back to results</button>" +
      "</div>" +
      "<section class='result'>" +
      "  <div class='info-row'>" +
      "    <div class='card-image'>" +
      "      <img src=" + imageUrl + " alt=" + name + " />" +
      "       <div class='resource-links'>" +
      "        <a href=" + card.related_uris.edhrec + " target='_blank'>" +
      "        <div class='resource-button'>" +
      "          <p>EDHREC</p>" +
      "        </div>" +
      "        </a>" +
      "        <a href=" + card.related_uris.mtgtop8 + " target='_blank'>" +
      "        <div class='resource-button'>" +
      "          <p>MtGTop8</p>" +
      "        </div>" +
      "        </a>" +
      "        <a href=" + card.related_uris.gatherer + " target='_blank'>" +
      "        <div class='resource-button'>" +
      "          <p>Gatherer</p>" +
      "        </div>" +
      "        </a>" +
      "       </div>" +
      "    </div>" +
      "    <div class='card-details'>" +
      "      <div class='spec-row'>" +
      "        <p>" + name + "</p>" +
               visualizeManaCost(manaCost) +
      "      </div>" +
      "      <div class='spec-row'>" +
      "        <p>" + types + "</p>" +
      "      </div>" +
      "      <div class='spec-row oracle'>" +
               visualizeOracleText(cardText) +
               getFlavor(flavorText) +
      "      </div>" +
      "      <div class='spec-row'>" +
      "        <p id='artist'>Illustrated by " + artist + "</p>" +
      "      </div>" +
            getLegalities(legalities) +
      "    </div>" +
      "    <div class='card-prices'>" +
           getPrintings(printings) +
      "    </div>" +
      "  </div>" +
      "  <div class='rulings-row'>" +
      "    <p id='rulings-header'>Rulings and information for Burgeoning</p>" +
      "    <div class='rulings'>" +
      "      <div class='ruling'>" +
      "        <p>Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. Whenever an opponent plays a land, you may put a land card from your hand onto the battlefield. <br> <span class='date'>(01-01-2019)</span></p>" +
      "      </div>" +
      "      <div class='ruling'>" +
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
          $search.hide();
          $cardList.append(cardHTML);
          window.scrollTo(0, 0);
        }
      }
    });

    $(document).on('click', '#back', function() {
      $cardList.empty();
      $search.show();
      $cardList.append($cardResult);
    });

  }

  var normalSearch = {
    url: scryfallAPI + TolarianLibrary.getNameParam("name"),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $search.removeClass('hide');
      renderCardImages(response.data);
      console.log(response.data);
      renderCardDetails(response.data);
      $backToTop.removeClass('hide');
    }
  };

  var advancedSearch = {
    url: scryfallAdvancedSearch + TolarianLibrary.getScryfallParams(),
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      $search.removeClass('hide');
      renderCardImages(response.data);
      console.log(response.data);
      renderCardDetails(response.data);
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
