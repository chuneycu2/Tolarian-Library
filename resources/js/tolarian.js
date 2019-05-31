var TolarianLibrary = {};

$(document).ready(function() {
  $('#search-button').on('click', function() {
    TolarianLibrary.testAjax($('#search-input').val());
  });
});

/* TolarianLibrary.renderRulings = function(cards) {

  var rulingsArray = [];

  for (var cardsIndex = 0; cardsIndex < cards.length; cardsIndex++) { //loop through each card
    var cardRulings = []; //set an empty array for the rulings
    cardRulings.push(cards[cardsIndex].rulings); //push the rulings array for the current card to cardRulings
    rulingsArray.push(cardRulings[0]); //push the contents of cardRulings to the rulingsArray
  }
  //console.log(rulingsArray);

  /* var rulingsBox = '<h2>Rulings</h2>';

  for (var card = 0; card < rulingsArray.length; card++) {
    for (var ruling = 0; ruling < rulingsArray[card].length; ruling++) {
      rulingsBox = rulingsBox + '<p>' + rulingsArray[card][ruling].date + ': ' + rulingsArray[card][ruling].text + '</p>';
    }
  };
}; */

TolarianLibrary.renderCards = function(cards) {
  var $cardList = $('#card-list');
  $cardList.empty();

  var rulingsArray = [];

  for (var cardsIndex = 0; cardsIndex < cards.length; cardsIndex++) { //loop once for each card
    var cardRulings = []; //set an empty array for the rulings
    cardRulings.push(cards[cardsIndex].rulings); //push the rulings array for the current card to cardRulings
    rulingsArray.push(cardRulings[0]); //push the contents of cardRulings to the rulingsArray
  };

  //console.log(rulingsArray[0].length);

  for (var index = 0; index < cards.length; index++) {

    var rulingsBox = '<h2>Rulings</h2>';

    //console.log(rulingsArray[0].length);
    for (var ruling = 0; ruling < rulingsArray[index].length; ruling++) {
      //console.log(rulingsArray[ruling].length);
      var date = rulingsArray[index][ruling].date;
      var text = rulingsArray[index][ruling].text;
      //console.log(rulingsArray[0][0].date);
      rulingsBox = rulingsBox + '<p>' + date + ': ' + text + '</p>';
    };

    var imageUrl = cards[index].imageUrl;

    if (imageUrl === undefined) {
      imageUrl = './resources/images/card-unavailable.png';
    }

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
    }

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
    '   ' + rulingsBox + '                                       ' +
    '  </div>                                                    ' +
    '</div>                                                      ';

    $cardList.append(cardResult);
  };
};

TolarianLibrary.testAjax = function(name) {
  $.ajax({
    url: 'https://api.magicthegathering.io/v1/cards?name=' + name,
    success: function(response) {
      //TolarianLibrary.renderRulings(response.cards);
      TolarianLibrary.renderCards(response.cards);
      //console.log(response.cards);
    }
  });
}

/* v.01 notes */
/*

- Response time is low; consider storing data in an object variable so that in more complex designs, it can be easily retrieved after search is clicked

- Need to create a separate control flow for dates and rulings, as they reference arrays. An object can stand in for the jQuery object, which will display its own HTML that fits as many rulings as there are for a card

- Find a way to fix the global variable rulingsBox. How do you call it in renderCards()?

*/
