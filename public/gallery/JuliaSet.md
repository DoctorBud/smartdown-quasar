


```javascript /autoplay/kiosk
//smartdown.import=https://biodiv.github.io/contactjs/assets/js/contact.min.js
//smartdown.import=three
//smartdown.import=https://webglfundamentals.org/webgl/resources/webgl-utils.js

SQ.setToolbarFade(true);

// our favorite julia seeds
let juliaSeeds = [ 
[-0.391,-0.587], 
[-0.4,-0.59], 
[-0.54, 0.54], 
[0.355, 0.355], 
[0.37, 0.1], 
[0, 0.8], 
[0.34, -0.05], 
[-0.54, 0.54], 
[0.355, 0.355], 
[0.37, 0.1],
[ -0.23697, 0.74191],
[ 0.10697,0.60107],
[-0.07804, 0.87842],
[-0.043586, -0.660170],
[-0.758152,  0.078872],
[-0.601741,  0.539047],
[-0.193855, -0.682188],
[-0.4, 0.6],
[ 0.285,0.01],
[-0.741196, -0.219623],
[ 0.301018,  0.544373],
[-0.018460, -0.855408],
[-0.912870, -0.292224],
[ 0.403483,  0.245145],
[-0.223401,  0.663145],    
[-0.354799,  0.649040],
[-0.562154, -0.490506],
[ 0.279178,  0.485608],
[-0.108845, -0.839491],
[ 0.248667,  0.550450],
[ 0.372236,  0.281562],
[-0.215368, -0.645294],
[-0.457105, -0.591589],
[ 0.032369, -0.678670],
[ 0.080918,  0.647938],
[-0.528820, -0.592274],
[-0.626447, -0.432047],
[-0.580706,  0.503872],
[-0.770593,  0.016029],
[-0.493384, -0.546958],
[-0.540198, -0.527884],
[-0.326370, -0.655075],
[-0.76643,   0.22774],
[-0.70183,  -0.25442],
[0.37518,   0.18675],
[-0.64606, -0.38310],
[-0.81586, 0.27934],
[-0.54393, -0.54383],
[-0.11345, 0.66000],
[-0.10884, -0.838],
[-0.55, -0.4785],
[-0.025, -0.8],
[-0.75, 0.016029],
[-0.626447,-0.407],
[-0.108,-0.837],
[-0.455, 0.595],
[-0.2, -0.685],
[-0.76643, 0.1],
[-0.10, -0.8397],
[-0.749, 0.0229],
[-0.542, -0.4933],
[-0.626447, -0.403],
[-0.145, -0.8375],
[-0.49, 0.6],
[-0.4907, 0.6],
[0.301, 0.48788],
[-0.749, 0.042],
[-0.7511, 0.022],
[-0.552, -0.478]
];


/////////////////////////////////////////////////////////////////////////////

function randColorVal() {
  return Math.random();     // in WebGL colors are floats between 0 and 1
}


// This is an array of 7 colors that form a color scheme
// Each color is an array with form [ R, G, B ]
class ColorSeed {
  constructor() {
    this.colors = new Array();
    for (let i=0; i < 7; i++) {
      this.colors.push([randColorVal(), randColorVal(), randColorVal()]);
    }
  }
}


// a JuliaSeed is everything you need to construct a Julia Set. 
class JuliaSeed {
  constructor() {
    this.pan = { x: 0, y: 0 }; // start with fractal centered at (0,0)

    let k = juliaSeeds[Math.floor(Math.random() * juliaSeeds.length)];
    this.seed = { x: k[0], y: k[1] };   // a complex number seed. xi + y

    // randomly perturb the seed
    if (Math.floor(Math.random() * 3) == 0) {
      this.seed.x = k[0] + Math.random() * (Math.floor(Math.random() * 2) ? -0.02 : 0.02);
    }
    if (Math.floor(Math.random() * 3) == 0) {
      this.seed.y = k[1] + Math.random() * (Math.floor(Math.random() * 2) ? -0.02 : 0.02);
    }

    this.zoom = 1 / 2 + Math.random() * 1/2;  // random zoom level
  }
}

// the ColorSeed and the JuliaSeed is everything you need to construct a fractal
class Julia {
  constructor(jseed, cseed) {
    if (jseed === undefined ) { this.juliaseed = new JuliaSeed(); }
    else { this.juliaseed = jseed; }
    if (cseed === undefined) { this.colorseed = new ColorSeed(); }
    else { this.colorseed = cseed; }
  }
}


//////////////////////////////////////////////////////////////////////

/**
* Utilitary function that allows to set up the shaders (program) using an embedded script (look at the beginning of this source code)
*/
function getShader(gl, str, type) {
   
  let shader;
  if (type == 'fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == 'vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
      return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
  }
  return shader;
}

function requestAnimFrame(o){
  requestAnimFrame(o);
}

  
        



/**
* Provides requestAnimationFrame in a cross browser way.
*/
requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
       function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
         window.setTimeout(callback, 1000/60);
       };
})();

/////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////

// set up our div and add a canvas
this.div.style.width = '100%';
this.div.style.height = '100%';
this.div.style.margin = 'auto';
this.div.innerHTML = `<canvas id="appCanvas"></canvas>`


// WebGL variables
let gl = null; // WebGL context
let prg = null; // The program (shaders)
let screenVertexBuffer = null; //The vertex buffer for the square
let screenIndexBuffer = null; // The index buffer for the square
let indices = []; //JavaScript array to store the indices of the screen
let vertices = []; //JavaScript array to store the vertices of the screen

let canvas = document.getElementById("appCanvas"); 
gl = canvas.getContext("webgl");

if (gl == null) {
  alert("Could not initialise WebGL");
}

let width = canvas.width;
let height = canvas.height;
let maxiterations = 64 * 6;
let seeds = [];
let currentJuliaID = 0;


function sizeCanvas() {
  gl.canvas.width  = window.innerWidth;
  gl.canvas.height = window.innerHeight;
  width = gl.canvas.width;
  height = gl.canvas.height;
}

sizeCanvas();



/////////////////////////////////////////////////////////////////////////////////


// This is the WebGL program to color each pixel
let fshaderText =
`
precision highp float;

