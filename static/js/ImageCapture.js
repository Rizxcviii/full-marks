document.getElementById('form').addEventListener("submit", compareImages, true);

// load the webcam
Webcam.set({
  width: 325,
  hieght: 240,
    image_format: "jpeg",
    jpeg_quality: 90
  });

Webcam.attach("#camera");

// let shutter = new Audio();
// shutter.autoplay = true;
// shutter.src = navigator.userAgent.match(/Firefox/)
//   ? "shutter.ogg"
//   : "shutter.mp3";

function takeSnapshot() {
  Webcam.snap(function(data_uri) {
    document.getElementById("results").innerHTML =
      '<img id="preview" src="' + data_uri + '" />';
  });
}