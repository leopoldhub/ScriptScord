var a1 = document.createElement("canvas");
a1.width = 480;
a1.height = 320;
getMessage().appendChild(a1);
var ctx = a1.getContext("2d");
var x = a1.width / 2;
var y = a1.height - 30;
var dx = 2;
var dy = -2;
var p1 = (a1.width - 75) / 2;
var rp = false;
var lp = false;
var brc = 5;
var bcc = 3;
var sc1 = 0;
var lv1 = 3;
var bks = [];
for (var c = 0; c < bcc; c++) {
    bks[c] = [];
    for (var r = 0; r < brc; r++) {
        bks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}
document.addEventListener("keydown", kDH, false);
document.addEventListener("keyup", kUH, false);
document.addEventListener("mousemove", mMH, false);

function kDH(e) {
    if (e.code == "ArrowRight") {
        rp = true;
    } else if (e.code == 'ArrowLeft') {
        lp = true;
    }
}

function kUH(e) {
    if (e.code == 'ArrowRight') {
        rp = false;
    } else if (e.code == 'ArrowLeft') {
        lp = false;
    }
}

function mMH(e) {
    var relativeX = e.clientX - a1.offsetLeft;
    if (relativeX > 0 && relativeX < a1.width) {
        p1 = relativeX - 75 / 2;
    }
}

function cD() {
    for (var c = 0; c < bcc; c++) {
        for (var r = 0; r < brc; r++) {
            var b = bks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + 75 && y > b.y && y < b.y + 20) {
                    dy = -dy;
                    b.status = 0;
                    sc1++;
                    if (sc1 == brc * bcc) {
                        alert("YOU WIN, CONGRATS!");
                        getMessage().removeChild(a1);
                    }
                }
            }
        }
    }
}

function dB() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function dP() {
    ctx.beginPath();
    ctx.rect(p1, a1.height - 10, 75, 10);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawbks() {
    for (var c = 0; c < bcc; c++) {
        for (var r = 0; r < brc; r++) {
            if (bks[c][r].status == 1) {
                var brickX = (r * (75 + 10)) + 30;
                var brickY = (c * (20 + 10)) + 30;
                bks[c][r].x = brickX;
                bks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, 75, 20);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawsc1() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("score: " + sc1, 8, 20);
}

function drawlv1() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("lives: " + lv1, a1.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, a1.width, a1.height);
    ctx.rect(0, 0, a1.width, a1.height);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    drawbks();
    dB();
    dP();
    drawsc1();
    drawlv1();
    cD();
    if (x + dx > a1.width - 10 || x + dx < 10) {
        dx = -dx;
    }
    if (y + dy < 10) {
        dy = -dy;
    } else if (y + dy > a1.height - 10) {
        if (x > p1 && x < p1 + 75) {
            dy = -dy;
        } else {
            lv1--;
            if (!lv1) {
                alert("GAME OVER");
                getMessage().removeChild(a1);
            } else {
                x = a1.width / 2;
                y = a1.height - 30;
                dx = 2;
                dy = -2;
                p1 = (a1.width - 75) / 2;
            }
        }
    }
    if (rp && p1 < a1.width - 75) {
        p1 += 7;
    } else if (lp && p1 > 0) {
        p1 -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}
draw();
