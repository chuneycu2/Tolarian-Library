var TolarianLibrary = {};

$(document).ready(function() {
  $('#search-button').on('click', function() {
    TolarianLibrary.testAjax($('#search-input').val());
  })
})

TolarianLibrary.testAjax = function(name) {
  $.ajax({
    url: 'https://api.magicthegathering.io/v1/cards?name="' + name + '"',
    success: function(response) {
      console.log(response);
    }
  });
}
