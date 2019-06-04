var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/cards';

$(document).ready(function() {

  //sets a click handler for the main search icon
  $('#search-button').on('click', function() {
    TolarianLibrary.ajaxRequest(magicAPI + '?name' + $('#search-input').val());
  });

  //enables the Enter key to perform a generic search
  $(document).keypress(function(e) {
    var key = e.which;
    if (key === 13) {
      TolarianLibrary.ajaxRequest(magicAPI + '?name' + $('#search-input').val());
    };
  });

  //sets a click handler for the advanced search button
  $('#advanced-search-button').on('click', function() {
    TolarianLibrary.advancedSearch();
  });

  //sets click handlers for the options tabs
  $('#advanced-search').on('click', function() {
    $('#generate-booster')
      .removeClass('active')
      .addClass('rest');
    $('.generate-booster').css({ "display": "none" });
    $('#advanced-search')
      .toggleClass('rest')
      .toggleClass('active');
    $('.advanced-search').slideToggle('hide');
  });

  $('#generate-booster').on('click', function() {
    $('#advanced-search')
      .removeClass('active')
      .addClass('rest');
    $('.advanced-search').css({ "display": "none" });
    $('#generate-booster')
      .toggleClass('rest')
      .toggleClass('active');
    $('.generate-booster').slideToggle('hide');
  });

  var $checkbox = $('input[type=checkbox]');

  var selectedColors = '';

  $checkbox.on('click', function() {
    if ($(this).prop('checked', false)) {
      $(this).prop('checked', true);
      console.log("it's checked!");
      selectedColors += this.id;
    }
    console.log(selectedColors);
  });

});

TolarianLibrary.selectedColors = function() {

  $checkbox = $('input[type=checkbox]');

  const selectedColors = '';

  $checkbox.on('click', function() {
    if ($('input[type=checkbox]:checked')) {
      console.log("it's checked!")
    }
    console.log(selectedColors);
  });
  //return a string of selected color words
}

TolarianLibrary.advancedSearch = function() {

  var magicAPIparams = 'https://api.magicthegathering.io/v1/cards?';

  var $name = $('#card-name').val();
  var $cmc = $('#cmc').val();
  var $text = $('#text').val();
  var $types = $('#types').val();
  //var $colors = TolarianLibrary.selectedColors(); //returns a string of color words
  var $rarity = $('#rarity').val();
  var $set = $('#set').val();
  var $power = $('#power').val();
  var $toughness = $('#toughness').val();
  var $artist = $('#artist').val();
  var $language = $('#language').val();

  const searchEntries = {
    name: $name,
    cmc: $cmc,
    text: $text,
    types: $types,
    //colors: $colors,
    rarity: $rarity,
    set: $set,
    power: $power,
    toughness: $toughness,
    artist: $artist,
    language: $language
  };

  for (key in searchEntries) {
    if (searchEntries[key] == '') {
      delete searchEntries[key];
    }
  }

  console.log(searchEntries);

  console.log($.param(searchEntries));

  var searchUrl = '';
}


//when called, the card array and the current index of that array are sent as parameters
TolarianLibrary.renderRulings = function(cards, index) {

  var rulingsArray = cards[index].rulings;
  var rulingsBox = '<h2>Rulings</h2>';

  if (rulingsArray.length === 0) {
    rulingsBox = '';
    return rulingsBox;
  };

    for (var ruling = 0; ruling < rulingsArray.length; ruling++) {
      var date = rulingsArray[ruling].date;
      var text = rulingsArray[ruling].text;
      rulingsBox = rulingsBox + '<p>' + date + ': ' + text + '</p>';
   }

   return rulingsBox;

};

//when called, a card list is sent as a parameter and card attributes are rendered
TolarianLibrary.renderCards = function(cards) {

  var $cardList = $('#card-list');
  $cardList.empty();

  //main loop - renders each card
  for (var index = 0; index < cards.length; index++) {

    var imageUrl = cards[index].imageUrl;

    if (imageUrl === undefined) {
      imageUrl = './resources/images/card-unavailable.png';
    };

    var name = cards[index].name;
    var manaCost = cards[index].manaCost;
    var cmc = cards[index].cmc;
    var type = cards[index].type;
    var rarity = cards[index].rarity;
    var text = cards[index].text;
    var flavor = cards[index].flavor;

    var flavorRow =

    '    <dl>                                    ' +
    '      <dt>Flavor text:</dt>                 ' +
    '      <dd class="flavor">' + flavor + '</dd>' +
    '    </dl>                                   ';

    if (flavor === undefined) {
      flavorRow = '';
    };

    var set = cards[index].set;
    var artist = cards[index].artist;

    var cardResult =

    '<div class="result">' +
    '  <img src="' + imageUrl + '" alt="' + name + ' card" />    ' +
    '  <div class="card-info">                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Card name:</dt>                                   ' +
    '      <dd>' + name + '</dd>                                 ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Mana cost:</dt>                                   ' +
    '      <dd>' + manaCost + '</dd>                             ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>CMC:</dt>                                         ' +
    '      <dd>' + cmc + '</dd>                                  ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Type:</dt>                                        ' +
    '      <dd>' + type + '</dd>                                 ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Rarity:</dt>                                      ' +
    '      <dd>' + rarity + '</dd>                               ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Card text:</dt>                                   ' +
    '      <dd>' + text + '</dd>                                 ' +
    '    </dl>                                                   ' +
    '    ' + flavorRow + '                                       ' +
    '    <dl>                                                    ' +
    '      <dt>Set:</dt>                                         ' +
    '      <dd>' + set + '</dd>                                  ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Artist:</dt>                                      ' +
    '      <dd>' + artist + '</dd>                               ' +
    '    </dl>                                                   ' +
    ' </div>                                                     ' +
    ' <div id="rulings" class="rulings">                         ' +
    '   ' + TolarianLibrary.renderRulings(cards, index) + '      ' +
    '  </div>                                                    ' +
    '</div>                                                      ';

    $cardList.append(cardResult);

  };

  var $body = $('body');
  $body.addClass('relative');

};

TolarianLibrary.ajaxRequest = function(url) {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      //TolarianLibrary.renderRulings(response.cards, 0);
      //TolarianLibrary.renderCards(response.cards);
      console.log(response.cards);
    }
  });
};