uniform vec2 u_shift;
uniform vec2 u_zoom;
uniform vec2 u_seed;
uniform vec3 u_colors[7];
varying vec2 v_position;  // pixel position


void main() {

  vec2 p = (v_position + u_shift) / u_zoom;
  int it = 0;
  for (int i=0 ; i < 384; i++) {
    if (p.x * p.x + p.y * p.y > 4.0) {
      break;
    }
    p = u_seed + vec2(p.x * p.x - p.y * p.y, 2.0 * p.x * p.y);
    it = i;
  }

  vec4 color = vec4(u_colors[0], 1.0);
  if (it < 384) {
    int low = it / 64;
    float numerator = float(it - 64*low);
    float percent = numerator / 64.0;
    vec3 interp_color = vec3(0.0, 0.0, 0.0);
    if (low == 0) {
      interp_color = u_colors[0] + (u_colors[1] - u_colors[0]) * percent;
    } else if (low == 1) {
      interp_color = u_colors[1] + (u_colors[2] - u_colors[1]) * percent;
    } else if (low == 2) {
      interp_color = u_colors[2] + (u_colors[3] - u_colors[2]) * percent;
    } else if (low == 3) {
      interp_color = u_colors[3] + (u_colors[4] - u_colors[3]) * percent;
    } else if (low == 4) {
      interp_color = u_colors[4] + (u_colors[5] - u_colors[4]) * percent;
    } else if (low == 5) {
      interp_color = u_colors[5] + (u_colors[6] - u_colors[5]) * percent;
    } 
    color = vec4(interp_color, 1.0);
  }
  gl_FragColor = color;
}
`

// This is the WebGL program to position the vertices of the screen
// Positions come as pixel positions and we convert them to clipspace [-1, 1]
let vshaderText =
`
attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_position;

