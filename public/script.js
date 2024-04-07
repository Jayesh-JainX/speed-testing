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

function calculateSpeed() {
  loadingIndicator.style.display = "flex";
  downloadSpeedDisplay.style.display = "none";
  const ws = new WebSocket("wss://speed-test-ic.vercel.app");

  ws.onopen = function () {
    console.log("Connected to WebSocket server");
    ws.send("start-speed-test");
  };

  ws.onmessage = function (event) {
    console.log("Received message from server:", event.data);

    try {
      const messageData = JSON.parse(event.data);

      if (messageData.type === "downloadSpeedUpdate") {
        downloadSpeedDisplay.innerHTML = `Download Speed: <br /><span class="speed_number">${messageData.speed}</span><span class="bps">Mbps</span>`;
        loadingIndicator.style.display = "none";
        downloadSpeedDisplay.style.display = "block";
      } else if (messageData.type === "uploadSpeedUpdate") {
        // Handle upload speed update
        // For example, update the upload speed display similarly to the download speed display
      } else {
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
}

window.addEventListener("load", (event) => {
  calculateSpeed();
});

let speedTestTimeout;

checkSpeedButton.addEventListener("click", () => {
  calculateSpeed();
});

// Prevent multiple speed test requests
checkSpeedButton.addEventListener("click", () => {
  clearTimeout(speedTestTimeout);
});
