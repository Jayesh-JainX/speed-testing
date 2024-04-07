const express = require("express");
const { MLabSpeedTest } = require("mlab-speed-test");

const app = express();
const speedTest = new MLabSpeedTest();

app.get("/speed", (req, res) => {
  let speedData = {};

  speedTest.on("server-chosen", (serverInfo) => {
    speedData.location = serverInfo.location;
  });

  speedTest.on("download-complete", (downloadData) => {
    speedData.downloadSpeed = downloadData.LastClientMeasurement
      ? parseFloat(downloadData.LastClientMeasurement.MeanClientMbps.toFixed(2))
      : 0;
    sendResponse();
  });

  speedTest.on("upload-complete", (uploadData) => {
    speedData.uploadSpeed = uploadData.LastServerMeasurement
      ? (
          (uploadData.LastServerMeasurement.TCPInfo.BytesReceived /
            uploadData.LastServerMeasurement.TCPInfo.ElapsedTime) *
          8
        ).toFixed(2)
      : 0;
    sendResponse();
  });

  speedTest.run();

  function sendResponse() {
    // Check if all data has been collected
    if (
      speedData.hasOwnProperty("location") &&
      speedData.hasOwnProperty("downloadSpeed") &&
      speedData.hasOwnProperty("uploadSpeed")
    ) {
      res.json(speedData);
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