void main() {
  v_position = a_position;
  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);
}
`;


// initialize the WebGL shader programs from text and compile them to run on graphics drive
function initProgram() {
  let fgShader = getShader(gl, fshaderText, 'fragment');
  let vxShader = getShader(gl, vshaderText, 'vertex');

  prg = gl.createProgram();
  gl.attachShader(prg, vxShader);
  gl.attachShader(prg, fgShader);
  gl.linkProgram(prg);

  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(prg);

  prg.positionAL = gl.getAttribLocation(prg, "a_position");
  prg.resolutionUL = gl.getUniformLocation(prg, 'u_resolution');
  prg.shiftUL = gl.getUniformLocation(prg, 'u_shift');
  prg.zoomUL = gl.getUniformLocation(prg, 'u_zoom');
  prg.seedUL = gl.getUniformLocation(prg, 'u_seed');
  prg.colorUL = gl.getUniformLocation(prg, 'u_colors');
}   


function initBuffers() {
  // the screen is two triangles over 4 vertices     
  vertices =  [ 
    0,height,     // vertex 3
    0,0,          // vertex 1
    width,0,      // vertex 2
    width,height  // vertex 4
  ];
  indices = [3,2,1,3,1,0];
  
  // creates a vertex buffer and binds the vertices to it
  screenVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, screenVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // creates an index buffer and binds the indices to it
  screenIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // unbind the buffers.  I don't understand why you do this.
  gl.bindBuffer(gl.ARRAY_BUFFER, null);  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


function drawScene(){
//  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // clear the screen to black
  gl.enable(gl.DEPTH_TEST);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0,0,gl.canvas.width, gl.canvas.height);

  // now we need to pass a lot of information to the graphics card
  let seed = seeds[currentJuliaID];
  let js = seed.juliaseed;
  let zoom = js.zoom * Math.max(width, height);

  gl.uniform2f(prg.resolutionUL, width, height);
  gl.uniform2f(prg.shiftUL, -width/2 + js.pan.x, -height/2 + js.pan.y);
  gl.uniform2f(prg.zoomUL, zoom, zoom);
  gl.uniform2f(prg.seedUL, js.seed.x, js.seed.y);

  let colors = seed.colorseed.colors.flat();
  gl.uniform3fv(prg.colorUL, colors);

  gl.bindBuffer(gl.ARRAY_BUFFER, screenVertexBuffer);
  gl.vertexAttribPointer(prg.positionAL, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(prg.positionAL);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenIndexBuffer);

  //  finally we draw the two triangles that comprise the screen
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}


function renderLoop() {
 requestAnimFrame(renderLoop);
 drawScene();
}


function runWebGLApp(){
  initProgram();
  initBuffers();
  drawScene();
}


const bookmarkColors = true;

function updateURLFromSeed(fullSeed) {
  const url = new URL(window.location.href);
  url.searchParams.set('zoom', fullSeed.juliaseed.zoom);
  url.searchParams.set('seedX', fullSeed.juliaseed.seed.x);
  url.searchParams.set('seedY', fullSeed.juliaseed.seed.y);
  url.searchParams.set('panX', fullSeed.juliaseed.pan.x);
  url.searchParams.set('panY', fullSeed.juliaseed.pan.y);

  if (bookmarkColors) {
    const colors = fullSeed.colorseed.colors;
    for (let i = 0; i < colors.length; ++i) {
      for (let j = 0; j < 3; ++j) {
        url.searchParams.set(`c${i}${j}`, colors[i][j]);
      }
    }
  }

  window.history.replaceState(window.history.state, null, url);
}

function newFractal() {
  const fullSeed = new Julia();

  const searchParams = new URLSearchParams(window.location.search);
  const zoom = searchParams.get('zoom');
  const seedX = searchParams.get('seedX');
  const seedY = searchParams.get('seedY');
  const panX = searchParams.get('panX');
  const panY = searchParams.get('panY');

  if (zoom !== null) {
    fullSeed.juliaseed.zoom = parseFloat(zoom);
    fullSeed.juliaseed.seed.x = parseFloat(seedX);
    fullSeed.juliaseed.seed.y = parseFloat(seedY);
    fullSeed.juliaseed.pan.x = parseFloat(panX);
    fullSeed.juliaseed.pan.y = parseFloat(panY);
  }

  if (bookmarkColors) {
    const colors = fullSeed.colorseed.colors;
    for (let i = 0; i < colors.length; ++i) {
      for (let j = 0; j < 3; ++j) {
        const color = searchParams.get(`c${i}${j}`);
        if (color !== null) {
          colors[i][j] = parseFloat(color);
        }
      }
    }
  }

  seeds.push(fullSeed);
  currentJuliaID = seeds.length - 1;
}

///////////////////////////////////////////////////////////////////////////////////

window.addEventListener('resize', function(event){
  sizeCanvas();
  drawScene();
});


//////////////////////////// TOUCH EVENTS //////////////////////////////////////////

let panActive = false;
var pinchActive = false;
let animationFrameId = null;
let ticking = false;

let options = {
  "supportedGestures" : [Press, Pan, Pinch]
};

let pointerListener = new PointerListener(this.div, options);


this.div.addEventListener('press', function(event){
  const fullSeed = seeds[currentJuliaID];
  fullSeed.colorseed = new ColorSeed();
  updateURLFromSeed(fullSeed);
  drawScene();
});

this.div.onmousedown = function(e) {  
  setTimeout(function(){
    panActive = true;
  }, 100);
}

this.div.ondblclick = function(e) {
  const fullSeed = seeds[currentJuliaID];
  const seed = fullSeed.juliaseed;

  seed.pan.x += (e.clientX - width / 2.0);
  seed.pan.y += -(e.clientY - height / 2.0);

  const scale = 1.5;
  seed.zoom *= scale;
  seed.pan.x *= scale;
  seed.pan.y *= scale;
  updateURLFromSeed(fullSeed);
  drawScene();
}

const debouncedZoom = (waitTimeForDraw, waitTimeForBookmark) => {
  let drawTimeout = null;
  let bookmarkTimeout = null;
  let totalDeltaY = 0;

  return (event) => {
    window.clearTimeout(drawTimeout);
    window.clearTimeout(bookmarkTimeout);
    totalDeltaY += event.deltaY;
    event.preventDefault();

    drawTimeout = window.setTimeout(() => {
      const scale = (1.0 - 0.001 * totalDeltaY);
      seeds[currentJuliaID].juliaseed.zoom *= scale;
      seeds[currentJuliaID].juliaseed.pan.x *= scale;
      seeds[currentJuliaID].juliaseed.pan.y *= scale;
      totalDeltaY = 0;
      drawScene();
    }, waitTimeForDraw);

    bookmarkTimeout = window.setTimeout(() => {
      updateURLFromSeed(seeds[currentJuliaID]);
    }, waitTimeForBookmark);
  };
}

this.div.onwheel = debouncedZoom(6, 500);

// End: Events related to desktop and web usage.

let prev_panx = 0;
let prev_pany = 0;
let save_panx = 0;
let save_pany = 0;
this.div.addEventListener('panstart', function(event) {
  if (!pinchActive) {
    panActive = true;
    prev_panx = 0;
    prev_pany = 0;
    save_panx = seeds[currentJuliaID].juliaseed.pan.x;
    save_pany = seeds[currentJuliaID].juliaseed.pan.y;
  }
});

this.div.addEventListener('pan', function(event){
  if (panActive == true) {
    // transform
    let x = event.detail.global.deltaX - prev_panx;
    let y = event.detail.global.deltaY - prev_pany;
    prev_panx = event.detail.global.deltaX;
    prev_pany = event.detail.global.deltaY;
    seeds[currentJuliaID].juliaseed.pan.x -= x * 1.8;
    seeds[currentJuliaID].juliaseed.pan.y += y * 1.8;  
    drawScene();    
  }
});


this.div.addEventListener('panend', function(event){
  if (panActive) {
    panActive = false; 
    updateURLFromSeed(seeds[currentJuliaID]);
  }
});

this.div.addEventListener('swipeleft', function(event){
  if (panActive) {
    seeds[currentJuliaID].juliaseed.pan.x = save_panx;
    seeds[currentJuliaID].juliaseed.pan.y = save_pany;
    panActive = false;
  }
  if (currentJuliaID < (seeds.length - 1) ) { 
    currentJuliaID++; 
  }
  else {
    if (seeds.length == 20) { seeds.shift(); }
    seeds.push(new Julia());
    currentJuliaID = seeds.length -1;    
  }

  updateURLFromSeed(seeds[currentJuliaID]);
  drawScene();
});


this.div.addEventListener('swiperight', function(event){
  if (panActive) {
    seeds[currentJuliaID].juliaseed.pan.x = save_panx;
    seeds[currentJuliaID].juliaseed.pan.y = save_pany;
    panActive = false;
  }
  if (currentJuliaID > 0 ) { 
    currentJuliaID--; 
    updateURLFromSeed(seeds[currentJuliaID]);
    drawScene();
  }
});


let prev_scale = 1;
this.div.addEventListener('pinchstart', function(event){
  pinchActive = true;
  prev_panx = 0;
  prev_pany = 0;
  prev_scale = 0;
});

this.div.addEventListener('pinch', function(event){
  if (pinchActive == true){
    let x = event.detail.global.deltaX - prev_panx;
    let y = event.detail.global.deltaY - prev_pany;
    prev_panx = event.detail.global.deltaX;
    prev_pany = event.detail.global.deltaY;
    seeds[currentJuliaID].juliaseed.pan.x -= x * 1.8;
    seeds[currentJuliaID].juliaseed.pan.y += y * 1.8; 
    let scale = (event.detail.live.scale + 7.0) / 8;
    seeds[currentJuliaID].juliaseed.pan.x *= scale;
    seeds[currentJuliaID].juliaseed.pan.y *= scale;   
    seeds[currentJuliaID].juliaseed.zoom *= scale;
    drawScene();       
  } 
});

this.div.addEventListener('pinchend', function(event){
  updateURLFromSeed(seeds[currentJuliaID]);
  pinchActive = false; 
});




///////////////////////////////////////////////////////////////////////////////////

// let portrait = window.matchMedia("(orientation: portrait)");

// portrait.addEventListener("change", function(e) {
//   e.preventDefault();
//     if(e.matches) {
//       // Portrait mode
//       canvas.width  = screen.width;
//       canvas.height = screen.height;
//       draw();
//     } else {
//       // Landscape
//       canvas.height  = screen.width;
//       canvas.width = screen.height;
//       draw();
//     }
// })

//////////////////////  MOUSE EVENTS //////////////////////////////////////////////

// this.div.onmousedown = function(e) {  
//   if (currentJuliaID < (seeds.length - 1) ) { 
//     currentJuliaID++; 
//   }
//   else {
//     if (seeds.length == 20) { seeds.shift(); }
//     seeds.push(new Julia());
//     currentJuliaID = seeds.length -1;    
//   }
//   drawScene();
// }

///////////////////////////////////////////////////////////////////////////////////
newFractal();
runWebGLApp();

```
