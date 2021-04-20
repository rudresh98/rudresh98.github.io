window.addEventListener("scroll", function () {
  var header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

function togglemenu() {
  var menu = document.querySelector(".toggle");
  menu.classList.toggle("active");
  var menushow = document.querySelector(".menu");
  menushow.classList.toggle("active");
}
var preloader = document.querySelector(".loader");

function myloader() {
  preloader.style.display = "none";
}
//
