$(document).ready(function() {

  //sets a click event on the magnifying glass icon
  $('#search-button').on('click', function() {
    var searchValue = $('#search-input').val();
    window.location = 'search.html?name=' + searchValue;
  });

  //enables the Enter key to perform a main search
  $(document).keypress(function(e) {
    var searchValue = $('#search-input').val();
    var key = e.which;
    if (key === 13) {
      window.location = 'search.html?name=' + searchValue;
    };
  });

});
