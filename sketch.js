let walls = [];
let ray;
let particle;

let sliderFOV;
let field;
const sceneW = 600;
const sceneH = 600;

function setup() {
  createCanvas(1200, 600);

  // CREATE WALLS

  // Random
  for (let w = 0; w < 10; w++) {
    walls[w] = new Boundary(random(sceneW), random(sceneW), random(sceneH), random(sceneH));
  }

  // Outer
  walls.push(new Boundary(0, 0, sceneW, 0));
  walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
  walls.push(new Boundary(sceneW, sceneH, 0, sceneH));
  walls.push(new Boundary(0, sceneH, 0, 0));

  // Create Particle
  particle = new Particle();

  // FOV Slider
  sliderFOV = createSlider(2, 180, 90, 2);
  sliderFOV.position(10, height + 10);
  sliderFOV.input(changeFOV);

  createP('Field of Vision', sliderFOV.x, sliderFOV.y + 15);
  createP('Use W A S D keys to navigate', sliderFOV.x, sliderFOV.y + 20);
}

function changeFOV() {
  const fov = sliderFOV.value();
  particle.updateFOV(fov);
}

function draw() {
  background(0);

  // Show Walls
  for (let wall of walls) {
    wall.show();
  }

  // Move Particle
  if (keyIsDown(65)) {
    particle.rotate(-0.05);
  } else if (keyIsDown(68)) {
    particle.rotate(0.05);
  } else if (keyIsDown(83)) {
    particle.move(-1);
  } else if (keyIsDown(87)) {
    particle.move(1);
  }

  // Render
  particle.show();

  const scene = particle.look(walls);
  const w = sceneW / scene.length;

  push();
  translate(sceneW, 0);
  for (let i = 0; i < scene.length; i++) {
    noStroke();
    const sq = scene[i] * scene[i];
    const wSq = sceneW * sceneW;
    const b = map(sq, 0, wSq, 255, 0);
    const h = map(scene[i], 0, sceneW, sceneH, 0);
    let mid = scene.length / 2;
    if (i !== mid) {
      fill(b, h);
    } else {
      fill(0, 255, 0, h);
    }
    rectMode(CENTER);
    rect(i * w + w / 2, sceneH / 2, w + 1, (10 * h) / scene[i]);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
