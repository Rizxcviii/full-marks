$(window).on("hashchange", function () {
  if (location.hash.slice(1) == "login") {
    $(".card").addClass("extend");

    $("#register").removeClass("selected");
    $("#login").addClass("selected");
  } else {
    $(".card").removeClass("extend");
    $("register").addClass("selected");
    $("#login").removeClass("selected");
  }
});
$(window).trigger("hashchange");
