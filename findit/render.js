const Render = function(ctx,obj,cam){
  this.ctx = ctx;
  this.obj = obj;
  this.cam = cam;

  const Point2D = function(x, y) { this.x = x; this.y = y; };
  const Point3D = function(x, y, z) { this.x = x; this.y = y; this.z = z; };
  const Cube = function(x, y, z, dx, dy, dz) {
    Point3D.call(this, x, y, z);
    dx *= 0.5;
    dy *= 0.5;
    dz *= 0.5;
    //x += dx;
    //y += dy;
    //z += dz;
    this.vertices = [new Point3D(x - dx, y - dy, z - dz),
                     new Point3D(x + dx, y - dy, z - dz),
                     new Point3D(x + dx, y + dy, z - dz),
                     new Point3D(x - dx, y + dy, z - dz),
                     new Point3D(x - dx, y - dy, z + dz),
                     new Point3D(x + dx, y - dy, z + dz),
                     new Point3D(x + dx, y + dy, z + dz),
                     new Point3D(x - dx, y + dy, z + dz)];
    this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2], [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]];
    this.rotateX = function(deg){
      radian = deg/180*Math.PI;
      var cosine = Math.cos(radian);
      var sine   = Math.sin(radian);
      for (let index = this.vertices.length - 1; index > -1; -- index) {
        let p = this.vertices[index];
        let y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
        let z = (p.y - this.y) * sine + (p.z - this.z) * cosine;
        p.y = y + this.y;
        p.z = z + this.z;
      }
    };
    this.rotateY = function(deg){
      radian = deg/180*Math.PI;
      var cosine = Math.cos(radian);
      var sine   = Math.sin(radian);
      for (let index = this.vertices.length - 1; index > -1; -- index) {
        let p = this.vertices[index];
        let x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
        let z = (p.z - this.z) * cosine - (p.x - this.x) * sine;
        p.x = x + this.x;
        p.z = z + this.z;
      }
    };

  };

  //var cube = new Cube(0, 0, 400, 200);
  var height = document.documentElement.clientHeight;
  var width = document.documentElement.clientWidth;
  function project(points3d, width, height) {
    var points2d = new Array(points3d.length);
    var focal_length = 600;
    for (let index = points3d.length - 1; index > -1; -- index) {
      let p = points3d[index];
      let x = p.x * (focal_length / Math.abs(p.z)) + width * 0.5;
      let y = p.y * (focal_length / Math.abs(p.z)) + height * 0.5;
      points2d[index] = new Point2D(x, y);
    }
    return points2d;
  }
  this.draw = function() {

    height = document.documentElement.clientHeight;
    width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width  = width;

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = "#faa";

    var grd = ctx.createLinearGradient(20, 0, 0, height/2);
    grd.addColorStop(0, "#558B2F");
    grd.addColorStop(1, "#3E2723");

    this.ctx.fillStyle = "#0080f0";

    obj.sort(function(a,b){
      return Math.sqrt(Math.pow(b.pos[0]-cam.pos[0],2)+Math.pow(b.pos[1]-cam.pos[1],2)+Math.pow(b.pos[2]-cam.pos[2],2))-
        Math.sqrt(Math.pow(a.pos[0]-cam.pos[0],2)+Math.pow(a.pos[1]-cam.pos[1],2)+Math.pow(a.pos[2]-cam.pos[2],2));
    });

    for(var ii = 0; ii < obj.length; ii++){
      var objj = obj[ii];

      var cosine = Math.cos(cam.rot[1]/180*Math.PI);
      var sine = Math.sin(cam.rot[1]/180*Math.PI);
      var nbx = (objj.pos[2] - cam.pos[2]) * sine + (objj.pos[0] - cam.pos[0]) * cosine+cam.pos[0];
      var nbz = (objj.pos[2] - cam.pos[2]) * cosine - (objj.pos[0] - cam.pos[0]) * sine+cam.pos[2];

      cosine = Math.cos(cam.rot[0]/180*Math.PI);
      sine = Math.sin(cam.rot[0]/180*Math.PI);
      var nby = (objj.pos[1] - cam.pos[1]) * cosine - (nbz - cam.pos[2]) * sine+cam.pos[1];
      var nbz = (objj.pos[1] - cam.pos[1]) * sine + (nbz - cam.pos[2]) * cosine+cam.pos[2];

      var nx = (nbx-cam.pos[0])*111111;
      var ny = (nby-cam.pos[1])*111111;
      var nz = (nbz-cam.pos[2])*111111;
      var nsx = objj.size[0]*32;
      var nsy = objj.size[1]*32;
      var nsz = objj.size[2]*32;
      var nrotx = objj.rot[0]+cam.rot[0];
      var nroty = objj.rot[1]+cam.rot[1];
      var cube = new Cube(nx,ny,nz,nsx,nsy,nsz);
      cube.rotateY(nroty);
      cube.rotateX(nrotx);

      if(nz>1 && ny > -height/2 && ny < height/2 && nx > -width/2 && nx<width/2){
        var vertices = project(cube.vertices, width, height);
        for (let index = cube.faces.length - 1; index > -1; -- index) {
          let face = cube.faces[index];
          let p1 = cube.vertices[face[0]];
          let p2 = cube.vertices[face[1]];
          let p3 = cube.vertices[face[2]];
          let v1 = new Point3D(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
          let v2 = new Point3D(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);
          let n  = new Point3D(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
          if (-p1.x * n.x + -p1.y * n.y + -p1.z * n.z <= 0) {
            var pointsin = [
              {x: vertices[face[0]].x, y:height-vertices[face[0]].y},
              {x: vertices[face[1]].x, y:height-vertices[face[1]].y},
              {x: vertices[face[2]].x, y:height-vertices[face[2]].y},
              {x: vertices[face[3]].x, y:height-vertices[face[3]].y}
            ];

            this.ctx.beginPath();
            this.ctx.moveTo(pointsin[0].x, pointsin[0].y);
            this.ctx.lineTo(pointsin[1].x, pointsin[1].y);
            this.ctx.lineTo(pointsin[2].x, pointsin[2].y);
            this.ctx.lineTo(pointsin[3].x, pointsin[3].y);
            /*this.ctx.moveTo(vertices[face[0]].x, height-vertices[face[0]].y);
            this.ctx.lineTo(vertices[face[1]].x, height-vertices[face[1]].y);
            this.ctx.lineTo(vertices[face[2]].x, height-vertices[face[2]].y);
            this.ctx.lineTo(vertices[face[3]].x, height-vertices[face[3]].y);*/
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
              //console.log(pointsin,nx,ny,nz);
            if(isPointInPoly(pointsin, {x:width/2,y:height/2})){
              console.log(objj);
            }
          }
        }
      }

    }
    ctx.fillStyle = "#000";
    ctx.fillRect(width*0.5-25,height*0.5-2.5,50,5);
    ctx.fillRect(width*0.5-2.5,height*0.5-25,5,50);

  };
  function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
  }
}
