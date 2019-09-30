
function onload(){
  getLocation();
  window.addEventListener('deviceorientation', function(eventData) {
    var tiltLR = eventData.gamma;
    var tiltFB = eventData.beta;
    var idir = eventData.alpha
    cam.rot[1] = idir;
    cam.rot[0] = tiltFB;
  }, false);
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  render = new Render(ctx,obj,cam);
}

var cam = {pos:[0,0,0],rot:[0,0]};
var c;
var ctx;
var render;
var obj = [{pos:[-9,0,5],size:[1,1,1],rot:[0,0]}];

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {

  }
}
function showPosition(position) {
  cam.pos[2] = position.coords.longitude;
  cam.pos[0] = position.coords.latitude;
  cam.pos[1] = position.coords.altitude;
}


function tick(){
  window.requestAnimationFrame(tick);
}
