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
    console.debug("dark mode ENABLED😍");
  } else {
    disableDarkMode();
    console.debug("dark mode DISABLED 😢");
  }
};

var load = document.getElementById("loading");
loadfun = async () => {
  load.style.display = "none";
};
const sendContactForm = () => {
  const formData = {
    form_subject: "Contact from Client (portfolio)",
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
      alert("Your Data is Submitted successfully");
    })
    .catch((err) => {
      console.debug("ERROR", err);
      alert("Your data is not SUbmitted successfully");
    });
  document.getElementById("form-name").value = "";
  document.getElementById("form-id").value = "";
  document.getElementById("message").value = "";
};
