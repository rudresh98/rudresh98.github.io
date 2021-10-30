// wish notification

let date = new Date();

if (date.getHours() > 0 && date.getHours() < 7) {
  alertify.set("notifier", "position", "top-right");
  let alertMsg = alertify.notify("Good Evening Folk.😄", "custom");
  alertMsg.delay(3);
} else if (date.getHours() > 5 && date.getHours() < 12) {
  alertify.set("notifier", "position", "top-right");
  let alertMsg = alertify.notify("Good Morning Folk.😄", "custom");
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
  let alertMsg = alertify.notify("Dark Mode Enabled🌑", "custom");
  alertMsg.delay(3);
};
disableDarkMode = () => {
  document.body.classList.remove("dark-theme");
  localStorage.removeItem("darkMode", null);
  icon.classList = "fas fa-moon";
  icon1.classList = icon.classList;
  alertify.set("notifier", "position", "bottom-right");
  let alertMsg = alertify.notify("Light Mode Enabled☀️", "custom");
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
const sendContactForm = () => {
  const formData = {
    form_subject: "Thank You From Rudresh",
    form_name: document.getElementById("form-name").value,
    form_id: document.getElementById("form-id").value,
    to_name: "Rudresh Oza",
    message: document.getElementById("message").value,
  };
  console.debug(formData);
  emailjs
    .send("service_qs0t96g", "template_ibljxpb", formData)
    .then((res) => {
      console.debug("SUCCESS", res);
      alert("data added successfully");
    })
    .catch((err) => {
      console.debug("ERROR", err);
      alert("Something went wrong");
    });
  document.getElementById("form-name").value = "";
  document.getElementById("form-id").value = "";
  document.getElementById("message").value = "";
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
