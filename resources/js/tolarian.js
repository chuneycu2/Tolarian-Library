var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';

var boosterSets = ["Tenth Edition", "Unlimited Edition", "Revised Edition", "Fourth Edition", "Fifth Dawn", "Fifth Edition", "Classic Sixth Edition", "Seventh Edition", "Eighth Edition", "Ninth Edition", "Masters 25", "Aether Revolt", "Amonkhet", "Shards of Alara", "Alliances", "Apocalypse", "Alara Reborn", "Arabian Nights", "Antiquities", "Avacyn Restored", "Battlebond", "Battle for Zendikar", "Born of the Gods", "Betrayers of Kamigawa", "Champions of Kamigawa", "Chronicles", "Conspiracy: Take the Crown", "Conspiracy", "Conflux", "Coldsnap", "Dragon's Maze", "Dissension", "Dark Ascension", "Dominaria", "The Dark", "Darksteel", "Dragons of Tarkir", "Eternal Masters", "Eldritch Moon", "Eventide", "Exodus", "Fallen Empires", "Fate Reforged", "Future Sight", "Guildpact", "Guilds of Ravnica", "Gatecrash", "Homelands", "Hour of Devastation", "Ice Age", "Iconic Masters", "Invasion", "Innistrad", "Journey into Nyx", "Judgment", "Kaladesh", "Khans of Tarkir", "Limited Edition Alpha", "Limited Edition Beta", "Legends", "Legions", "Lorwyn", "Magic 2010", "Magic 2011", "Magic 2012", "Magic 2013", "Magic 2014", "Magic 2015", "Core Set 2019", "Mirrodin Besieged", "Masters Edition", "Masters Edition II", "Masters Edition III", "Masters Edition IV", "Mirage", "Modern Masters 2015", "Modern Masters 2017", "Modern Masters", "Mercadian Masques", "Morningtide", "Mirrodin", "Nemesis", "New Phyrexia", "Odyssey", "Oath of the Gatewatch", "Onslaught", "Magic Origins", "Prophecy", "Planar Chaos", "Planeshift", "Portal", "Portal Three Kingdoms", "Ravnica: City of Guilds", "Rivals of Ixalan", "Ravnica Allegiance", "Rise of the Eldrazi", "Return to Ravnica", "Starter 1999", "Scourge", "Shadowmoor", "Shadows over Innistrad", "Saviors of Kamigawa", "Scars of Mirrodin", "Stronghold", "Theros", "Tempest", "Torment", "Tempest Remastered", "Time Spiral", "Urza's Destiny", "Unglued", "Urza's Legacy",  "Ultimate Masters", "Unhinged", "Urza's Saga", "Unstable", "Visions", "Vintage Masters", "War of the Spark"];

$(document).ready(function() {

  //jquery objects
  var $body = $('body');
  var $cardList = $('#card-list');
  var $advancedTab = $('#advanced-search');
  var $advancedPanel = $('.advanced-search');
  var $generateTab = $('#generate-booster');
  var $generatePanel = $('.generate-booster');
  var $symbols = $('#symbols');
  var $textField = $('input[id="text"]');

  $('#search-sets').autocomplete({
    source: boosterSets
  })

  $("#booster-pack-button").on('click', function() {
    $cardList.empty();
    TolarianLibrary.generateBooster($('#search-sets').val());
  })

  $advancedTab.on('click', function() {
    $generateTab.removeClass('active').addClass('rest');
    if (!$generatePanel.hasClass('hide')) {
      $generatePanel.toggleClass('hide');
    }
    $advancedTab.toggleClass('rest').toggleClass('active');
    $advancedPanel.toggleClass('hide');
  });

  $generateTab.on('click', function() {
    $advancedTab.removeClass('active').addClass('rest');
    if (!$advancedPanel.hasClass('hide')) {
      $advancedPanel.toggleClass('hide');
    }
    $generateTab.toggleClass('rest').toggleClass('active');
    $generatePanel.toggleClass('hide');
  });

  //symbols: when option is clicked, it is added to the Text input
  $symbols.on('change', function() {
    var value = $(this).val();
    $textField.val(function(i, val) {
      return val + value;
    });
  });

  //displays a loading gif during ajax requests
  $(document).on({
    ajaxStart: function() {
      $body.removeClass('relative');
      $cardList.empty();
      $body.addClass('loading');
    },
    ajaxStop: function() {
      $body.removeClass('loading');
    }
  });

  //sets a click handler for the main search icon
  $('#search-button').on('click', function() {
    TolarianLibrary.ajaxRequest(magicAPI + 'cards?name=' + $('#search-input').val());
  });

  //enables the Enter key to perform a main search
  $(document).keypress(function(e) {
    var key = e.which;
    if (!$advancedPanel.hasClass('hide')) {
      return;
    } else if (key === 13) {
      TolarianLibrary.ajaxRequest(magicAPI + 'cards?name=' + $('#search-input').val());
    };
  });

  //sets a click handler for the advanced search button
  $('#advanced-search-button').on('click', function() {
    $advancedTab.toggleClass('rest').toggleClass('active');
    $advancedPanel.toggleClass('hide');
    $cardList.empty();
    TolarianLibrary.advancedSearch();
  });

});

