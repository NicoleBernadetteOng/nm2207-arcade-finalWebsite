// ========== SPACE WARS GAME ===========
let paper = new Raphael(document.getElementById("spaceGame"));

var dieSound = new Audio ("resources/die.wav");

// Find get paper dimensions
let dimX = paper.width;
let dimY = paper.height;

// Just create a nice black background
var bgRect = paper.rect(0,0,dimX, dimY);
bgRect.attr({"fill": "black"});


// variables for controlling frame rate and speed of animated object
let frameLength = 20; // in ms, used for the interval at which we call the draw() function
let time = 0;      // time since the page was loaded into the browser; incremented in draw()
var kills = 0;

//===================================

let distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
}
// when the distance = 0, that's when you know a collision happened 

var shooterPt = { x: dimX/2, y: dimY + 50};

let shooter = paper.circle(shooterPt.x, shooterPt.y - 50, 35).attr({
    "fill" : "green"
});

let bullet = paper.circle(shooterPt.x, shooterPt.y, 20).attr({
    "fill" : "orange"
});
// original
bullet.posx = shooter.attrs.cx;
bullet.posy = shooter.attrs.cy + 50;
bullet.xrate = 0;
bullet.yrate = 0;
// bullet.shot = false;

bgRect.node.addEventListener("mousemove", function(event) {
    shooter.animate({
        "cx" : event.offsetX
    }, 0, "linear");

    // if bullet not shot
    bullet.animate({
         "cx" : event.offsetX
    }, 0, "linear");
});

// new enemy circle 
function rand(min, max) {
    return min + Math.random() * (max - min);
}

function getRandomColor() {
    var h = rand(1, 360);
    var s = rand(100, 100);
    var l = rand(50, 100);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function reload() {
    bullet.shot = false;
}


// to make the bullet move
// once it shoots, the bullet is no longer influenced by mouse activities 
function shoot() {
    bullet.posx = shooter.attrs.cx;
    bullet.posy = shooter.attrs.cy;
    bullet.yrate = -20;
}

shooter.node.addEventListener("click", function(ev) {
    console.log("shoot!");
    shoot();
})

// Explosion code
var numOfDisks = 0;
var diskArr = [];
function explode(explodeX, explodeY) {
    while (numOfDisks < 40) {
        // A disk for us to play with
        var anotherDisk = paper.circle(dimX/2, dimY/2, 7);
        anotherDisk.attr({"fill": getRandomColor()});
        anotherDisk.origCol = anotherDisk.attrs.fill;

        // anotherDisk.xpos = dot.attrs.cx;
        // anotherDisk.ypos = dot.attrs.cy;
        anotherDisk.xpos = explodeX;
        anotherDisk.ypos = explodeY;

        // Add properties to keep track of the rate the disk is moving
        anotherDisk.xrate = Math.random()*(5-(-5)+1)+(-5);
        anotherDisk.yrate = Math.random()*(5-(-5)+1)+(-5);

        diskArr.push(anotherDisk);
        numOfDisks++;
    }
}

 
// returns true if overlap, false otherwise
// when the shapes collide, both shapes will be destroyes - game over 
function circleBump(c1, c2) {
    let d = distance({"x": c1.attr("cx"), 
            "y": c1.attr("cy")},
            {"x" : c2.attr("cx"),
            "y" : c2.attr("cy")})
    if (d < (c1.attr("r") + c2.attr("r"))) {
        return true;
    } else {
        return false;
    }
}


// Run newShip() to keep generating enemy circles 
var ships = [];
function newShip() {
    var newDot = paper.circle(rand(0, dimX), 0, 30);
    newDot.posx = newDot.attrs.cx;
    newDot.posy = newDot.attrs.cy;
    newDot.xrate = rand(1, 4);  
    newDot.yrate = rand(1, 4);  
    newDot.type = "bullet"; 

    newDot.attr({
        "fill" : "red"       
    });

    ships.push(newDot);
}
setInterval(newShip, 1500);


// function that does the animation, called at the framerate 
let draw = function() {
    var killCount = document.getElementById("killCount");
    killCount.innerHTML="Kills: " + kills;

    // bullet.posx += bullet.xrate;
    bullet.posy += bullet.yrate;
    bullet.attr({
        // "cx" : bullet.posx,
        "cy" : bullet.posy
    })

    for (i = 0; i < ships.length; i++) {
        ships[i].posy += ships[i].yrate;
        ships[i].attr({
            "cy": ships[i].posy
        });

        var thisDot = ships[i];

        // Enemy collides with bullet
        if (circleBump(thisDot, bullet)) {
            var shotSound = new Audio ("resources/shot.wav");
            shotSound.play();
            thisDot.remove();
            kills++;
        } 

        // Enemy collides with shooter
        if (circleBump(thisDot, shooter)) {
            dieSound.play();
            explode(thisDot.attrs.cx, thisDot.attrs.cy);
            for (i = 0; i < diskArr.length; i++) {
                diskArr[i].xpos += diskArr[i].xrate;
                diskArr[i].ypos += diskArr[i].yrate;

                // Now actually move the disk using our 'state' variables
                diskArr[i].attr({'cx': diskArr[i].xpos, 'cy': diskArr[i].ypos});   
            }

            shooter.attr({
                "fill-opacity": "0",
                "stroke-width": "0"
            })

            // invisible rect over the black one so cannot click to shoot anymore
            var newRect = paper.rect(0,0,dimX,dimY);
            newRect.attr({"fill": "rgba(255, 255, 255, 0)"});
            // game over text 
            paper.text(dimX/2, dimY/2, "GAME OVER").attr({
                "fill": "white",
                "font-size": "50px"
            });

            document.getElementById("nameText").style.visibility = "visible";
            document.getElementById("saveBtn").style.visibility = "visible";
        } 
    }

}

// start the animation
setInterval(draw, frameLength);

// ======= END OF SPACE WARS GAME ========
