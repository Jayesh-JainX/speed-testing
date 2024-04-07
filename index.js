const express = require("express");
const cors = require("cors");
const app = express();
const { MLabSpeedTest } = require("mlab-speed-test");
const speedTest = new MLabSpeedTest();

app.use(cors()); // Add CORS middleware to enable Cross-Origin Resource Sharing

app.get("/speed-test", (req, res) => {
  speedTest.on("download-complete", (downloadData) => {
    const downloadSpeed = downloadData.LastClientMeasurement
      ? downloadData.LastClientMeasurement.MeanClientMbps.toFixed(2)
      : "0";
    console.log("Download Speed: " + downloadSpeed + "Mb/s");

    // Send download speed result to client as part of the HTTP response
    res.json({ downloadSpeed });
  });

  // Run the speed test
  speedTest.run().catch((error) => {
    console.error("Error running speed test:", error);
    res.status(500).json({ error: "Speed test failed" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
