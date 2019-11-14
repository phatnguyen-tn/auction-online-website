$(document).ready(function () {
  $(document).on('click', '.toggle-password', function () {
    $(this).toggleClass("zmdi-eye-off");
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });
});
