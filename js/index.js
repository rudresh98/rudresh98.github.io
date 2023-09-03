// wish notification
let date = new Date();
if (date.getHours() >= 0 && date.getHours() <= 5) {
  alertify.set("notifier", "position", "top-right");
  let alertMsg = alertify.notify("Good Evening Folk.😄", "custom");
  alertMsg.delay(3);
} else if (date.getHours() > 6 && date.getHours() < 11) {
  alertify.set("notifier", "position", "bottom-right");
  let alertMsg = alertify.notify("Good Morning Folk.😄", "custom");
  alertMsg.delay(3);
} else if (date.getHours() > 17 && date.getHours() <= 24) {
  alertify.set("notifier", "position", "top-right");
  let alertMsg = alertify.notify("Good Evening Folk.😄", "custom");
  alertMsg.delay(3);
} else {
  alertify.set("notifier", "position", "top-right");
  let alertMsg = alertify.notify("Good Afternoon Folk.😄", "custom");
  alertMsg.delay(3);
}
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

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
  // .ajs-message.ajs-custom { color: #31708f;  background-color: #d9edf7;  border-color: #31708f; }
  alertify.set("notifier", "position", "bottom-right");
  let alertMsg = alertify.notify("Dark Mode🌑", "custom");
  alertMsg.delay(3);
};
disableDarkMode = () => {
  document.body.classList.remove("dark-theme");
  localStorage.removeItem("darkMode", null);
  icon.classList = "fas fa-moon";
  icon1.classList = icon.classList;
  alertify.set("notifier", "position", "bottom-right");
  let alertMsg = alertify.notify("Light Mode ☀️", "custom");
  alertMsg.delay(3);
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
    console.debug("dark mode ENABLED😍");
  } else {
    disableDarkMode();
    console.debug("dark mode DISABLED 😢");
  }
};

var load = document.getElementById("loading");
// loadfun = async () => {
//   load.style.display = "none";
// };
let spinnerEle = document.getElementById("spinner");
spinnerEle.classList.remove("spinner-border");
const sendContactForm = () => {
  const formData = {
    form_subject: "Thanks From Rudresh Oza",
    form_name: document.getElementById("form-name").value,
    form_id: document.getElementById("form-id").value,
    to_name: "Rudresh Oza",
    message: document.getElementById("message").value,
  };
  console.debug(formData);
  spinnerEle.classList.add("spinner-border");
  if (
    formData.form_id == "" ||
    formData.form_name === "" ||
    formData.message === ""
  ) {
    spinnerEle.classList.remove("spinner-border");
    alertify.set("notifier", "position", "top-right");
    let alertMsg = alertify.notify("Please fill all the entries.😢", "custom");
    alertMsg.delay(3);
  } else {
    emailjs
      .send("service_56x2ned", "template_ibljxpb", formData)
      .then((res) => {
        alertify.set("notifier", "position", "top-right");
        spinnerEle.classList.remove("spinner-border");
        let alertMsg = alertify.notify("Success❤️", "custom");
        alertMsg.delay(3);
      })
      .catch((err) => {
        spinnerEle.classList.remove("spinner-border");
        console.error("ERROR", err);
        alertify.set("notifier", "position", "top-right");
        let alertMsg = alertify.notify(
          "Oops..!! Something went wrong.😢",
          "custom"
        );
        alertMsg.delay(3);
      });
    document.getElementById("form-name").value = "";
    document.getElementById("form-id").value = "";
    document.getElementById("message").value = "";
  }
};

// tagacanvas

window.onload = function () {
  try {
    TagCanvas.Start("myCanvas", "tags", {
      textColour: "rgb(200, 130, 63)",
      outlineThickness: 0.5,
      outlineColour: "#FE0853",
      maxSpeed: 0.06,
      freezeActive: true,
      shuffleTags: true,
      shape: "sphere",
      zoom: 1.2,
      noSelect: true,
      textFont: null,
      pinchZoom: true,
      freezeDecel: true,
      fadeIn: 3000,
      initial: [0.3, -0.1],
      depth: 1.4,
    });
  } catch (e) {
    // something went wrong, hide the canvas container
    document.getElementById("myCanvasContainer").style.display = "none";
  }
};
let linkdln = document.getElementById("linkdln");
goToLink = (link) => {
  window.open(link, "_blank");
};
document.addEventListener("scroll", (e) => {
  // console.log(window.screenY);
});
// scroll event
const copyrightYear = document.getElementById("copyright-year");
copyrightYear.innerHTML = `${
  new Date().getFullYear() - 1
} - ${new Date().getFullYear()}`;
