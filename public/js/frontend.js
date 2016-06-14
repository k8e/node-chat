
$(function () {
  $('[data-toggle="popover"]').popover();

  displayWelcome();

})

$().ready(function(){

});

function displayWelcome() {
  if (!signedIn) {
    $('#control').popover('show');
    window.setTimeout(function(){
        $('#control').popover('hide');
    }, 10000); //600 ms until timeout
  }
}
