var TolarianLibrary = {};

//var magicAPI = 'https://api.magicthegathering.io/v1/';
//var magicAPISets = 'https://api.magicthegathering.io/v1/sets';
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
  var $cardResult = $('.card-result');
  var $cardDetail = $('#card-detail');

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
        imageUrl = cards[index].card_faces[0].image_uris.normal;
      } else {
        imageUrl = cards[index].image_uris.normal;
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

  //renders details for each card on click
  function renderCardDetails(cards) {

    //DOM objects
    var $cardList = $('#card-list');
    var $cardResult = $('.card-result');
    var $cardDetail = $('#card-detail');
    var $body = $('body');
    //var $defaultImg = $('#defaultImg');
    //var $printImg = $('#printImg');

    //converts bracket costs (i.e. {W}) into mana.css symbols
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

    //converts bracket costs in card's text to mana.css symbols
    function visualizeOracleText(text) {

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

    //returns a card's flavor text
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

    //returns a card's legalities <div>
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

    //returns HTML rows of data for each card printing
    function getPrintings(printings) {
      var printRow = '';

      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      for (var p = 0; p < printings.length; p++) {

        var printId = "printId-" + p;
        var variableUSD = '$' + printings[p].prices.usd;
        var variableFoil = '$' + printings[p].prices.usd_foil;

        if (printings[p].prices.usd === null) {
          variableUSD = "N/A";
        }
        if (printings[p].prices.usd_foil === null) {
          variableFoil = "N/A";
        }

        var printRow = printRow +
        "      <div id=" + p + " class='printing'>" +
        "        <div class='print-info'>" +
        "          <i class='ss ss-" + printings[p].set + " ss-2x ss-white ss-fw'></i>" +
        "          <div class='set-data'>" +
        "            <p>" + printings[p].set_name + "</p>" +
        "            <p>#" + printings[p].collector_number + " &middot; " + capitalize(printings[p].rarity) + " &middot; " + printings[p].lang.toUpperCase() + "</p>" +
        "          </div>" +
        "        </div>" +
        "        <div class='prices'>" +
        "          <div class='market-value'>" +
        "            <p class='label'>Non-foil</p>" +
        "            <p class='median'>" + variableUSD + "</p>" +
        "          </div>" +
        "          <div class='market-value'>" +
        "            <p class='label'>Foil</p>" +
        "            <p class='foil'>" + variableFoil + "</p>" +
        "          </div>" +
        "          <div class='market-value shop'>" +
        "            <p class='label'>Shop</p>" +
        "            <a href=" + printings[p].purchase_uris.tcgplayer + " target='_blank'><i class='fa fa-shopping-cart'></i></a>" +
        "          </div>" +
        "        </div>" +
        "      </div>";
      }
      return printRow;

    }

    //returns HTML rows of data for each card's ruling
    function getRulings(rulings) {
      var rulingsHtml = '';

      if (rulings === undefined || rulings === null || rulings === []) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        rulingsHtml = rulingsHtml +
        "<div class='ruling'>" +
        "  <p>No rulings as of " + date + "</p>" +
        "</div>";
        return rulingsHtml;
      } else {
        for (var r = 0; r < rulings.length; r++) {
          rulingsHtml = rulingsHtml +
          "<div class='ruling'>" +
          "  <p>" +
          rulings[r].comment +
          "  </br>" +
          "  <span class='date'>(" + rulings[r].published_at + ")</span>" +
          "  </p>" +
          "</div>";
        }
      }
      return rulingsHtml;
    }

    //renders a card's details on click with the help from the above functions
    function cardDetails(card, printings, rulings) {
      var imageUrl = '';

      if (card.card_faces) {
        imageUrl = card.card_faces[0].image_uris.large;
      } else {
        imageUrl = card.image_uris.large;
      }

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

      var cardHTML =

      "<div id='back'class='action-button'>" +
      "  <button>Back to results</button>" +
      "</div>" +
      "<section class='result'>" +
      "  <div class='info-row'>" +
      "    <div class='card-image'>" +
      "      <img id='defaultImg' src=" + imageUrl + " alt=" + name + " />" +
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
      "    <p id='rulings-header'>Rulings and information for " + card.name + "</p>" +
      "    <div class='rulings'>" +
           getRulings(rulings) +
      "    </div>" +
      "  </div>" +
      "</section>";

      return cardHTML;

    }

    var currentLocation;

    $cardResult.on('click', function() {
      currentLocation = window.pageYOffset;

      var tcgPlayerID = $(this).attr('id');

      //finds the correct printings url to query for the selected card
      function printIndex() {
        var printIndex = 0;
        for (var i = 0; i < cards.length; i++) {
          printIndex++;
          if (tcgPlayerID == cards[i].tcgplayer_id) {
            return printIndex -1;
          }
        }
      }

      //finds the correct index for the selected card's rulings, since ajax returns rulings objects out of order in the cardRulings array
      function findRuling(i) {
        for (var r = 0; r < cardRulings.length; r++) {
          if (cardRulings[r][0] === i) {
            return cardRulings[r][1].data;
          }
        }
      }

      //pushes a selected card's printings images to a holding array
      function addPrintsImages(cards) {
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].card_faces) {
            printingsImages.push(cards[i].card_faces[0].image_uris.large);
          } else {
            printingsImages.push(cards[i].image_uris.large);
          }
        }
      }

      $cardResult.detach();
      $search.hide();

      //printings request made on click per card
      $.ajax({
        url: printingsUrls[printIndex()],
        type: 'GET',
        dataType: 'JSON',
      }).done(function(response) {
        console.log(response.data);
        for (var index = 0; index < cards.length; index++) {
          if (tcgPlayerID == cards[index].tcgplayer_id) {
            addPrintsImages(response.data);

            var cardHTML = cardDetails(cards[index], response.data, findRuling(index));
            $cardList.append(cardHTML);

            window.scrollTo(0, 0);
          }
        }
      });

      $(document).on('click', 'div.printing', function() {
        var $defaultImg = $('#defaultImg');
        var $printId = $(this).attr('id');
        $defaultImg.attr('src', printingsImages[$printId]);
      });

    });

    $(document).on('click', '#back', function() {
      printingsImages = [];
      $cardList.empty();
      $search.show();
      $cardList.append($cardResult);
      window.scrollTo(0, currentLocation);
    });

  }

  //renders html for 404 errors
  function noResults() {
    var html404 =

    "<div class='no-results'>" +
    "  <img src='./resources/images/card-unavailable.png' alt='404 - no cards found' />" +
    "  <h1>No results</h1>" +
    "  <h2><a href='index.html'>Try another search</a></h2>" +
    "</div>";

    $cardList.append(html404);
  }

  //ajax holding arrays
  var printingsUrls = [];
  var rulingsUrls = [];
  var cardRulings = [];
  var printingsImages = [];

  var normalSearch = {
    url: scryfallAPI + TolarianLibrary.getNameParam("name"),
    type: 'GET',
    dataType: 'JSON',
    statusCode: {
      404: function() {
        noResults();
      }
    },
    success: function(response) {
      $search.removeClass('hide');
      renderCardImages(response.data);
      renderCardDetails(response.data);
      $backToTop.removeClass('hide');
      for (var i = 0; i < response.data.length; i++) {
        printingsUrls.push(response.data[i].prints_search_uri);
        rulingsUrls.push(response.data[i].rulings_uri);
      }
    }
  };
  var advancedSearch = {
    url: scryfallAdvancedSearch + TolarianLibrary.getScryfallParams(),
    type: 'GET',
    dataType: 'JSON',
    statusCode: {
      404: function() {
        noResults();
      }
    },
    success: function(response) {
      $search.removeClass('hide');
      renderCardImages(response.data);
      renderCardDetails(response.data);
      $backToTop.removeClass('hide');
      for (var i = 0; i < response.data.length; i++) {
        printingsUrls.push(response.data[i].prints_search_uri);
        rulingsUrls.push(response.data[i].rulings_uri);
      }
    }
  }

  //finds correct rulings for a card since ajax returns ruling data asynchronously
  function rulingsCallback(r) {
    return function(response) {
      cardRulings.push([
        r, response
      ]);
    }
  }

  //make the ajax request by checking the URL
  var urlTest = window.location.search;

  if (urlTest.startsWith("?name=")) {
    $.ajax(normalSearch).done(function() {
      for (var r = 0; r < rulingsUrls.length; r++) {
        $.ajax({
          url: rulingsUrls[r],
          type: 'GET',
          dataType: 'JSON',
          success: rulingsCallback(r)
        });
      }
    })
  } else {
    $.ajax(advancedSearch).done(function() {
      for (var r = 0; r < rulingsUrls.length; r++) {
        $.ajax({
          url: rulingsUrls[r],
          type: 'GET',
          dataType: 'JSON',
          success: rulingsCallback(r)
        });
      }
    })
  };

};
