const express = require("express");
const app = express();
const { MLabSpeedTest } = require("mlab-speed-test");

// Initialize MLabSpeedTest with options
const speedTest = new MLabSpeedTest({
  ap: true, // Use automatic server selection
  json: true, // Output results in JSON format
  pretty: true, // Output results in human-readable format
});

// Endpoint to initiate speed test and return download speed
app.get("/speed-test", (req, res) => {
  // Run the speed test
  speedTest
    .run()
    .then((result) => {
      // Extract download speed from the result
      const downloadSpeed = result.LastClientMeasurement
        ? result.LastClientMeasurement.MeanClientMbps.toFixed(2)
        : "0";
      // Send download speed as the response
      res.json({ downloadSpeed });
    })
    .catch((error) => {
      console.error("Error running speed test:", error);
      res.status(500).json({ error: "Speed test failed" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
