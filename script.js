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
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg",
];
var downloadSizes = [
  7654604, 7654604, 7654604, 7654604, 7654604, 7654604, 7654604, 7654604,
  7654604, 7654604,
];
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
  if (testIndex >= imageAddrs.length) {
    downloadSpeedDisplay.innerHTML = `Download Speed: <br /><span class="speed_number">${highestSpeed.toFixed(
      2
    )}</span> <span class="bps">Mbps</span>`;
    downloadSpeedDisplay.style.display = "block";
    checkSpeedButton.style.display = "block";

    loadingIndicator.style.display = "none";
    return;
  }

  var imageAddr = imageAddrs[testIndex];
  var downloadSize = downloadSizes[testIndex];
  var startTime, endTime;
  var download = new Image();
  download.onload = function () {
    endTime = new Date().getTime();
    showResults();
  };

  download.onerror = function () {
    if (retry < 3) {
      retry++;
      download.src = imageAddr + cacheBuster;
    } else {
      ShowProgressMessage("Failed to download image.");
      testIndex++;
      MeasureConnectionSpeed();
    }
  };

  startTime = new Date().getTime();
  var cacheBuster = "?nnn=" + startTime;
  download.src = imageAddr + cacheBuster;
  var retry = 0;

  function showResults() {
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = downloadSize * 8;
    var speedBps = bitsLoaded / duration;
    var speedMbps = (speedBps / 1024 / 1024).toFixed(2);
    highestSpeed = Math.max(highestSpeed, speedMbps);
    successfulTests++;
    testIndex++;
    MeasureConnectionSpeed();
  }

  setTimeout(function () {
    downloadSpeedDisplay.innerHTML = `Download Speed: <br /><span class="speed_number">${highestSpeed.toFixed(
      2
    )}</span> <span class="bps">Mbps</span>`;
    downloadSpeedDisplay.style.display = "block";
    checkSpeedButton.style.display = "block";
    loadingIndicator.style.display = "none";
  }, maxTestDuration);
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
