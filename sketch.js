let z = 0.0;
let perlin;

function setup() {
    initSketch();
}

function windowResized() {
    initSketch();
}

function draw() {
    perlin.draw(z += 0.01);
}

function initSketch() {
    createCanvas(windowWidth, windowHeight);
    perlin = new Perlin();
}