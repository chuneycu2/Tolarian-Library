var TolarianLibrary = {};

$(document).ready(function() {
  $('#search-button').on('click', function() {
    TolarianLibrary.testAjax($('#search-input').val());
  })
});

TolarianLibrary.renderCards = function(cards) {
  var $cardList = $('#card-list');
  $cardList.empty();

  for (var index = 0; index < cards.length; index++) {
    //console.log(cards[index].name);
    var rulings = [];

    for (var ruling = 0; ruling < cards[index].rulings.length; ruling++) {
      rulings.push(cards.rulings[ruling]);
    };

    var imageUrl = cards[index].imageUrl;
    var name = cards[index].name;
    var manaCost = cards[index].manaCost;
    var cmc = cards[index].cmc;
    var type = cards[index].type;
    var text = cards[index].text;
    var flavor = cards[index].flavor;
    var set = cards[index].set;
    var artist = cards[index].artist;

    var cardResult =

    '<div class="result">' +
    '  <img src="' + imageUrl + '" alt="' + name + ' card art" />' +
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
    '      <dt>Card text:</dt>                                   ' +
    '      <dd>' + text + '</dd>                                 ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Flavor text:</dt>                                 ' +
    '      <dd class="flavor">' + flavor + '</dd>                ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Set:</dt>                                         ' +
    '      <dd>' + set + '</dd>                                  ' +
    '    </dl>                                                   ' +
    '    <dl>                                                    ' +
    '      <dt>Artist:</dt>                                      ' +
    '      <dd>' + artist + '</dd>                               ' +
    '    </dl>                                                   ' +
    ' </div>                                                     ' +
    ' <div class="rulings">                                      ' +
    '    <h2>Rulings</h2>                                        ' +
    '    <p>' + rulings[index] + '</p>                           ' +
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
      //console.log(response.cards.rulings);
    }
  });
}
