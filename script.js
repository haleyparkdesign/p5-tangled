var Y_AXIS = 1;
var X_AXIS = 2;
var f1, f2, c1, c2;
var stars = [];
var lanterns = [];


var yoff = 0.0; // 2nd dimension of perlin noise

class Star {
    constructor(x, y) {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.radius = Math.random() * 2.5;
    }
}

//first star is planted at 40. Used to number the stars
for (var i = 0; i < 40 * 12; i += 40) {
    for (var j = 0; j < 40 * 12; j += 40) {
        var t = new Star(i, j);
        stars.push(t);
    }
}

function setup() {
    noStroke();

    createCanvas(windowWidth, windowHeight);

    c1 = color('rgba(16, 17, 36, 0.5)');
    c2 = color('rgb(24, 11, 77)');

    f1 = color('rgba(235, 111, 20, 0.62)');
    f2 = color('rgba(255, 227, 163, 0.2)');

    lantern = new Lantern(random(width), -40);
}

function draw() {
    // Background
    setGradient(0, 0, width, height, c1, c2, Y_AXIS);

    noStroke();
    fill(255);
    //draw stars
    for (star of stars) {
        ellipse(star.x, star.y, star.radius, star.radius);
    }

    if (random(1) < 0.1) {
        lanterns.push(new Lantern(random(width), height + 40, random(25,50)));
    }

    for (var i = lanterns.length - 1; i >= 0; i--) {
        lanterns[i].update();
        lanterns[i].show();

        if (lanterns[i].done()) {
            lanterns.splice(i, 1);
        }
    }
}

function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
    if (axis == Y_AXIS) { // Top to bottom gradient
        for (var i = y; i <= y + h; i++) {
            var inter = map(i, y, y + h, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis == X_AXIS) { // Left to right gradient
        for (var i = x; i <= x + w; i++) {
            var inter = map(i, x, x + w, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}

function Lantern(x, y, factor) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.lifespan = height*2;

    this.applyForce = function (force) {
        this.acc.add(force);
    }

    this.update = function () {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan--;
    }

    this.show = function () {
        //halo
        fill(color('rgba(255, 255, 255, 0.01)'));
        ellipse(this.pos.x, this.pos.y + factor / 2, factor * 2, factor * 2);

        //top
        fill(color('rgba(235, 111, 20, 0.9)'));
        ellipse(this.pos.x, this.pos.y, factor, factor / 2);

        setGradient(this.pos.x - factor / 2, this.pos.y, factor - 1, factor, f1, f2, Y_AXIS);
        noStroke();

        // bottom
        fill(color('rgba(244, 177, 85, 0.8)'));
        ellipse(this.pos.x, this.pos.y + factor, factor, factor / 2);

        //flame
        fill(color('rgba(255, 127, 89, 0.3)'));
        ellipse(this.pos.x, this.pos.y + (factor - 9), (factor / 4 * 2), (factor / 8 * 3) + 9);
        fill(color('rgba(255, 227, 189, 0.62)'));
        ellipse(this.pos.x, this.pos.y + (factor - 7), (factor / 8 * 3), (factor / 8 * 3) + 3);
        fill(color('rgba(255, 253, 249, 0.8)'));
        ellipse(this.pos.x, this.pos.y + (factor - 5), (factor / 4), (factor / 8 * 3));
    }

    this.done = function () {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
