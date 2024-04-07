const { MLabSpeedTest } = require("mlab-speed-test");

const speedTest = new MLabSpeedTest();
speedTest.on("server-chosen", (serverInfo) => {
  console.log(serverInfo.location);
});
speedTest.on("download-complete", (downloadData) => {
  const downloadSpeed = downloadData.LastClientMeasurement
    ? downloadData.LastClientMeasurement.MeanClientMbps.toFixed(2)
    : "0";
  console.log(downloadSpeed + "Mb/s");
});
speedTest.on("upload-complete", (uploadData) => {
  const uploadSpeed = uploadData.LastServerMeasurement
    ? (
        (uploadData.LastServerMeasurement.TCPInfo.BytesReceived /
          uploadData.LastServerMeasurement.TCPInfo.ElapsedTime) *
        8
      ).toFixed(2)
    : "0";
  console.log(uploadSpeed + "Mb/s");
});

speedTest.run();
