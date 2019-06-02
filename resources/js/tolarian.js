var TolarianLibrary = {};

$(document).ready(function() {

  $('#advanced-search').on('click', function() {
    $('#advanced-search').removeClass('rest').addClass('active');
    $('.content-container').css({
      top: 0 });
    TolarianLibrary.showAdvancedSearch();
    });

});

TolarianLibrary.showAdvancedSearch = function() {
  var $content = $('.content-container');
  var $advancedSearchBox =
    '<div class="advanced-search">' +


    '</div>';
    
  $content.append($advancedSearchBox);
}

/* $(document).ready(function() {

  /* $('#search-button').on('click', function() {
    TolarianLibrary.ajaxRequest($('#search-input').val());
  });

  $(document).keypress(function(e) {
    var key = e.which;
    if (key === 13) {
      TolarianLibrary.ajaxRequest($('#search-input').val());
    };
  });

  var $body = $('body');
  var $cardList = $('#card-list');

  $(document).on({
    ajaxStart: function() {
      $body.removeClass('relative');
      $cardList.empty();
      $body.addClass('loading');
    },
    ajaxStop: function() {
      $body.removeClass('loading');
    }
  })

}); */

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

TolarianLibrary.ajaxRequest = function(name) {
  $.ajax({
    url: 'https://api.magicthegathering.io/v1/cards?name=' + name,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      //TolarianLibrary.renderRulings(response.cards, 0);
      TolarianLibrary.renderCards(response.cards);
      //console.log(response.cards[0].rulings);
    }
  });
};
