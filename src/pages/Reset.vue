<template>
  <q-page padding>
    <Container>
      <h1>Reset</h1>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check" color="primary" text-color="white" />
            <span class="q-ml-sm">Please confirm that you wish to delete this note.</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              @click="cancel"
              flat label="Never Mind" color="primary" v-close-popup />
            <q-btn
              @click="reset"
              flat label="Reset Notes" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useLocalNotes } from 'src/helper';
import { useRouter } from 'vue-router';

import Container from 'src/components/Container.vue';

export default defineComponent({
  components: { Container },
  name: 'Reset',
  setup() {
    console.log('Reset.setup()');
    const confirm = ref(true);

    const router = useRouter();
    const cancel = () => {
      console.log('#cancel');
      router.push('/');
    };

    const reset = () => {
      console.log('#reset');

      const notes = useLocalNotes();

      const newNotes = [
        {
          title: 'Simple Markdown Note',
          description: 'Simple Markdown Note',
          content: `
## I am Markdown

- *italic*
- **bold**
- ~~strikethru~~
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          title: 'Simple Smartdown Note 2',
          description: 'Simple Smartdown Note 2',
          content: `
#### I am Smartdown

- *italic*
- **bold**
- ~~strikethru~~
- Einstein wrote: $E=mc^2$
[Name?](:?Name)

Nice to meet you, [x](:!Name)

\`\`\`javascript /playable
console.log('FOO');
smartdown.set('Name', 'FOO');
\`\`\`
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          title: 'P5JS Ellipse Example',
          description: 'P5JS Ellipse Example',
          content: `

#### P5JS Ellipse Example

\`\`\`p5js/playable
p5.setup = function() {
};

p5.draw = function() {
  p5.ellipse(50, 50, 80, 80);
};
\`\`\`
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          title: 'Smartdown and P5JS Mobius',
          description: 'Smartdown and P5JS Mobius',
          content: `
#### P5JS Mobius Example

[Segments[30]](:?SEGMENTS|number)
[Thickness[8]](:?SEG_WIDTH|number)
[Width[50]](:?SEG_LENGTH|number)

\`\`\`p5js/playable/autoplay
var PI = Math.PI;
var HALF_PI = PI / 2.0;

smartdown.setVariable('SEGMENTS', 30, 'number');
smartdown.setVariable('SEG_WIDTH', 8, 'number');
smartdown.setVariable('SEG_LENGTH', 50, 'number');

var speed = 0.05;
var ax = .01;
var ay = ax;
var az = ay;
var dx, dy, dz;

p5.windowResized = function() {
  p5.resizeCanvas(p5.windowWidth * 0.9, p5.windowHeight * 0.9);
};

p5.setup = function() {
  dx = p5.random(-speed, speed);
  dy = p5.random(-speed, speed);
  dz = p5.random(-speed, speed);

  p5.createCanvas(300, 300, 'webgl');
  p5.normalMaterial();

  p5.windowResized();
};

p5.draw = function() {
  var SEGMENTS = env.SEGMENTS;
  var SEG_WIDTH = env.SEG_WIDTH;
  var SEG_LENGTH = env.SEG_LENGTH;
  var DIAMETER = SEG_LENGTH * 2;
  p5.background('ivory');
  p5.camera(0, SEG_LENGTH, p5.windowHeight / 3, 0, 0, 0, 0, 1, 0);
  p5.rotateX(ax += dx);
  p5.rotateY(ay += dy);
  p5.rotateZ(az += dz);

  for (var i = 0; i < SEGMENTS; i++) {
    var frac = i * 2 / SEGMENTS;
    p5.push();
    p5.rotateX(frac * HALF_PI);
    p5.rotateY(HALF_PI);
    p5.translate(
        0,
        DIAMETER * p5.cos(frac * HALF_PI),
        DIAMETER * p5.sin(frac * PI));
    p5.cylinder(SEG_WIDTH, SEG_LENGTH);
    p5.pop();
  }
};
\`\`\`
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          title: 'Mandelbrot, ThreeJS, WebGL',
          description: 'Mandelbrot, ThreeJS, WebGL',
          content: `
#### Mandelbrot, ThreeJS, WebGL

This is a one-pint demo of how ThreeJS and Smartdown can be used to understand the [Mandelbrot Set](https://en.wikipedia.org/wiki/Mandelbrot_set). Although Smartdown is not intended to be a programming language to build *apps* with, it is perfect for *Explorable Explanations* such as this Mandelbrot Explorer.

[Zoom Out](:=zoom=zoom/2.0) [Zoom In](:=zoom=zoom*2.0) [Up](:=posY=posY+0.1/zoom) [Down](:=posY=posY-0.1/zoom) [Left](:=posX=posX-0.1/zoom) [Right](:=posX=posX+0.1/zoom) **AutoZoom** [](:Xbounciness)

[Entire Set](:=posX=0.6;posY=0.0;zoom=1) [Region A](:=posX=0.570;posY=0.630;zoom=25) [Region B](:=posX=0.190;posY=0.650;zoom=50) [Region C](:=posX=0.04292602539062498;posY=0.6965332031250012;zoom=2048)
[Set X/Y/Zoom](:=useCoordinates=1) [](:?coordinates)

\`\`\`javascript/playable/autoplay
//smartdown.import=three
var vertexShader =
\`
precision highp float;
uniform float zoom;
varying vec2 pos;

void main () {
  pos = position.xy / zoom;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
\`;

var fragmentShader =
\`
precision highp float;
uniform float zoom;
varying vec2 pos;
uniform float posX;
uniform float posY;

void main () {
  vec2 basePos = vec2(pos.x - posX, pos.y - posY);
  vec2 fractal = basePos;
  int iterations = 20 + int(zoom);

  for (int i = 0; i < 1000; i++) {
    if (i > iterations) {
      break;
    }
    fractal = basePos + vec2(
      fractal.x * fractal.x - fractal.y * fractal.y,
      2.0 * fractal.x * fractal.y
    );
  }

  // interpolate fractal color over position
  float x = abs(fractal.x);
  float y = abs(fractal.y);
  float z = (x + y);
  float magnitude = length(fractal);
  x = 2.0 * magnitude * x;
  y = 2.0 * magnitude * y;
  if (x > 1.0) {
    x = 1.0;
  }
  if (y > 1.0) {
    y = 1.0;
  }
  if (z > 1.0) {
    z = 1.0;
  }
  gl_FragColor = vec4(x, y, z, 1.0);
}
\`;

var that = this;
var myDiv = that.div;
// myDiv.style.background = 'darkslateblue';
myDiv.style['vertical-align'] = 'center';
myDiv.style['text-align'] = 'center';
myDiv.style['padding'] = '5px';
var width = 250.0;
var height = 250.0;

smartdown.setVariable('posX', 0.6, 'number');
smartdown.setVariable('posY', 0.0, 'number');
smartdown.setVariable('zoom', 0.666, 'number');
myDiv.innerHTML = '';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75.0, width / height, 0.1, 1000.0);
camera.position.z = 1;

// create canvas
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
myDiv.appendChild(renderer.domElement);

// create mandelbrot mesh
var geometry = new THREE.PlaneGeometry(2.0, 2.0, 0.0);
var material = new THREE.ShaderMaterial({
  uniforms: {
      zoom: { type: 'f', value: env.zoom },
      posX: { type: 'f', value: env.posX },
      posY: { type: 'f', value: env.posY }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var zoomOld = null;
var posXOld = null;
var posYOld = null;
var bouncinessOld = null;
var coordinatesOld = null;

function render(delta) {
  var posX = env.posX;
  var posY = env.posY;
  var zoom = env.zoom;
  var bounciness = env.bounciness;
  var coordinates = env.coordinates;
  var coordinatesNew = \`\${posX}/\${posY}/\${zoom}\`;
  var useCoordinates = env.useCoordinates;

  if (delta) {
    if (useCoordinates) {
      var coordinatesParts = coordinates.split('/');
      posX = Number(coordinatesParts[0]);
      posY = Number(coordinatesParts[1]);
      zoom = Number(coordinatesParts[2]);
      coordinatesNew = coordinates;
      env.useCoordinates = 0;
      env.posX = posX;
      env.posY = posY;
      env.zoom = zoom;
    }

    if (bounciness || bouncinessOld ||
        zoom !== zoomOld ||
        posX !== posXOld ||
        posY !== posYOld) {
      zoomOld = zoom;
      posXOld = posX;
      posYOld = posY;
      bouncinessOld = bounciness;
      coordinatesOld = coordinatesNew;
      smartdown.setVariable('coordinates', coordinatesNew);
      var bounce = bounciness ? (1.25 + Math.cos(delta / 2500)) : 1;
      mesh.material.uniforms.zoom.value = zoom * bounce;
      mesh.material.uniforms.posX.value = posX;
      mesh.material.uniforms.posY.value = posY;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(render);
  }
  else {
    requestAnimationFrame(render);
  }
}

render();
\`\`\`
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          title: 'Pong Game (NYI)',
          description: 'Pong Game (NYI)',
          content: `
\`\`\`P5JS /playable/autoplay/kiosk
// Variables for the ball
var xBall = Math.floor(Math.random() * 100) + 50;
var yBall = 50;
var diameter = 20;
var xBallChange = 5;
var yBallChange = 5;

// Variables for the paddle
var xPaddle;
var yPaddle;
var paddleWidth = 60;
var paddleHeight = 20;

var started = false;
var score = 0;
var width;
var height;

function computeBox() {
  width = windowWidth;
  height = windowHeight;
}

function windowResized() {
  computeBox();
  resizeCanvas(width, height);
}

function setup() {
  computeBox();
  createCanvas(width, height);
}

function draw() {
  background(0);
  
  // Ball bounces off walls
  xBall += xBallChange;
  yBall += yBallChange;
  if (xBall < diameter/2 || 
      xBall > width - 0.5*diameter) {
    xBallChange *= -1;
  }
  if (yBall < diameter/2 || 
      yBall > height - diameter) {
    yBallChange *= -1;
  }
  
  // Detect collision with paddle
  if ((xBall > xPaddle &&
      xBall < xPaddle + paddleWidth) &&
      (yBall + (diameter/2) >= yPaddle)) {
    xBallChange *= -1;
    yBallChange *= -1;
    score++;
  }
  
  // Draw ball
  fill(255, 0, 255);
  noStroke();
  ellipse(xBall, yBall, diameter, diameter);
  
  // Update paddle location
  if (!started) {
    xPaddle = width / 2;
    yPaddle = height - 100;
    started = true;
  }
  
  // Draw paddle
  fill(0, 255, 255);
  noStroke();
  rect(xPaddle, yPaddle, paddleWidth, paddleHeight);
  
  // Draw score
  fill(0, 255, 255);
  textSize(24);
  text("Score: " + score, 10, 25);
}

function mouseMoved() {
  xPaddle = mouseX;
  return false;
}
function touchMoved() {
  xPaddle = mouseX;
  return false;
}

// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     xPaddle -= 50;
//   } else if (keyCode === RIGHT_ARROW) {
//     xPaddle += 50;
//   }
// }
\`\`\`
`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      notes.value.splice(0, notes.value.length, ...newNotes);
      router.push('/');
    };

    return {
      confirm,
      cancel,
      reset,
    };
  },
});
</script>
