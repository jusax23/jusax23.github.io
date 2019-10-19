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

const canvas = null;
const ctx = null;
const video = null;

function tick(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
	width = window.innerWidth;
	height = window.innerHeight;

  window.requestAnimationFrame(tick);
  console.log("test");
  context.drawImage(video, 0, 0, width, height);
}
