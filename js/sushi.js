// ========== SUSHI GAME ===========
var dragCount = 0;
var ingredientArray = [];
var rollMat = document.getElementById("rollMat");
rollMat.style.visibility = "hidden";
var ins = document.getElementById("instructions");

function onDragStart(event) {
    // console.log("event.target.id: " + event.target.id);
    // event.dataTransfer.setData("text/plain", event.target.id);
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("text/plain", str);
}
  
function allowDrop(event) {
    event.preventDefault();
}
  
function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    // console.log(offset[2]);
    dragCount += 1;
    ingredientArray.push(`${offset[2]}`);
    
    // console.log(dragCount);
    if (dragCount == 6) {
        var roll = document.createElement("button");
        roll.setAttribute("id", "rollBtn");
        roll.innerHTML = "LET'S ROLL";
        roll.setAttribute("style", "margin-right: 10px;")
        document.getElementById("textSpace").appendChild(roll);
        enableRollBtn();
    }
    event.preventDefault();
    return false;
}

function enableRollBtn() {
    var seaweed = document.getElementById("seaweed");
    var rollBtn = document.getElementById("rollBtn");

    rollBtn.addEventListener("click", function() {
        console.log(seaweed.style.height);

        if (seaweed.style.height == "200px") {
            alert("You've already rolled the sushi~")
        } else {
            var bambooMat = document.getElementById("bambooMat");
            bambooMat.animate({
                height: "250px"
            }, 3200, "easeInOut", setTimeout(function () {
                bambooMat.setAttribute("style", "width: 800px;");
                ins.innerHTML = "Now it's time to slice the sushi. Draw on top of the sushi roll until you're satisfied~";
            }, 3200));

            // console.log("clicked");
            rollMat.setAttribute('style', 'height: 600px; z-index: 20;');
            rollMat.style.visibility = "visible";
            ingredientArray.forEach(element => document.getElementById(element).style.visibility = 'hidden');
            rollMat.animate({
                transform: 'translateY(-350px)'
            }, 3200, "easeInOut", setTimeout(function () {
                console.log("done");
                rollMat.style.visibility = "hidden";
                createCanvas();
            }, 3200));
        
            seaweed.animate({
                height: "200px"
            }, 3200, setTimeout(function () {
                console.log("done");
                seaweed.setAttribute("style", "margin-left: 25px; margin-top: 80px; height: 200px; width: 750px;");
            }, 3200));
        }
    });
}

function createCanvas() {
    // create canvas element and append it to document body
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "margin-left: 25px; margin-bottom: 800px;")
    canvas.style.position = 'fixed';
    // canvas.style.backgroundColor = "blue";
    var sliceCount = 0;

    // get canvas 2D context and set him correct size
    var ctx = canvas.getContext('2d');
    resize();

    // last known position
    var pos = { x: 0, y: 0 };

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseenter', setPosition);

    // new position from mouse event
    function setPosition(e) {
        pos.x = e.clientX - 15;
        pos.y = e.clientY - 64;
    }

    // resize canvas
    function resize() {
        ctx.canvas.width = 750;
        ctx.canvas.height = 250;
    }

    function draw(e) {
        if (e.buttons !== 1) return;
        ctx.beginPath(); // begin
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'white';
        ctx.moveTo(pos.x - 15, pos.y - 64); // from
        setPosition(e);
        ctx.lineTo(pos.x - 15, pos.y - 64); // to
        ctx.stroke(); // draw it!

        sliceCount += 1;
        if (sliceCount == 1) {
            createServeBtn();
        }
    }

    function createServeBtn() {
        var serve = document.createElement("button");
        serve.setAttribute("id", "serveBtn");
        serve.innerHTML = "LET'S SERVE";
        document.getElementById("textSpace").appendChild(serve);
        enableServeBtn();
    }
}


function enableServeBtn() {
    var serveBtn = document.getElementById("serveBtn");
    serveBtn.addEventListener("click", function() {
        var canvas = document.getElementById("canvas");
        var bambooMat = document.getElementById("bambooMat");
        var seaweed = document.getElementById("seaweed");
        fade([canvas, bambooMat, seaweed]);
        ins.innerHTML = "いただきます!! Enjoy your sushi~ Hope you enjoyed this sushi-making game. See you next time!";
        var doneSushi = document.getElementById("doneSushi");
        doneSushi.style.display = "inline";
        fadeIn(doneSushi, 1500);
    });
}


function fade(elementArray) {
    elementArray.forEach(element => {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 30);
    });
}

function fadeIn(el, time) {
  el.style.opacity = 0;
  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    last = +new Date();
    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };
  tick();
}

// ======= END OF SUSHI GAME ========
