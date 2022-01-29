// Credits to Daniel Shiffman http://codingtra.in

let drops;
let n = 555;

function initDrops()
{
    drops = [];
    for (let i = 0; i < n; i++)
    {
        drops[i] = new Drop();
    }
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    initDrops();
}

function draw()
{
    background(230, 230, 250);
    for (let i = 0; i < drops.length; i++)
    {
        drops[i].fall();
        drops[i].show();
    }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
    initDrops();
}