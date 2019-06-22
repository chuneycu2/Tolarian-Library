$(document).ready(function() {

  $('#search-button').on('click', function() {
    var searchValue = $('#search-input').val();
    window.location = 'search.html?name=' + searchValue;
  });

});
