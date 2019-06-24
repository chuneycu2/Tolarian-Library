var TolarianLibrary = {};

var magicAPI = 'https://api.magicthegathering.io/v1/';
var scryfallAPI = 'https://api.scryfall.com/cards/search?q=name%3A';

//set names
const sets = [];

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
    "Artifact", "Artifact Creature", "Conspiracy", "Creature", "Emblem", "Enchantment", "Enchantment Creature", "Hero", "Instant", "Land", "Land Creature", "Phenomenon", "Plane", "Planeswalker", "Scheme", "Sorcery", "Tribal", "Vanguard"
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
    TolarianLibrary.advancedSearch();
    //window.location = 'search.html?name=' + TolarianLibrary.advancedSearch();
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
      $subtype.autocomplete({
        source: creatureTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
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
    } else if ($type.val() == 'Artifact Creature') {
      $subtype.autocomplete({
        source: creatureTypes,
        minLength: 0
      }).focus(function() {
        $(this).autocomplete('search', $(this).val())
      });
    } else if ($type.val() == 'Enchantment Creature') {
      $subtype.autocomplete({
        source: creatureTypes,
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
      }
    }
  });
}

//functions that parse the advanced field values

TolarianLibrary.advancedSearch = function() {

  function selectedColors() {
    var $checkedColor = $('.colors .check-button input[type=checkbox]:checked');
    var selectedColors = [];
    var colorsParam = '';

    $checkedColor.each(function(index) {
      selectedColors.push($(this).attr('id'));
      colorsParam = selectedColors.join(',');
    });

    return colorsParam;
  }

  function selectedColorID() {
    var $checkedColorId = $('.color-id .check-button input[type=checkbox]:checked');
    var selectedColors = [];
    var colorIdParam = '';

    $checkedColorId.each(function(index) {
      selectedColors.push($(this).attr('id'));
      colorIdParam = selectedColors.join(',');
    });

    return colorIdParam;
  }

  function selectedRarity() {
    var $checkedRarity = $('.rarity-buttons .check-button input[type=checkbox]:checked');
    var selectedRarity = [];

    $checkedRarity.each(function(index) {
      selectedRarity.push($(this).attr('id'));
    });

    if (selectedRarity.length === 1) {
      return selectedRarity[0];
    } else {
      return selectedRarity;
    }
  }

  var $name = $('#card-name').val();
  var $cmc = $('#cmc').val();
  var $text = $('#text').val();
  var $supertype = $('#supertype').val();
  var $type = $('#type').val();
  var $subtype = $('#subtype').val();
  var $colors = selectedColors();
  var $colorID = selectedColorID();
  var $set = $('#set').val();
  var $rarity = selectedRarity();
  var $power = $('#power').val();
  var $toughness = $('#toughness').val();
  var $loyalty = $('#loyalty').val();
  var $artist = $('#artist-name').val();

  const searchEntries = {
    name: $name,
    cmc: $cmc,
    text: $text,
    supertypes: $supertype,
    type: $type,
    subtypes: $subtype,
    colors: $colors,
    colorIdentity: $colorID,
    setName: $set,
    rarity: $rarity,
    power: $power,
    toughness: $toughness,
    loyalty: $loyalty,
    artist: $artist,
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

  console.log(parameters);
  //return searchUrl;
}
