function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// particle js

// dark mode added starts here
let darkmode = localStorage.getItem("darkMode");
console.debug("top", darkmode);
var icon = document.getElementById("moon");
var icon1 = document.getElementById("moon1");
enableDarkMode = () => {
  document.body.classList.add("dark-theme");
  localStorage.setItem("darkMode", "enable");
  icon.classList = "fas fa-sun";
  icon1.classList = icon.classList;
};
disableDarkMode = () => {
  document.body.classList.remove("dark-theme");
  localStorage.removeItem("darkMode", null);
  icon.classList = "fas fa-moon";
  icon1.classList = icon.classList;
};
if (darkmode === "enable") {
  enableDarkMode();
} else {
  disableDarkMode();
}
toogleThemeClick = () => {
  darkmode = localStorage.getItem("darkMode");
  if (darkmode !== "enable") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
};

var load = document.getElementById("loading");
loadfun = async () => {
  load.style.display = "none";

};