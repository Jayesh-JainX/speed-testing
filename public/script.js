const toggle = document.querySelector(".toggle-input");
const body = document.body;
const image = document.querySelector(".head_img");

function setInitialMode() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  toggle.checked = prefersDarkMode;
  if (prefersDarkMode) {
    body.classList.add("dark-mode");
    image.src = "images/speed-dark.png";
  } else {
    body.classList.remove("dark-mode");
    image.src = "images/speed.png";
  }
}

setInitialMode();

toggle.addEventListener("change", function () {
  if (toggle.checked) {
    body.classList.add("dark-mode");
    image.src = "images/speed-dark.png";
  } else {
    body.classList.remove("dark-mode");
    image.src = "images/speed.png";
  }
});
