//scp -r ~/Documents/projects/creative_code/p5js/glyph1/ pi@192.168.1.225:/home/pi/tv_sketches/
// Canvas size and spacing

var h = 1080;
var w = 1920;

  //edge offsets
var h_off = 200
var w_off = 200
  //space between glyphs
var spacing = 50

var unit_length = 0;

var aspect_ratio = (16/9);

var bg_color;
var glyphcol;
var sweight = 3;
var sideLength = 50;
var minLines = 1;   // Minimum number of lines per glyph
var maxLines = 3;  // Maximum number of lines per glyph

var minSeg = 1;   // Minimum number of lines per glyph
var maxSeg = 3;  // Maximum number of lines per glyph

var lines = [];
//var l1,l2,l3,l4,l5,l6,l7,l8,l9 = [];

var numSeg =0;

//cubelike
var p0 = [];
var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var p5 = [];
var p6 = [];

//corners
var p7 = [];
var p8 = [];
var p9 = [];
var p10 = [];

//cube face dots
var p11 = [];
var p12 = [];
var p13 = [];

var points = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13];

//dicts
var adj_dict = new Map();





function setup() {
  noFill();
  bg_color = color(0,0,0);
  glyphcol = color(255,255,255);
  points = shuffle(points);
  // Create the canvas
  createCanvas(w, h);
  background(bg_color);
  stroke(glyphcol);
  text("Loading...",50,50)
  strokeWeight(sweight);
  //noLoop()
  // frameRate(1/5);
  frameRate(1/15);
}

function draw() {
  background(bg_color);


  // pick grid
  // var x_n = Math.floor(random(0,10));
  var x_n = Math.floor(random(1,10));
  var y_n = Math.round(x_n/aspect_ratio);

  //calculate side length, spaching and offsets from grid info
  //ratio of spacing to side length
  var sf = 1
  //ratio of offset to side length
  var of = 2
  //calcualte the side length
  unit_length = w/(2*(of+x_n)+sf*(x_n-1));

  // unit_length = (w/(3*(x_n-1)+10));
  w_spacing = sf*unit_length;
  w_off = of*unit_length*.999; //.99 accoutns for rounding errors
  sweight = unit_length/30;
  strokeWeight(sweight);

  // h_spacing= (h-(2*unit_length)*(y_n))/(7+(y_n));
  h_spacing = (h-2*unit_length*y_n)/(2*(of/sf)+y_n-1)
  h_off = (of/sf)*h_spacing*.999; //.99 accoutns for rounding errors

  console.log(x_n,y_n, unit_length,h_spacing,h_off);
  console.log("width:",w, "total w:", (2*w_off)+(2*unit_length)+((2*unit_length+w_spacing)*(x_n-1)))
  console.log("height:",h, "total h:", (2*h_off)+(2*unit_length)+((2*unit_length+h_spacing)*(y_n-1)))
  console.log("height:",h, "##2 h_off:", (2*h_off), "##2 unit_length:",(2*unit_length), "##2 unit_length + spacing *n-1:",((2*unit_length+h_spacing)*(y_n-1)))
  // console.log((2*w_off),(2*unit_length),((2*unit_length+spacing)*(x_n-1)))

  // //corner offset markers
  // line(w_off/4,3*h_off/4, w_off,3*h_off/4);
  // line(3*w_off/4,h_off/4, 3*w_off/4,h_off);
  // line(w-w_off/4,h-3*h_off/4, w-w_off,h-3*h_off/4);
  // line(w-3*w_off/4,h-h_off/4, w-3*w_off/4,h-h_off);

  //calculate points with new side-length
  set_points()

  var w_pos=w_off+unit_length;
  var h_pos=h_off+unit_length;
  while(w_pos <= w-(w_off+unit_length)) {
    while(h_pos <= h-(h_off+unit_length)) {      
      draw_g(w_pos,h_pos);
      // sp_test(w_pos,h_pos);
      h_pos = h_pos + h_spacing + unit_length*2;
      // console.log("hpos_check",h_pos, h-h_off)
    }
    w_pos = w_pos + w_spacing + unit_length*2;
    h_pos=h_off+unit_length;
    // console.log("wpos_check",w_pos, w-w_off)
    // console.log("x",w,w_off,w_spacing,unit_length,w-w_pos)
    // console.log("y",h,h_off,h_spacing,unit_length,h-h_pos)
  }
}


