function onload(){

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  video = document.getElementById('video');
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
  }
}

const canvas;
const ctx;
const video;

function tick(){
  var my = canvas.height;
  var mx = canvas.width;

  window.requestAnimationFrame(tick);
  console.log("test");
  context.drawImage(video, 0, 0, mx, my);
}
