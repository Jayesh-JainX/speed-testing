const toggle = document.querySelector(".toggle-input");
const body = document.body;
const image = document.querySelector(".head_img");
const refreshIcon = document.querySelector(".check_speed_button i");
const loadingIndicator = document.querySelector(".loading_indicator");
const speedNumber = document.querySelector(".speed_number");
const speedUnit = document.querySelector(".bps");
const checkSpeedButton = document.querySelector(".check_speed_button");
const downloadSpeedDisplay = document.getElementById("downloadSpeed");

let highestSpeed = 0;
let successfulTests = 0;

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

var imageAddrs = [
  "https://notify-io.vercel.app/Cirrus_uncinus_clouds_in_the_morning_sky.jpg",
];
var downloadSizes = [500000];
var testIndex = 0;
var maxTestDuration = 10000;

function ShowProgressMessage(msg) {
  var oProgress = document.getElementById("progress");
  if (oProgress) {
    var actualHTML = typeof msg == "string" ? msg : msg.join("<br />");
    oProgress.innerHTML = actualHTML;
  }
}

function InitiateSpeedDetection() {
  loadingIndicator.style.display = "block";
  downloadSpeedDisplay.style.display = "none";
  checkSpeedButton.style.display = "none";

  MeasureConnectionSpeed();
}

if (window.addEventListener) {
  window.addEventListener("load", InitiateSpeedDetection, false);
} else if (window.attachEvent) {
  window.attachEvent("onload", InitiateSpeedDetection);
}

var maxTestDuration = 10000;

function MeasureConnectionSpeed() {
  var startTime = new Date().getTime();
  var endTime = startTime + maxTestDuration;
  var highestSpeedInInterval = 0;

  function measureSpeedRepeatedly() {
    var imageAddr = imageAddrs[0];
    var downloadSize = downloadSizes[0];

    var download = new Image();
    download.onload = function () {
      var duration = (new Date().getTime() - startTime) / 1000;
      var bitsLoaded = downloadSize * 8;
      var speedBps = bitsLoaded / duration;
      var speedMbps = (speedBps / 1024 / 1024).toFixed(2);
      highestSpeedInInterval = Math.max(highestSpeedInInterval, speedMbps);

      if (new Date().getTime() < endTime) {
        measureSpeedRepeatedly();
      } else {
        downloadSpeedDisplay.innerHTML = `Download Speed: <br /><span class="speed_number">${highestSpeedInInterval.toFixed(
          2
        )}</span> <span class="bps">Mbps</span>`;
        downloadSpeedDisplay.style.display = "block";
        checkSpeedButton.style.display = "block";
        loadingIndicator.style.display = "none";
      }
    };

    download.onerror = function () {};

    var cacheBuster = "?nnn=" + new Date().getTime();
    download.src = imageAddr + cacheBuster;
  }

  measureSpeedRepeatedly();
}

checkSpeedButton.addEventListener("click", function () {
  testIndex = 0;
  highestSpeed = 0;
  successfulTests = 0;
  loadingIndicator.style.display = "inline-block";
  downloadSpeedDisplay.style.display = "none";
  checkSpeedButton.style.display = "none";
  InitiateSpeedDetection();
});