function draw_g(xt,yt) {
  let numLines = int(random(minLines,maxLines));
  // console.log("number of lines", numLines);
  var nl=0;
  start_point = 0

  //draws circle
  draw_circ(xt,yt);

  push();
  translate(xt,yt);

  while (nl < numLines) {
    numSeg = int(random(minSeg,maxSeg));
    // console.log("line:",nl+1, "# segs:", numSeg);
    var i=0;

    var sPoint = points[start_point];

      while (i<numSeg) {
      let pt1 = sPoint;
      let pt1_adj = adj_dict.get(pt1)

      let pt2 = adj_dict.get(pt1)[Math.floor(random(0,pt1_adj.length))];

      let pr1 = points[Math.floor(random(0,points.length))];
      let pr2 = points[Math.floor(random(0,points.length))];

      // console.log("line:", nl+1, "seg:",i+1,pt1,pt2);
      bezier(pt1[0],pt1[1],pr1[0],pr1[1],pr2[0],pr2[1],pt2[0],pt2[1]);
      


      sPoint = pt2;
      i = i+1;

      }

    nl = nl + 1;
    start_point = start_point +1;
  }
  pop();
}

  function draw_circ(xt,yt){
    var cir_n = Math.floor(random(0,9));
    if (cir_n >3) {
      var r_cir = sideLength/3
      if (cir_n>4) {r_cir = sideLength/2}
        if (cir_n>6) {r_cir = sideLength}
      circle(xt,yt,r_cir)
    }
  }

  function sp_test(xt,yt){
    circle(xt,yt,unit_length/5);
    rect(xt-unit_length,yt-unit_length,2*unit_length,2*unit_length);
  }


function set_points() {

sideLength = unit_length/2

  //cubelike
p0 = [0,0];
p1 = [-sideLength*Math.sqrt(3), -sideLength];
p2 = [0, -2*sideLength];
p3 = [sideLength*Math.sqrt(3), -sideLength];
p4 = [sideLength*Math.sqrt(3), sideLength];
p5 = [0, 2*sideLength];
p6 = [-sideLength*Math.sqrt(3), sideLength];

//corners
p7 = [sideLength, sideLength];
p8 = [-sideLength, sideLength];
p9 = [-sideLength, -sideLength];
p10 = [sideLength, -sideLength];

//cube face dots
p11 = [0, sideLength/2];
p12 = [sideLength*Math.sqrt(3)/2, -sideLength/2];
p13 = [-sideLength*Math.sqrt(3)/2, -sideLength/2];

//dicts
adj_dict.set(p0,[p11,p12,p13,p4,p6,p2]);
adj_dict.set(p1,[p9,p2,p13,p6]);
adj_dict.set(p2,[p0,p9,p10,p13,p12,p1,p3]);
adj_dict.set(p3,[p12,p10,p4]);
adj_dict.set(p4,[p3,p12,p0,p11,p5,p7]);
adj_dict.set(p5,[p7,p4,p11,p6,p8]);
adj_dict.set(p6,[p8,p5,p11,p0,p13,p1]);
adj_dict.set(p7,[p5,p4,p11]);
adj_dict.set(p8,[p5,p11,p6]);
adj_dict.set(p9,[p1,p2,p13]);
adj_dict.set(p10,[p2,p12,p13]);
adj_dict.set(p11,[p6,p4,p5,p0]);
adj_dict.set(p12,[p0,p4,p3,p2]);
adj_dict.set(p13,[p1,p2,p0,p6]);

points = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13];
}
// NON BESZIER
// function draw() {
  
//   background(bg_color);
  
//   let num = int(random(minLines,maxLines));
//   console.log(num);
//   let i=0
//   while (i<num) {
//     push();
//     translate(50,50);
//     // let randoms = Math.floor(Math.random() * lines.length);
//     let lin = lines[i];
//     console.log(i, lines[i]);
//     line(lin[0],lin[1],lin[2],lin[3]);
//     pop();
//     i = i+1;
//   }
// }