var TolarianLibrary = {};

const API_KEY= '';

TolarianLibrary.testAjax = function() {
  $.ajax({
    url: '' + API_KEY + '',
    success: function(response) {
      console.log(response);
    }
  });
}
