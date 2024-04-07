const toggle = document.querySelector(".toggle-input");
const body = document.body;
const image = document.querySelector(".head_img");
const refreshIcon = document.querySelector(".check_speed_button i");
const loadingIndicator = document.querySelector(".loading_indicator");
const speedNumber = document.querySelector(".speed_number");
const speedUnit = document.querySelector(".bps");
const checkSpeedButton = document.querySelector(".check_speed_button");
const downloadSpeedDisplay = document.getElementById("downloadSpeed");

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

var imageAddrs = ["images/1.5mb.jpg", "images/7mb.jpg", "images/15mb.jpg"];
var downloadSizes = [1551892, 7329546, 15833497]; //bytes
var testIndex = 0;
var maxTestDuration = 15000; // 15 seconds

function ShowProgressMessage(msg) {
  var oProgress = document.getElementById("progress");
  if (oProgress) {
    var actualHTML = typeof msg == "string" ? msg : msg.join("<br />");
    oProgress.innerHTML = actualHTML;
  }
}

function InitiateSpeedDetection() {
  // Show loading indicator
  loadingIndicator.style.display = "block";
  // Hide download speed display and button
  downloadSpeedDisplay.style.display = "none";
  checkSpeedButton.style.display = "none";

  // Start speed test after 10 seconds
  setTimeout(MeasureConnectionSpeed, 5000);
}

if (window.addEventListener) {
  window.addEventListener("load", InitiateSpeedDetection, false);
} else if (window.attachEvent) {
  window.attachEvent("onload", InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
  if (testIndex >= imageAddrs.length) {
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
    ShowProgressMessage("Invalid image, or error downloading");
  };

  startTime = new Date().getTime();
  var cacheBuster = "?nnn=" + startTime;
  download.src = imageAddr + cacheBuster;

  function showResults() {
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = downloadSize * 8;
    var speedBps = bitsLoaded / duration;
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    ShowProgressMessage([
      "Your connection speed for the last test is:",
      speedBps.toFixed(2) + " bps",
      speedKbps + " kbps",
      speedMbps + " Mbps",
    ]);
    testIndex++;
    // Update download speed display
    downloadSpeedDisplay.innerHTML = `Download Speed: <br /><span class="speed_number">${speedMbps}</span> <span class="bps">Mbps</span>`;
    // Show download speed display and button
    downloadSpeedDisplay.style.display = "block";
    checkSpeedButton.style.display = "block";
    // Hide loading indicator
    loadingIndicator.style.display = "none";
  }
}

// Add event listener to check speed button
checkSpeedButton.addEventListener("click", function () {
  // Reset testIndex to re-run speed tests
  testIndex = 0;
  // Show loading indicator
  loadingIndicator.style.display = "inline-block";
  // Hide download speed display and button
  downloadSpeedDisplay.style.display = "none";
  checkSpeedButton.style.display = "none";
  // Initiate speed detection
  InitiateSpeedDetection();
});