TolarianLibrary.selectedColors = function() {

  var $checkedColor = $('input[type=checkbox]:checked');
  var $colorSpecifics = $('#color-specifics').val();
  var selectedColors = [];
  var colorsParam = '';

  $checkedColor.each(function(index) {
    if ($colorSpecifics === "Exactly") {
      selectedColors.push($(this).attr('id'));
      colorsParam = selectedColors.join(',');
    } else if ($colorSpecifics === "Including") {
      selectedColors.push($(this).attr('id'));
      colorsParam = selectedColors.join('|');
    }
  });

  return colorsParam;
  //returns a string of selected color words
  //exactly: "blue,red,green"
  //including: "blue|red|green"
}

TolarianLibrary.advancedSearch = function() {

  var $name = $('#card-name').val();
  var $cmc = $('#cmc').val();
  var $text = $('#text').val();
  var $types = $('#types').val();
  var $colors = TolarianLibrary.selectedColors(); //returns an array of color words
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
    colors: $colors,
    rarity: $rarity,
    setName: $set,
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

  //console.log(searchEntries);
  var parameters = $.param(searchEntries);
  //console.log(parameters);
  var searchUrl = magicAPI + 'cards?' + parameters;

  TolarianLibrary.ajaxRequest(searchUrl);
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

    var set = cards[index].setName;
    var artist = cards[index].artist;

    if (imageUrl === './resources/images/card-unavailable.png') {
      var cardResult =
      '<div class="card-result">                                               ' +
      '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
      '  <div class="placeholder">                                             ' +
      '    <p>' + name + '</p>                                                 ' +
      '    <p>' + set + '</p>                                              ' +
      '  </div>                                                                ' +
      '</div>                                                                  ';
    } else {
      var cardResult =
      '<div class="card-result">                                               ' +
      '  <img id="card-image" src="' + imageUrl + '" alt="' + name + ' card" />' +
      '</div>                                                                  ';
    }

    /* var cardResult =

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
    '</div>                                                      '; */

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
      TolarianLibrary.renderCards(response.cards);
      //console.log(response.cards);
    }
  });
};

// dynamic set fill for autocomplete
/*TolarianLibrary.getSets = function() {
  var setsAPI = 'https://api.magicthegathering.io/v1/sets';
  $.ajax({
    url: setsAPI,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      var allSets = [];
      for (var setIndex = 0; setIndex < 443; setIndex++) {
        if (response.sets[setIndex].booster) {
          allSets.push(response.sets[setIndex].name);
        }
      }
      console.log(allSets);
      return allSets;
    }
  })
}*/

TolarianLibrary.generateBooster = function(name) {
  $.ajax({
    url: magicAPI + 'sets?name=' + name,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      for (var set = 0; set < response.sets.length; set++) {
        if (response.sets[set].name === name) {
          var setCode = response.sets[set].code;
          TolarianLibrary.ajaxRequest(magicAPI + 'sets/' + setCode + '/booster');
        }
      }
    }
  })
}


//random card - under construction
/* TolarianLibrary.getRandomCard = function() {
  var randomMultiverseId = Math.floor(Math.random() * 466754);
  $.ajax({
    url: magicAPI + '?multiverseid=' + randomMultiverseId,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      console.log(response);
    }
  })
} */
