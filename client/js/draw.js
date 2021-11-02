const canvas = document.getElementById`canvas`,
    ctx = canvas.getContext`2d`,
    now = () => Date.now();

const [
    lineTo,
    moveTo,
    beginPath,
    closePath,
    restore,
    save,
    translate,
    stroke,
    fill,
    fillRect,
    strokeRect,
    rotate,
    fillText
] = [
    ctx.lineTo,
    ctx.moveTo,
    ctx.beginPath,
    ctx.closePath,
    ctx.restore,
    ctx.save,
    ctx.translate,
    ctx.stroke,
    ctx.fill,
    ctx.fillRect,
    ctx.strokeRect,
    ctx.rotate,
    ctx.fillText
].map(i => i.bind(ctx));

let cw, ch, player;
let random = (min, max) => ~~(Math.random() * (max - min) + min);
let second_1 = Date.now(),
    second_2 = Date.now();
canvas.focus();

function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 + w1 > x2
        && x1 < x2 + w2
        && y1 + h1 > h2
        && y1 < y2 + h2);
}

// return true if the rectangle and circle are colliding
function RectCircleColliding(circle, rect){
    let distX = Math.abs(circle.x - rect.x);
    let distY = Math.abs(circle.y - rect.y);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2) && distY <= (rect.h/2)) { return true; }

    let dx = distX;
    let dy = distY;
    return (dx**2 + dy**2 <= circle.r**2);
}

function CircularCollision(circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.r + circle2.r) {
        return true;
    }
}

class Scene {
    constructor() {
        this.w = 900;
        this.h = 900;
        canvas.width = 600;
        canvas.height = 600;
        cw = canvas.width;
        ch = canvas.height;
        let cwHalf = cw/2;
        let chHalf = ch/2;

        this.minimap = {
            x: cw - cw/6,
            y: ch - ch/6,
            width: cw/6,
            height: ch/6,
            color: 'rgba(33, 33, 33, .3)'
        };
        this.camera = {
            get x () {
                if (!player) return 0;
                return -(cwHalf - player.x)
            },
            get y () {
                if (!player) return 0;
                return -(chHalf - player.y);
            }
        }
    }
    clear () {
        ctx.clearRect(0, 0, this.w, this.h);
    }
    drawMiniMap (x, y) {
        ctx.fillStyle = this.minimap.color;
        fillRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);
        strokeRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);
        ctx.fillStyle = '#000';
        beginPath();
        ctx.arc(this.minimap.x +x/6, this.minimap.y + y/6, 2, 2 * Math.PI, false);
        fill();
        closePath();
    }
}

class Geometry {
    constructor (type) {
        this.w = 15;
        this.h = 15;
        this.r = 7.5;
        this.x = random(this.w, cw-this.w),
        this.y = random(this.h, ch-this.h);
        if (type == 'square') {
            this.maxHealth = 4;
            this.bodyDamage = 1;
        }
        else if (type == 'triangle') {
            this.maxHealth = 13;
            this.bodyDamage = 1.5;
        }
        this.health = this.maxHealth;
        this.regeneration = {
            started: false,
            speed: .02,
            delay: 3000
        }
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.direction = random(0, 1) > .5 ? 1 : -1;
        this.angle = random(0, 360);
        this.dead = false;
        this.scale = 1;
    }
    die (obj = this) {
        cells.splice(cells.indexOf(obj), 1);
    }
    draw (obj = this, scale = false) {
        obj.x += obj.vx;
        obj.y += obj.vy;
        if (obj.vx > 0) obj.vx-=.2;
        else if (obj.vx < 0) obj.vx += .2;
        if (obj.vy > 0) obj.vy-=.2;
        else if (obj.vy < 0) obj.vy += .2;
        save();
        translate(-scene.camera.x+obj.x, -scene.camera.y+obj.y);
        rotate(obj.angle);
        if (scale) {
            ctx.scale(obj.scale, obj.scale);
        }
        if (obj.type == 'square') {
            beginPath();
            lineTo(-obj.r,obj.r);
            lineTo(obj.r,obj.r);
            lineTo(obj.r,-obj.r);
            lineTo(-obj.r,-obj.r);
            ctx.fillStyle = 'rgb(255, 232, 105)';
            fill();
            closePath();
        }
        else if (obj.type == 'triangle') {
            beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'red';
            moveTo(-obj.r, -obj.r);
            lineTo(obj.r*2, -obj.r);
            lineTo(obj.r-4, obj.r*2-2);
            lineTo(-obj.r, -obj.r);
            fill();
            // ctx.fillStyle = '#000';
            closePath();
        }
        else if (obj.type == 'pentagon') {
            beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'rgb(118, 141, 252)';
            let a = Math.PI * 2/5;
            moveTo(obj.r*2, 0);
            for (let i = 1; i < 5; i++) {
                lineTo(obj.r*2 * Math.cos(a*i), obj.r*2 * Math.sin(a*i));
            }
            lineTo(obj.r*2, 0)
            // lineTo(-obj.w/2, -obj.h/2);
            fill();
            ctx.fillStyle = '#000';
            closePath();
        }
        else if (obj.type == 'hexagon') {
            let n = 2/3.5;
            beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = '#000';
            let a = Math.PI * 2/5;
            moveTo(0, -obj.r-2);
            lineTo(obj.r, -obj.r*n);
            lineTo(obj.r, obj.r*n);
            lineTo(0, obj.r+2);
            lineTo(-obj.r, obj.r*n);
            lineTo(-obj.r, -obj.r*n);
            lineTo(0, -obj.r-2);
            // let a = 100,
            //     x = 100,
            //     y = 0;
            // ctx.moveTo(x, y);
            // ctx.lineTo(obj.w * Math.sqrt(3) / 2, y - obj.w / 2);
            // ctx.lineTo(obj.w * Math.sqrt(3), y);
            // ctx.lineTo(obj.w * Math.sqrt(3), y + obj.w);
            // ctx.lineTo(obj.w * Math.sqrt(3) / 2, y + obj.w / 2 + obj.w);
            // ctx.lineTo(x, y + obj.w);
            // ctx.lineTo(x, y)
            // ctx.lineWidth = 3;
            // ctx.stroke()
            fill();
            ctx.fillStyle = '#000';
            closePath();
        }
        else if (obj.type == 'attacker') {
            beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'rgb(252, 118, 119)';
            moveTo(-obj.r, -obj.r);
            lineTo(obj.r*2, obj.r-2);
            lineTo(-obj.r, obj.r*2);
            lineTo(-obj.r, -obj.r);
            fill();
            ctx.fillStyle = '#000';
            closePath();
        }
        if (!scale)
            stroke();
        restore();
        // obj.drawHealth();
        obj.angle += .01 * obj.direction;
        if (obj.angle >= 360) obj.angle = 0; 
    }
}

