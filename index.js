const express = require("express");
const path = require("path");
const FastSpeedtest = require("fast-speedtest-api");
const cors = require("cors");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const speedtest = new FastSpeedtest({
  token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
  timeout: 5000,
  unit: FastSpeedtest.UNITS.Mbps,
});

app.get("/speed", (req, res) => {
  speedtest
    .getSpeed()
    .then((speed) => {
      console.log(`Speed: ${speed} Mbps`);
      res.json({ speed: parseFloat(speed.toFixed(2)) });
    })
    .catch((error) => {
      console.error("Error fetching speed:", error.message);
      res.status(500).json({ error: "Failed to fetch speed" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
