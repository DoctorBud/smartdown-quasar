```P5JS /playable/autoplay/kiosk

// https://kellylougheed.medium.com/javascript-pong-with-p5-js-3ae1b859418c
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
```