function drawHealth(obj) {
    if (obj.dead) return;
    let x = obj.x,
        y = obj.y,
        w = obj.side || obj.r*2,
        h = obj.side || obj.r*2;
    
    let width, wholeWidth = w+8;
    if (obj.maxHealth != obj.health) {
        let percent = obj.health * 100 / obj.maxHealth;
        width = wholeWidth * percent / 100;
    }
    else {
        width = wholeWidth;
        return;
    }
    beginPath();
    ctx.fillStyle = '#000';
    fillRect(x-w/2-5 - scene.camera.x, y + h+3 - scene.camera.y, w+10, 5);
    ctx.fillStyle = 'lime';
    fillRect(x-w/2-4 - scene.camera.x, y + h+4 - scene.camera.y, width, 3);
    closePath();
}

const scene = new Scene();
// let cells = [];

let draw = Tank.prototype.draw;
let shoot = Tank.prototype.shoot;

function drawCastle() {
    let {x, y, side} = castle;
    let halfSide = side/2;
    beginPath();
    save();
    translate(-halfSide-scene.camera.x, -halfSide-scene.camera.y);
    lineTo(x , y - halfSide);
    lineTo(x + side/4, y);
    lineTo(x + side*2/4, y - halfSide);
    lineTo(x + side*3/4, y);
    lineTo(x + side, y - halfSide);
    lineTo(x + side ,y);
    lineTo(x + side ,y + side);
    lineTo(x, y + side);
    lineTo(x, y);
    // lineTo(x + side,y);
    ctx.strokeStyle = "purpule";
    ctx.fillStyle = '#000';
    fill();
    // stroke();
    closePath();
    restore();
    // if (castle.health < castle.maxHealth) {
        // drawHealth(castle);
    // }
}

let paused = false;

function gameOver() {
    let cwHalf = cw/2;
    let chHalf = ch/2;
    beginPath();
    ctx.fillStyle = 'tomato';
    ctx.font = "80px Arial";
    fillText("Game Over", cwHalf - cw/3 , chHalf);
    ctx.font = "68px Arial";
    fillText("You are top FILTER", 0 , chHalf+90);
    ctx.font = "50px Arial";
    fillText(`Your record is ${~~((castle.lastedUntil - castle.aliveFrom)/1000)} seconds`, 0 , chHalf +180);
    ctx.font = '40px Verdana';
    fillText(`New game starts in ${seconds} seconds`, 0 , chHalf +230);
}

function game () {
    if (paused) return;
    if (!players) return;
    player = players[sock.id];
    scene.clear();
    ctx.fillStyle = `rgba(33, 33, 33, ${opacity})`;
    fillRect(0, 0, cw, ch);
    drawHealth(castle);
    drawCastle();
    
    if (player.dead && !castle.dead) {
        ctx.fillStyle = 'tomato';
        ctx.font = '40px Verdana';
        fillText(`Respawn in ${~~((seconds - now())/1000)} seconds`, 0 , ch/2 +230);
    }
    for (let i in players) {
        // avoiding of name conflicts
        let playerN = players[i];
        // if (playerN.x + 400 > player.x || playerN.x - 400 > player.x
        //     || playerN.y + 400 > player.y || playerN.y - 400 > player.y
        // ) continue;
        if (playerN.dead) {
            continue;
        } else {
            drawHealth(playerN);
            draw(playerN);
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        // if (enemy.x + 400 > player.x || enemy.x - 400 > player.x
        //     || enemy.y + 400 > player.y || enemy.y - 400 > player.y
        // ) continue;
        drawHealth(enemy);
        draw(enemy);
    }
    ctx.fillStyle = '#000';
    ctx.font = "40px serif";
    fillText("   Lomik.io   ", 200, 40);

    for (let i of cells) {
        // if (!(i.x + 400 > player.x || i.x - 400 > player.x
        //     || i.y + 400 > player.y || i.y - 400 > player.y
        // )) continue;
        if (i.dead) {
            Geometry.prototype.draw(i, true);
            continue;
        }
        drawHealth(i);
        Geometry.prototype.draw(i);
    }

    if (isNight) { //night
        ctx.fillStyle = 'rgba(33, 33, 33, .7)';
        fillRect(0, 0, 600, 600);
    }
    // if (!player) return;
    if (castle.dead) { // Game over
        // second_2 = Date.now();
        gameOver();
        // clearAnimationFrame(game);
    }
    else {
        if (mousedown
            || player.buttons.e
        ) shoot(player);
        Tank.prototype.drawUpgrades(player);
        Tank.prototype.drawScoreAndUpdates(player);
    }
    scene.drawMiniMap(player.x, player.y);

    requestAnimationFrame(game);
}