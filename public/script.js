const toggle = document.querySelector(".toggle-input");
const body = document.body;
const image = document.querySelector(".head_img");
const refreshIcon = document.querySelector(".check_speed_button i");
const loadingIndicator = document.querySelector(".loading_indicator");
const speedNumber = document.querySelector(".speed_number");
const speedUnit = document.querySelector(".bps");
const checkSpeedButton = document.querySelector(".check_speed_button");

function setInitialMode() {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  toggle.checked = prefersDarkMode;
  if (prefersDarkMode) {
    body.classList.add("dark-mode");
    image.src = "images/speed-dark.png";
    refreshIcon.style.color = "";
  } else {
    body.classList.remove("dark-mode");
    image.src = "images/speed.png";
    refreshIcon.style.color = "#070707";
  }
}

setInitialMode();

toggle.addEventListener("change", function () {
  if (toggle.checked) {
    body.classList.add("dark-mode");
    image.src = "images/speed-dark.png";
    refreshIcon.style.color = "";
  } else {
    body.classList.remove("dark-mode");
    image.src = "images/speed.png";
    refreshIcon.style.color = "#070707";
  }
});

function updateSpeed(speed) {
  const roundedSpeed = parseFloat(speed).toFixed(2);
  speedNumber.textContent = roundedSpeed;
  speedUnit.style.display = "inline";
  loadingIndicator.style.display = "none";
  speedNumber.style.display = "inline";
  checkSpeedButton.style.display = "inline";
}

function showLoading() {
  speedNumber.textContent = "";
  speedUnit.style.display = "none";
  loadingIndicator.style.display = "block";
}

speedNumber.style.display = "none";
speedUnit.style.display = "none";
checkSpeedButton.style.display = "none";
showLoading();

window.addEventListener("load", () => {
  showLoading();
  checkSpeedButton.style.display = "none";
  fetchSpeed();
});

function fetchSpeed() {
  fetch("/speed")
    .then((response) => response.json())
    .then((data) => {
      updateSpeed(data.speed);
      setTimeout(() => {
        checkSpeedButton.style.display = "inline";
      }, 5000);
    })
    .catch((error) => {
      console.error("Error fetching speed:", error);
    });
}

checkSpeedButton.addEventListener("click", () => {
  showLoading();
  checkSpeedButton.style.display = "none";
  fetchSpeed();
});
