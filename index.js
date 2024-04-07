// Server-side code
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    console.log("message type:", typeof message);

    if (message || message.type === "start-speed-test") {
      console.log("yes");
      ws.send(JSON.stringify({ type: "speed-test-started" }));
      // Assuming you have the mlab-speed-test library installed
      const { MLabSpeedTest } = require("mlab-speed-test");
      const speedTest = new MLabSpeedTest();

      // Event listeners for speed test results
      speedTest.on("server-chosen", (serverInfo) => {
        console.log(serverInfo.location);
      });

      speedTest.on("download-complete", (downloadData) => {
        const downloadSpeed = downloadData.LastClientMeasurement
          ? downloadData.LastClientMeasurement.MeanClientMbps.toFixed(2)
          : "0";
        console.log("Download Speed: " + downloadSpeed + "Mb/s");
        // Send download speed result to client
        ws.send(
          JSON.stringify({ type: "downloadSpeedUpdate", speed: downloadSpeed })
        );
      });

      speedTest.on("upload-complete", (uploadData) => {
        const uploadSpeed = uploadData.LastServerMeasurement
          ? (
              (uploadData.LastServerMeasurement.TCPInfo.BytesReceived /
                uploadData.LastServerMeasurement.TCPInfo.ElapsedTime) *
              8
            ).toFixed(2)
          : "0";
        console.log("Upload Speed: " + uploadSpeed + "Mb/s");
        // Send upload speed result to client
        ws.send(
          JSON.stringify({ type: "uploadSpeedUpdate", speed: uploadSpeed })
        );
      });

      speedTest.run();
    }
  });

  ws.send(JSON.stringify({ message: "Connected to server" }));
  console.log("connected");
});
