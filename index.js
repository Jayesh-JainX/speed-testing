const express = require("express");
const app = express();
const { MLabSpeedTest } = require("mlab-speed-test");
const speedTest = new MLabSpeedTest();

let downloadSpeed = "0";

// Endpoint to initiate speed test and return download speed
app.get("/speed-test", (req, res) => {
  // Run the speed test
  speedTest
    .run()
    .then(() => {
      // Once the speed test is completed, send the download speed as the response
      const currentDownloadSpeed =
        downloadSpeed !== "0" ? downloadSpeed : "Speed test in progress";
      res.json({ downloadSpeed: currentDownloadSpeed });
    })
    .catch((error) => {
      console.error("Error running speed test:", error);
      res.status(500).json({ error: "Speed test failed" });
    });
});

// Event listener for download complete to update download speed
speedTest.on("download-complete", (downloadData) => {
  downloadSpeed = downloadData.LastClientMeasurement
    ? downloadData.LastClientMeasurement.MeanClientMbps.toFixed(2)
    : "0";
  console.log("Download Speed: " + downloadSpeed + "Mb/s");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
