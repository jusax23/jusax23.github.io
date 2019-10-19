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
  tick();
}

var canvas;
var ctx;
var video;

function tick(){
  window.requestAnimationFrame(tick);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
	width = window.innerWidth;
	height = window.innerHeight;


  ctx.drawImage(video, 0, 0, width, height);
}
