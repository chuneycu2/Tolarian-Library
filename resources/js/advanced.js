var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';
var scryfallAPI = 'https://api.scryfall.com/cards/search?q=name%3A';

//set names
const sets = [];
const setCodes = {};

$(document).ready(function() {

  //DOM objects
  var $supertype = $('#supertype');
  var $type = $('#type');
  var $subtype = $('#subtype');
  var $set = $('#set');
  var $w = $('#W');
  var $u = $('#U');
  var $b = $('#B');
  var $r = $('#R');
  var $g = $('#G');
  var $c = $('#C');
  var $white = $('#white');
  var $blue = $('#blue');
  var $black = $('#black');
  var $red = $('#red');
  var $green = $('#green');
  var $colorless = $('#colorless');

  //type lists
  const supertypes = [
    "Basic", "Elite", "Legendary", "Ongoing", "Snow", "Token", "World"
  ];
  const types = [
    "Artifact", "Conspiracy", "Creature", "Emblem", "Enchantment", "Hero", "Instant", "Land", "Phenomenon", "Plane", "Planeswalker", "Scheme", "Sorcery", "Tribal", "Vanguard"
  ];
  const artifactTypes = [
    "Clue", "Contraption", "Equipment", "Fortification", "Treasure", "Vehicle"
  ];
  const enchantmentTypes = [
    "Aura", "Cartouche", "Curse", "Saga", "Shrine"
  ];
  const landTypes = [
    "Desert", "Forest", "Gate", "Island", "Lair", "Locus", "Mine", "Mountain", "Plains", "Power Plant", "Swamp", "Tower", "Urza's"
  ];
  const spellTypes = [
    "Arcane", "Trap"
  ];
  const planeswalkerTypes = [
    "Ajani", "Aminatou", "Angrath", "Arlinn", "Ashiok", "Bolas", "Chandra", "Dack", "Daretti", "Davriel", "Domri", "Dovin", "Dungeon", "Elspeth", "Estrid", "Freyalise", "Garruk", "Gideon", "Huatli", "Inzerva", "Jace", "Jaya", "Karn", "Kasmina", "Kaya", "Kiora", "Koth", "Liliana", "Master", "Nahiri", "Narset", "Nissa", "Nixilis", "Ral", "Rowan", "Saheeli", "Samut", "Sarkhan", "Serra", "Sorin", "Tamiyo", "Teferi", "Teyo", "Tezzeret", "Tibalt", "Ugin", "Urza", "Venser", "Vivien", "Vraska", "Will", "Windgrace", "Wrenn", "Xenagos", "Yanggu", "Yanling"
  ];
  const creatureTypes = [
    "Advisor", "Aetherborn", "Ally", "Angel", "Antelope", "Ape", "Archer", "Archon", "Army", "Artificer", "Assassin", "Assembly-Worker", "Atog", "Aurochs", "Autobot", "Avatar", "Azra", "Baddest,", "Badger", "Barbarian", "Basilisk", "Bat", "Bear", "Beast", "Beaver", "Beeble", "Berserker", "Biggest,", "Bird", "Blinkmoth", "Boar", "Brainiac", "Bringer", "Brushwagg", "Bureaucrat", "Camarid", "Camel", "Caribou", "Carrier", "Cat", "Centaur", "Cephalid", "Chicken", "Child", "Chimera", "Citizen", "Clamfolk", "Cleric", "Cockatrice", "Construct", "Cow", "Coward", "Crab", "Crocodile", "Cyborg", "Cyclops", "Dauthi", "Deer", "Demon", "Deserter", "Designer", "Devil", "Dinosaur", "Djinn", "Donkey", "Dragon", "Drake", "Dreadnought", "Drone", "Druid", "Dryad", "Dwarf", "Efreet", "Egg", "Elder", "Eldrazi", "Elemental", "Elemental?", "Elephant", "Elf", "Elk", "Elves", "Etiquette", "Eye", "Faerie", "Ferret", "Fish", "Flagbearer", "Fox", "Frog", "Fungus", "Gamer", "Gargoyle", "Germ", "Giant", "Gnome", "Goat", "Goblin", "God", "Golem", "Gorgon", "Graveborn", "Gremlin", "Griffin", "Gus", "Hag", "Harpy", "Hatificer", "Head", "Hellion", "Hero", "Hippo", "Hippogriff", "Homarid", "Homunculus", "Hornet", "Horror", "Horse", "Hound", "Human", "Hydra", "Hyena", "Illusion", "Imp", "Incarnation", "Insect", "Jackal", "Jellyfish", "Juggernaut", "Kangaroo", "Kavu", "Killbot", "Kirin", "Kithkin", "Knight", "Kobold", "Kor", "Kraken", "Lady", "Lamia", "Lammasu", "Leech", "Leviathan", "Lhurgoyf", "Licid", "Lizard", "Lobster", "Manticore", "Masticore", "Mercenary", "Merfolk", "Metathran", "Mime", "Minion", "Minotaur", "Mole", "Monger", "Mongoose", "Monk", "Monkey", "Moonfolk", "Mummy", "Mutant", "Myr", "Mystic", "Naga", "Nastiest,", "Nautilus", "Nephilim", "Nightmare", "Nightstalker", "Ninja", "Noggle", "Nomad", "Nymph", "Octopus", "Ogre", "Ooze", "Orb", "Orc", "Orgg", "Ouphe", "Ox", "Oyster", "Pangolin", "Paratrooper", "Pegasus", "Pentavite", "Pest", "Phelddagrif", "Phoenix", "Pilot", "Pincher", "Pirate", "Plant", "Praetor", "Prism", "Processor", "Proper", "Rabbit", "Raccoon", "Rat", "Rebel", "Reflection", "Reveler", "Rhino", "Rigger", "Rogue", "Rukh", "Sable", "Salamander", "Samurai", "Sand", "Saproling", "Satyr", "Scarecrow", "Scientist", "Scion", "Scorpion", "Scout", "Serf", "Serpent", "Servo", "Shade", "Shaman", "Shapeshifter", "Sheep", "Ship", "Siren", "Skeleton", "Slith", "Sliver", "Slug", "Snake", "Soldier", "Soltari", "Spawn", "Specter", "Spellshaper", "Sphinx", "Spider", "Spike", "Spirit", "Splinter", "Sponge", "Spy", "Squid", "Squirrel", "Starfish", "Surrakar", "Survivor", "Tetravite", "Thalakos", "The", "Thopter", "Thrull", "Townsfolk", "Treefolk", "Trilobite", "Troll", "Turtle", "Unicorn", "Vampire", "Vampyre", "Vedalken", "Viashino", "Villain", "Volver", "Waiter", "Wall", "Warrior", "Wasp", "Weird", "Werewolf", "Whale", "Wizard", "Wolf", "Wolverine", "Wombat", "Worm", "Wraith", "Wrestler", "Wurm", "Yeti", "Zombie", "Zubera"
  ];
  const planarTypes = [
    "Alara", "Arkhos", "Azgol", "Belenon", "Bolas's Meditation Realm", "Dominaria", "Equilor", "Ergamon", "Fabacin", "Innistrad", "Iquatana", "Ir", "Kaldheim", "Kamigawa", "Karsus", "Kephalai", "Kinshala", "Kolbahan", "Kyneth", "Lorwyn", "Luvion", "Mercadia", "Mirrodin", "Moag", "Mongseng", "Muraganda", "New Phyrexia", "Phyrexia", "Pyrulea", "Rabiah", "Segovia", "Serra's Realm", "Shadowmoor", "Shandalar", "Ulgrotha", "Valla", "Vryn", "Wildfire", "Xerex", "Zendikar"
  ];

  //sets a click event on the magnifying glass icon
  $('#advanced-search-button').on('click', function() {
    //TolarianLibrary.advancedSearch();
    window.location = 'search.html?' + TolarianLibrary.advancedSearch();
  });

  //symbols: when option is clicked, it is added to the text input field
  var $symbols = $('#symbols');
  var $textField = $('input[id="text"]');
  $symbols.on('change', function() {
    var value = $(this).val();
    $textField.val(function(i, val) {
      return val + value;
    });
    $('#symbols option:eq(0)').prop('selected', true);
  });

  //autocomplete for type inputs

  $supertype.autocomplete({
    source: supertypes,
    minLength: 0
  }).focus(function() {
    $(this).autocomplete('search', $(this).val())
  });

  $type.autocomplete({
    source: types,
    minLength: 0
  }).focus(function() {
    $(this).autocomplete('search', $(this).val())
  });

  $subtype.focusin(function() {
    if ($type.val() == 'Creature') {
      $( function() {

        function split( val ) {
          return val.split( /,\s*/ );
        }
        function extractLast( term ) {
          return split( term ).pop();
        }

        $subtype
          // don't navigate away from the field on tab when selecting an item
          .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
                $( this ).autocomplete( "instance" ).menu.active ) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
              // delegate back to autocomplete, but extract the last term
              response( $.ui.autocomplete.filter(
                creatureTypes, extractLast( request.term ) ) );
            },
            focus: function() {
              // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              var terms = split( this.value );
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the comma-and-space at the end
              terms.push( "" );
              this.value = terms.join( ", " );
              return false;
            }
          }).focus(function() {
            $(this).autocomplete('search', $(this).val())
          });
      });
    } else if ($type.val() == 'Artifact') {
      $subtype.autocomplete({
        source: artifactTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    } else if ($type.val() == 'Planeswalker') {
      $subtype.autocomplete({
        source: planeswalkerTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    } else if ($type.val() == 'Enchantment') {
      $subtype.autocomplete({
        source: enchantmentTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    } else if ($type.val() == 'Instant' || $type.val() == 'Sorcery') {
      $subtype.autocomplete({
        source: spellTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    } else if ($type.val() == 'Land') {
      $subtype.autocomplete({
        source: landTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    }
  });

  $set.autocomplete({
    source: sets,
    minLength: 0
  }).focus(function() {
    $(this).autocomplete('search', $(this).val())
  });

  //when colorless is checked, other colors are unchecked
  $colorless.on('click', function() {
    $white.prop('checked', false);
    $blue.prop('checked', false);
    $black.prop('checked', false);
    $red.prop('checked', false);
    $green.prop('checked', false);
  });

  $c.on('click', function() {
    $w.prop('checked', false);
    $u.prop('checked', false);
    $b.prop('checked', false);
    $r.prop('checked', false);
    $g.prop('checked', false);
  });

  //when any color is checked, colorless is unchecked
  $('.colors .check-button input').on('click', function() {
    if (this.id !== 'colorless') {
      $colorless.prop('checked', false);
    }
  });

  $('.color-id .check-button input').on('click', function() {
    if (this.id !== 'C') {
      $c.prop('checked', false);
    }
  });

  //when one rarity is checked, the others are unchecked
  $('.rarity-buttons .check-button input').on('change', function() {
    $('.rarity-buttons .check-button input').not(this).prop('checked', false);
  });

});

TolarianLibrary.getSets = function() {
  var magicAPISets = 'https://api.magicthegathering.io/v1/sets';

  $.ajax({
    url: magicAPISets,
    type: 'GET',
    dataType: 'JSON',
    success: function(response) {
      for (i = 0; i < response.sets.length; i++) {
        sets.push(response.sets[i].name);
        setCodes[`${response.sets[i].name}`] = response.sets[i].code;
      }
    }
  });
}

//functions that parse the advanced field values

TolarianLibrary.advancedSearch = function() {

  function buildParameters() {
    var parameters = [];

    if ($name.length > 5) {
      parameters.push($name);
    }
    if ($cmc.length > 4) {
      parameters.push($cmc);
    }
    if ($text.length > 7) {
      parameters.push($text);
    }
    if ($supertype.length > 2) {
      parameters.push($supertype);
    }
    if ($type.length > 2) {
      parameters.push($type);
    }
    if ($subtype.length > 2) {
      parameters.push($subtype);
    }
    if ($colors.length > 2) {
      parameters.push($colors);
    }
    if ($colorID.length > 3) {
      parameters.push($colorID);
    }
    if ($set.length > 4) {
      parameters.push($set);
    }
    if ($rarity.length > 7) {
      parameters.push($rarity);
    }
    if ($power.length > 6) {
      parameters.push($power);
    }
    if ($toughness.length > 10) {
      parameters.push($toughness);
    }
    if ($loyalty.length > 8) {
      parameters.push($loyalty);
    }
    if ($artist.length > 7) {
      parameters.push($artist);
    }


    parameters = parameters.join('+');
    return parameters;
  }

  function getOracleText() {
    var textField = $('#text').val();
    if (textField) {
      var textEntry = "\"" + $('#text').val() + "\"";
      return textEntry;
    } else if (!textField) {
      return '';
    }
  }

  function setColorRange() {
    var $colorRange = $('#color-specifics').val();

    if ($colorRange === 'Exactly') {
      return ':';
    }
    if ($colorRange === 'At least') {
      return '>=';
    }
    if ($colorRange === 'At most') {
      return '<=';
    }
  }

  function selectedColors() {
    var $checkedColor = $('.colors .check-button input[type=checkbox]:checked');
    var colorsParam = '';

    $checkedColor.each(function(index) {
      if ($(this).attr('id') === 'white') {
        colorsParam += 'W';
      }
      if ($(this).attr('id') === 'blue') {
        colorsParam += 'U';
      }
      if ($(this).attr('id') === 'black') {
        colorsParam += 'B';
      }
      if ($(this).attr('id') === 'red') {
        colorsParam += 'R';
      }
      if ($(this).attr('id') === 'green') {
        colorsParam += 'G';
      }
      if ($(this).attr('id') === 'colorless') {
        colorsParam += 'C';
      }
    });
    //console.log(colorsParam);
    return colorsParam; //string of single letters i.e. "rgb"
  }

  function selectedColorID() {
    var $checkedColorId = $('.color-id .check-button input[type=checkbox]:checked');
    var selectedColors = [];
    var colorIdParam = '';

    $checkedColorId.each(function(index) {
      selectedColors.push($(this).attr('id'));
      colorIdParam = selectedColors.join('');
    });
    //console.log(colorIdParam);
    return colorIdParam;
  }

  function selectedRarity() {
    var $checkedRarity = $('.rarity-buttons .check-button input[type=checkbox]:checked');
    var selectedRarity = [];

    $checkedRarity.each(function(index) {
      selectedRarity.push($(this).attr('id'));
    });

    if (selectedRarity.length === 1) {
      //console.log(selectedRarity[0]);
      return selectedRarity[0];
    } else {
      return selectedRarity;
    }
  }

  function getSetCode() {
    for (key in setCodes) {
      if (key === $('#set').val()) {
        //console.log(setCodes[key]);
        return setCodes[key];
      } else {
        return '';
      }
    }
  }

  var $name = 'name:' + $('#card-name').val();
  var $cmc = 'cmc:' + $('#cmc').val();
  var $text = 'oracle:' + getOracleText();
  var $supertype = 't:' + $('#supertype').val();
  var $type = 't:' + $('#type').val();
  var $subtype = 't:' + $('#subtype').val();
  var $colors = 'c' + setColorRange() + selectedColors();
  var $colorID = 'id:' + selectedColorID();
  var $set = 'set:' + getSetCode();
  var $rarity = 'rarity:' + selectedRarity();
  var $power = 'power:' + $('#power').val();
  var $toughness = 'toughness:' + $('#toughness').val();
  var $loyalty = 'loyalty:' + $('#loyalty').val();
  var $artist = 'artist:' + $('#artist-name').val();

  /*const searchEntries = {
    name: $name,
    cmc: $cmc,
    oracle: $text,
    t: [
      $supertype,
      $type,
      $subtype
    ],
    c: $colors,
    identity: $colorID,
    set: $set,
    rarity: $rarity,
    power: $power,
    toughness: $toughness,
    loyalty: $loyalty,
    artist: $artist,
  };*/

  /*for (let [key, value] of Object.entries(searchEntries)) {
    if (searchEntries[key] == '') {
      delete searchEntries[key];
    }
    if (searchEntries[key] === $name) {
      parameters = parameters + 'name:' + searchEntries.name;
      console.log(parameters);
    }
    if (searchEntries[key] === $cmc) {
      parameters = parameters + '+cmc:' + searchEntries.cmc;
      console.log(parameters);
    }
    if (searchEntries[key] === $text) {
      searchEntries.oracle.replace(/,/g, '');
      parameters = parameters + '+oracle:' + searchEntries.oracle;
      console.log(parameters);
    }
    if (searchEntries[key] == [$supertype, $type, $subtype]) {
      console.log("type if statement working")
      for (var i = 0; i < searchEntries[t].length; i++) {
        parameters = parameters + '+t:' + searchEntries[t][i];
        console.log(parameters);
      }
      //console.log(parameters);
    }
    if (searchEntries[key] === $colors) {
      parameters = parameters + '+c:' + searchEntries.c;
      console.log(parameters);
    }
  }*/

  //var scryfallAPI = 'https://api.scryfall.com/cards/search?q=';
  var searchUrl = buildParameters();

  console.log(searchUrl);
  return searchUrl;
}
