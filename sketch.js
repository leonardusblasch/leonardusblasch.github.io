console.log("created with p5.js @ https://p5js.org/copyright.html");

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

class Perlin {
    constructor() {
        noStroke();
        colorMode(HSB, 1);
        noiseSeed(42)
        this.size = ceil(max(width, height) * 0.01);
        this.cols = ceil(width / this.size);
        this.rows = ceil(height / this.size);
    }
    draw() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let nx = x * 0.005;
                let ny = y * 0.005;
                fill(noise(nx, ny, z), 50, 100);
                rect(x * this.size, y * this.size, this.size);
            }
        }
    }
}