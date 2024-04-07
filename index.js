// Required modules
const express = require("express");
const { exec } = require("child_process");

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Speed test endpoint
app.get("/speedtest", (req, res) => {
  // Execute speed test command
  exec("python utils/speedtest.py --simple", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Parse speed test results
    const results = {};
    stdout.split("\n").forEach((line) => {
      const parts = line.split(":");
      if (parts.length === 2) {
        results[parts[0].trim()] = parts[1].trim();
      }
    });

    // Send speed test results to client
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
