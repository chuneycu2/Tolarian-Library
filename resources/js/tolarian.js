var TolarianLibrary = {};

$(document).ready(function() {
  $('#search-button').on('click', function() {
    TolarianLibrary.testAjax($('#search-input').val());
  });
});

TolarianLibrary.renderRulings = function(cards) {

  let rulingsBox = '';

  let rulingsList = [];

  for (let rulingIndex = 0; rulingIndex < cards[0].rulings.length; rulingIndex++) { //loop through each ruling for the first card in the cards array
    if (cards[0].rulings.length !== 0 || rulingsList.length <= cards[0].rulings.length) { //check to see if there are zero rulings, or if the rulings array is full
      rulingsList.push(cards[0].rulings[rulingIndex]); //push the first ruling to the array, then repeat
    }
  }

  rulingsBox = '<h2>Rulings</h2>';

  for (let row = 0; row < rulingsList.length; row++) {
    rulingsBox = rulingsBox + '<p>' + rulingsList[row].date + ': ' + rulingsList[row].text + '</p>';
  };

  return rulingsBox;

};

TolarianLibrary.renderCards = function(cards) {
  var $cardList = $('#card-list');
  $cardList.empty();

  //var $rulingsHTML = $('#rulings');
  //$rulingsHTML.empty();

  for (var index = 0; index < cards.length; index++) {

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
    '   ' + TolarianLibrary.renderRulings(cards); + '            ' +
    '  </div>                                                    ' +
    '</div>                                                      ';

    $cardList.append(cardResult);
  };
};

TolarianLibrary.testAjax = function(name) {
  $.ajax({
    url: 'https://api.magicthegathering.io/v1/cards?name="' + name + '"',
    success: function(response) {
      TolarianLibrary.renderCards(response.cards);
      //console.log(response.cards[0]);
    }
  });
}

/* v.01 notes */
/*

- Response time is low; consider storing data in an object variable so that in more complex designs, it can be easily retrieved after search is clicked

- Need to create a separate control flow for dates and rulings, as they reference arrays. An object can stand in for the jQuery object, which will display its own HTML that fits as many rulings as there are for a card

- Find a way to fix the global variable rulingsBox. How do you call it in renderCards()?

*/
