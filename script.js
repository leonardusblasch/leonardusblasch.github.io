import { g } from "./fire.js";

let books = ["1 Mose", "2 Mose", "3 Mose", "4 Mose", "5 Mose", "Josua", "Richter", "Ruth", "1 Samuel", "2 Samuel", "1 Könige", "2 Könige", "1 Chronik", "2 Chronik", "Esra", "Nehemia", "Esther", "Hiob", "Psalm", "Prediger", "Hohelied", "Jesaja", "Jeremia", "Klagelieder", "Sprüche", "Hesekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadja", "Jona", "Micha", "Nahum", "Habakuk", "Zephanja", "Haggai", "Sacharja", "Maleachi", "Matthäus", "Markus", "Lukas", "Johannes", "Apostelgeschichte", "Römer", "1 Korinther", "2 Korinther", "Galater", "Epheser", "Philipper", "Kolosser", "1 Thessalonicher", "2 Thessalonicher", "1 Timotheus", "2 Timotheus", "Titus", "Philemon", "Hebräer", "Jakobus", "1 Petrus", "2 Petrus", "1 Johannes", "2 Johannes", "3 Johannes", "Judas", "Offenbarung"];
let book = undefined;
let chap = undefined;
let vers = undefined;
let jackpot = undefined;
let trigger = false;
let current = -1;
let bandit;

window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    bandit = new Bandit();
}

window.draw = function() {
    background(130);
    stroke(150);
    line(0, height / 2, width, height / 2);
    bandit.draw(0.1);
}

class Bandit {
    constructor() {

        this.w = (1 / 12) * width;
        this.h = (5 / 7) * height;
        this.y = height / 2 - this.h / 2;
        this.hook = new Hook(10 * this.w, height / 2, this.w, this.h * 0.75);
        this.reset();
    }

    reset() {
        this.book = new Blank(1 * this.w, this.y, 2 * this.w, this.h);
        this.chap = new Blank(4 * this.w, this.y, 2 * this.w, this.h);
        this.vers = new Blank(7 * this.w, this.y, 2 * this.w, this.h);
    }

    draw(a) {

        this.hook.update();

        this.book.update(a);
        this.chap.update(a);
        this.vers.update(a);

        if(trigger) {
            current++;
            current %= 4;
            switch(current) {
                case 0: this.book = new Arm(1 * this.w, this.y, 2 * this.w, this.h, books); break;
                case 1: book = this.book.result;
                        getChaps().then(function(result) {
                            newChap(result);
                        });
                        break;
                case 2: chap = this.chap.result;
                        getVerses().then(function(result) {
                            newVers(result);
                        });
                        break;
                case 3: vers = this.vers.result;
                        g.bible(book, chap, vers).then(function(result) {
                            jackpot = result;
                        });
                        break;
                default: break;
            }
            trigger = false;
        }
    }
}

class Blank {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    update() {
        fill(200);
        rect(this.x, this.y, this.w, this.h)
    }
}

class Arm extends Blank{
    constructor(x, y, w, h, options) {
        super(x, y, w, h);
        this.h2 = h / 2;
        this.ops = options;
        this.len = options.length;
        this.seg = TWO_PI / options.length;
        this.rot = HALF_PI;
        this.active = true;
        this.g = createGraphics(w, h);
        this.g.textAlign(CENTER, CENTER);
    }

    update(a) {
        this.draw();
        this.roll(a);
    }

    draw() {
        this.g.background(255);
        if(this.len == 1) {
            this.g.text(this.ops[0], this.w / 2, this.h2);
            image(this.g, this.x, this.y, this.w, this.h);
            return;
        }
        for (let i = 0; i < this.len; i++) {
            let a = (this.rot + this.seg * i) % (TWO_PI);
            if (a > 0 && a < PI) {
                let y = this.h2 + cos(a) * this.h2;
                this.g.line(0, y, this.w, y);


                a += this.seg / 2;

                if(a < PI) {
                    let t = this.h2 + cos(a) * this.h2;
                    let d = abs(this.h / 2 - t);
                    let s = map(d, 0, this.h / 2, 1, 0);



                    this.g.push();
                    this.g.translate(this.w / 2, t);
                    this.g.scale(1, s);
                    this.g.text(this.ops[this.len - i - 1], 0, 0);
                    this.g.pop();
                    }
            }
            else if(a > TWO_PI - this.seg / 2) {
                let t = this.h2 + cos(a + this.seg / 2) * this.h2;
                let d = abs(this.h / 2 - t);
                let s = map(d, 0, this.h / 2, 1, 0);

                this.g.push();
                this.g.translate(this.w / 2, t);
                this.g.scale(1, s);
                this.g.text(this.ops[this.len - i - 1], 0, 0);
                this.g.pop();
            }
        }

        image(this.g, this.x, this.y, this.w, this.h);
    }

    roll(a) {
        if (this.active) {
            if (trigger) {
                this.result = floor((this.rot - HALF_PI) / this.seg) % this.len;
                this.rot = this.result * this.seg + this.seg / 2 + HALF_PI;
                this.active = false;
            }
            else {
                this.rot += a;
            }
        }
    }
}


class Hook {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = 0;
        this.on = false;
        this.triggered = false;
    }

    update() {
        this.draw();
        this.move();
    }

    draw() {
        fill(110);
        let base = this.y / 20;
        rect(this.x, this.y - (base / 2), this.w, base);

        let lev = -cos(this.a) * this.h / 2;
        let w = this.w / 5;
        let x = this.x + this.w / 2;

        fill(130);
        rect(x - w / 2, this.y, w, lev);

        fill(200);
        ellipse(x, this.y + lev, w * 3);

        this.check(x, this.y + lev, (w * 3) / 2);
    }

    check(x, y, r) {
        if (this.on) return;
        if (!mouseIsPressed) return;
        if (pointInCircle(mouseX, mouseY, x, y, r)) {
            this.on = true;
        }
    }

    move() {
        if (this.on) {
            if (this.a < PI) {
                this.a += 0.33;
            }
            else if (this.a < TWO_PI) {
                this.a += 0.07;
                if(!this.triggered) {
                    this.triggered = true;
                    trigger = true;
                }
            }
            else {
                this.a = 0;
                this.on = false;
                this.triggered = false;
                if(current == 3) {
                    alert(jackpot);
                    bandit.reset();
                }
            }
        }
    }
}

function pointInCircle(xP, yP, x, y, r) {
    return ((x - xP) * (x - xP) + (y - yP) * (y - yP)) < (r * r);
}

async function getChaps() {
    let n = await g.chaps(book);
    return Array.from({length: n}, (_, i) => i + 1);
}

async function getVerses() {
    let n = await g.count(book, chap);
    return Array.from({length: n}, (_, i) => i + 1);
}

function newChap(value) {
    bandit.chap = new Arm(4 * bandit.w, bandit.y, 2 * bandit.w, bandit.h, value)
}

function newVers(value) {
    bandit.vers = new Arm(7 * bandit.w, bandit.y, 2 * bandit.w, bandit.h, value)
}
