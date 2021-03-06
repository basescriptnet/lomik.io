let z = 57; // ~~ 180 / Math.PI; used in object rotations;
let levelSettings = (() => {
    let arr = [0],
        sc = 10;
    for (let i = 0; i < 45; i++) {
        arr.push(sc);
        sc = ~~(sc * 1.2);
    }
    return arr;
})();

class Tank {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.color = 'dodgerblue';
        this.upgradedNTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.class = 'default';
        this.speed = 2;
        this.bulletSpeed = 5;
        this.dead = false;
        this.maxHealth = 1800;
        this.health = this.maxHealth;
        this.levelSettings = levelSettings;
        this.level = 0;
        this.prevLevelsTotal = 0;
        this.score = 0;
        this.buttons = {
            c: false,
            e: false
        };
        this.guns = [{
            x: 0,
            y: -this.r/2,
            width: 30,
            height: 8,
            angle: 0
        }];
        this.angle = 0;
        this.bodyDamage = 700;
        this.bulletDamage = 300;
        this.penetration = 0;
        this.bulletLifeTime = 1000;
        this.reloadDelay = 500;
        this.canShoot = true;
        this.bullets = [];
        this.spread = [0, 0];
        this.lastShootTime = 0;
        this.isMoving = false;
        this.moveButtons = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.lastDamaged = 0;
        this.regeneration = {
            timer: null,
            started: false,
            waiting: false,
            speed: 2,
            delay: 3000
        };
        this.bulletR = 5;
    }
    moveHandler (obj = this, e) {
        if (!obj.moveButtons) return;

        let isKeydown;
        if (e.type == 'keydown') isKeydown = true;
        else if (e.type == 'keyup') isKeydown = false;

        switch (e.keyCode) {
            case 39:
            case 68:
                obj.moveButtons.right = isKeydown;
                break;
            case 37:
            case 65:
                obj.moveButtons.left = isKeydown;
                break;
            case 38:
            case 87:
                obj.moveButtons.up = isKeydown;
                break;
            case 40:
            case 83:
                obj.moveButtons.down = isKeydown;
                break;
            default:
                return;
        }
        
        obj.isMoving = true;
        
        if (!isKeydown) {
            let isAnyKeyPressed;
            for (let i in obj.moveButtons) {
                if (obj.moveButtons[i] === true) {
                    isAnyKeyPressed = true;
                    break;
                }
            }
            // console.log(isAnyKeyPressed);
            if (!isAnyKeyPressed)
                obj.isMoving = false;
        }
        // ! for server
        // sock.emit('update', {
        //     id: sock.id,
        //     props: [
        //         ['moveButtons', obj.moveButtons],
        //         ['isMoving', obj.isMoving]
        //     ]
        // })
        players[sock.id].isMoving = obj.isMoving;
        players[sock.id].moveButtons = obj.moveButtons;

        // let props = new Map();
        // props.set('isMoving', obj.isMoving);
        // props.set('moveButtons', obj.moveButtons);

        // sock.emit('update', {id: sock.id, props: props});
    }
    changeTank (type = 'default') {
        if (type == 'twin') {
            this.bulletR = 6;
            this.guns = [
                {
                    x: 0,
                    y: -this.r,
                    width: 30,
                    height: 8,
                    angle: 0
                },
                {
                    x: 0,
                    y: 0,
                    width: 30,
                    height: 8,
                    angle: 0
                },
            ]
        }
        else if (type == 'tripleTwin') {
            this.bulletR = 6;
            this.guns = [
                {
                    x: 0,
                    y: -this.r,
                    width: 30,
                    height: 10,
                    angle: 0
                },
                {
                    x: 0,
                    y: 0,
                    width: 30,
                    height: 10,
                    angle: 0
                },
                {
                    x: 0,
                    y: -this.r,
                    width: 30,
                    height: 10,
                    angle: Math.PI+5.3
                },
                {
                    x: 0,
                    y: 0,
                    width: 30,
                    height: 10,
                    angle: Math.PI+5.3
                },
                {
                    x: 0,
                    y: -this.r,
                    width: 30,
                    height: 10,
                    angle: Math.PI-5.3
                },
                {
                    x: 0,
                    y: 0,
                    width: 30,
                    height: 10,
                    angle: Math.PI-5.3
                },
            ]
        }
        else if (type == 'quadTank') {
            this.bulletR = 6;
            this.guns = [
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 0
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 1.55
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: Math.PI
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: -1.55
                }
            ]
        }
        else if (type == 'octoTank') {
            this.bulletR = 6;
            this.guns = [
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: -1.55
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: -1.55*1.5
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: -1.55/2
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 0
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 1.55/2
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 1.55
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: 1.55*1.5
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 30,
                    height: 10,
                    angle: Math.PI
                }
            ]
        }
        else if (type == 'tripleshot') {
            this.bulletR = 7;
            this.guns = [
                {
                    x: 0,
                    y: -this.r+1,
                    width: 20,
                    height: 8,
                    angle: -.5
                },
                {
                    x: 0,
                    y: this.r/2-5,
                    width: 20,
                    height: 8,
                    angle: .5
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 25,
                    height: 8,
                    angle: 0
                },
            ]
        }
        else if (type == 'twinHawk') {
            this.bulletR = 7;
            this.guns = [
                {
                    x: 0,
                    y: -this.r,
                    width: 25,
                    height: 10,
                    angle: Math.PI // 180 deg
                },
                {
                    x: 0,
                    y: 0,
                    width: 25,
                    height: 10,
                    angle: Math.PI // 180 deg
                },
                {
                    x: 0,
                    y: -this.r,
                    width: 25,
                    height: 10,
                    angle: 0
                },
                {
                    x: 0,
                    y: 0,
                    width: 25,
                    height: 10,
                    angle: 0
                },
            ]
        }
        else if (type == 'triple') {
            let h = 6;
            this.guns = [
                {
                    x: 0,
                    y: -h-3,
                    width: 25,
                    height: h,
                    angle: 0
                },
                {
                    x: 0,
                    y: -3,
                    width: 25,
                    height: h,
                    angle: 0
                },
                {
                    x: 0,
                    y: h-3,
                    width: 25,
                    height: h,
                    angle: 0
                },
            ]
        }
        else if (type == 'pentashot') {
            this.bulletR = 7;
            this.guns = [
                {
                    x: 0,
                    y: -this.r+1,
                    width: 20,
                    height: 8,
                    angle: -.35
                },
                {
                    x: 0,
                    y: this.r/2-5,
                    width: 20,
                    height: 8,
                    angle: .35
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 22,
                    height: 8,
                    angle: .2
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 22,
                    height: 8,
                    angle: -.2
                },
                {
                    x: 0,
                    y: -this.r/2,
                    width: 25,
                    height: 8,
                    angle: 0
                },
            ]
        }
    }
    upgrade (obj = this, n) {
        n--;
        if (obj.upgradedNTimes[n] > 6) return false;
        else if (obj.upgradedNTimes[8] <= 0) return false;

        switch (n) {
            case 0:
                obj.regeneration.delay -= 200; 
                obj.regeneration.speed += .04; 
                break;
            case 1:
                obj.maxHealth += 10;
                break;
            case 2:
                obj.bodyDamage += 8;
                obj.maxHealth += 2;
                break;
            case 3:
                obj.bulletSpeed += .5;
                break;
            case 4:
                // obj.penetration += 2;
                // obj.bulletDamage += 2;
                break;
            case 5:
                obj.bulletDamage += .5;
                break;
            case 6:
                obj.reloadDelay -= 50;
                break;
            case 7:
                obj.speed += .3;
                break;
        }

        if (obj.upgradedNTimes[n] !== undefined) {
            obj.upgradedNTimes[n]++;
            obj.upgradedNTimes[8]-=1;
            return true;
        }
    }
    drawUpgrades (obj = this) {
        let available = obj.availableClasses;
        let x = 20;
        let y = 20;
        ctx.save();
        ctx.scale(.8, .8);
        for (let i in available) {
            let j = available[i];
            // ! remove for server
            if (!j) {
                j = new Tank(0, 0);
                classes.call(j, i, j);
            }
            j.x = x+35;
            j.y = y+35;
            ctx.strokeRect(x, y, 70, 70);
            ctx.fillStyle = 'rgba(33, 33, 33, .3)';
            ctx.fillRect(x, y, 70, 70);
            Tank.prototype.draw(j,  true)
            x += 75;
            if (x > 95) {
                x = 20;
                y += 75;
            }
        }
        // console.log(y)
        ctx.restore();
    }
    drawScoreAndUpdates (obj) {
        // score
        let nextLvL = obj.levelSettings[obj.level+1];
        let earnedNow = obj.score - obj.prevLevelsTotal|0;
        // console.log(earnedNow)
        let percent = earnedNow * 100 / nextLvL;
        // if (percent > 100) percent = 100;

        let width = 120;
        let height = 12;
        let text;

        ctx.fillStyle = '#000';
        fillRect(cw/2-width/2, ch - 30, width, height);
        ctx.fillStyle = 'orangered';
        fillRect(cw/2-width/2+1, ch - 28, percent * (width - 4) / 100, height-4);

        ctx.fillStyle = '#fff'
        ctx.font = "10px serif";
        text = `Score: ${obj.score}`;
        fillText(text, cw/2-text.length*2, ch-20.5);

        width = 130;

        ctx.fillStyle = '#000';
        fillRect(cw/2-width/2, ch - 45, width, height);
        ctx.fillStyle = 'dodgerblue';
        fillRect(cw/2-width/2+1, ch - 43,
            (obj.level * 100 / obj.levelSettings.length) * (width - 4) / 100,
            height-4);
        
        ctx.fillStyle = '#fff'
        ctx.font = "10px serif";
        text = `Level: ${obj.level}`;
        fillText(text, cw/2-text.length*2, ch-36.5);
        // score end

        // upgrades
        if (obj.upgradedNTimes[8] <= 0) return;
            
        let x = 20,
            y = ch - 130,
            w = 150,
            h = 10,
            u = obj.upgradedNTimes;
        ctx.fillStyle = '#000';
        save();
        translate(x+w+3, y+5);
        rotate(6);
        ctx.font = '20px sans-serif';
        fillText(`x${u[8]}`, 0, 0);
        restore();
        for (let i in u) {
            if (i == u.length-1) break;
            
            ctx.fillStyle = '#000';
            fillRect(x, y, w, h);
            // upgrade color
            switch (i|0) {
                case 0:
                    ctx.fillStyle = 'rgb(237, 181, 143)';
                    break;
                case 1:
                    ctx.fillStyle = 'rgb(235, 107, 239)';
                    break;
                case 2:
                    ctx.fillStyle = 'rgb(154, 108, 240)';
                    break;
                case 3:
                    ctx.fillStyle = 'rgb(107, 149, 239)';
                    break;
                case 4:
                    ctx.fillStyle = 'rgb(240, 217, 108)';
                    break;
                case 5:
                    ctx.fillStyle = 'rgb(240, 108, 108)';
                    break;
                case 6:
                    ctx.fillStyle = 'rgb(151, 239, 107)';
                    break;
                case 7:
                    ctx.fillStyle = 'rgb(108, 240, 236)';
                    break;
                default:
                    ctx.fillStyle = 'white';
                    break;
            }
            fillRect(x, y+1, (u[i] * 100 / 7) * (w-2) / 100, h-2)
            let mx = x;
            ctx.fillStyle = '#000';
            let mw = w/7;
            for (let j = 0; j < 8; j++) {
                strokeRect(mx, y, mw-1, h-1);
                mx += mw;
            }
            // ctx.fillStyle = 'dodgerblue';
            fillText('+', mx - mw*4/6, y + 8)
            y += 15;
        }
        
    }
    keyHandler (obj = this, e) {
        switch (e.keyCode) {
            case 67:
            case 99:
                obj.buttons.c = !obj.buttons.c;
                // sock.emit('update', {id: sock.id, property: ['buttons', 'c'], value: obj.buttons.c});
                break;
            case 69:
            case 101:
                obj.buttons.e = !obj.buttons.e;
                // sock.emit('update', {id: sock.id, property: ['buttons', 'e'], value: obj.buttons.e});
                break;
            case 75:
            case 107:
                // obj.buttons.e = !obj.buttons.e;
                // sock.emit('score');
                addScore()
                break;
        }
        // [1..8]
        if (e.keyCode >= 49 && e.keyCode < 57) {
            // Tank.prototype.upgrade(obj, e.key|0);
            // sock.emit('upgrade', e.key|0)
            upgrade(e.key|0)
        }
    }
    move (obj = this) {
        let dx = 0, dy = 0;
        let buttons = obj.moveButtons;
        if (buttons.left) dx = -1;
        if (buttons.right) dx = 1;
        if (buttons.up) dy = -1;
        if (buttons.down) dy = 1;
        // are keys opposite
        if (buttons.left && buttons.right) dx = 0;
        if (buttons.up && buttons.down) dy = 0;

        if (dx === 0 && dy === 0) return;

        let valueX = +(obj.x + obj.speed * dx).toFixed(2);
        let valueY = +(obj.y + obj.speed * dy).toFixed(2);
        obj.x = valueX;
        obj.y = valueY;
        let props = new Map();
        props.set('x', valueX);
        props.set('y', valueY);

        if (dx || dy)
            sock.emit('update', {id: sock.id, props: Array.from(props.entries())})
    }
    rotate(obj = this, e) {
        if (obj.buttons && obj.buttons.c) return;
        let directionX = e.clientX - obj.x + scene.camera.x;
        let directionY = e.clientY - obj.y + scene.camera.y;
        let radians = Math.atan2(directionX, -directionY);
        let angle = obj.angle = (radians * z + 270) / z;
        // ! uncomment for socket.io use
        // sock.emit('update', {id: sock.id, property: 'angle', value: angle});
        // ! comment for socket.io use
        players[sock.id].angle = angle;
    }
    draw (obj = this, isFake) {
        let cameraX = scene.camera.x;
        let cameraY = scene.camera.y;
        // console.log(ctx.fillStyle)
        if (isFake) {
            cameraX = 0;
            cameraY = 0;
        }
        let twoPI = 6.3; // ~~2*Math.PI
        ctx.fillStyle = 'red';
        if (!isFake && obj.bullets instanceof Array) {
            for (let i of obj.bullets) {
                beginPath();
                if (i.type == 'attacker') {
                    Geometry.prototype.draw.call(i);
                }
                else
                    ctx.arc(i.x - cameraX, i.y - cameraY, i.r, 0, twoPI, false);
                ctx.lineWidth = 1;
                stroke();
                !performance && fill();
                closePath();
            }
        }
        
        save();
        translate(obj.x - cameraX, obj.y - cameraY);
        !isFake && rotate(obj.angle);
        
        for (let i of obj.guns) {
            if (i.points) {
                let points = i.points;
                beginPath();
                for (let j = 0; j < points.length; j++) {
                    let p = points[j];
                    if (j == 0)
                        moveTo(p[0], p[1]);
                    else 
                        lineTo(p[0], p[1]);
                }
                if (!performance) {
                    ctx.fillStyle = 'grey';
                    fill();
                }
                stroke();
                closePath();
                // continue;
            }
            else {
                save()
                rotate(i.angle);
                let positions = [i.x, i.y, i.width, i.height];
                if (!performance) {
                    ctx.fillStyle = 'grey';
                    fillRect(...positions)
                }
                // ctx.fillStyle = '#000';
                strokeRect(...positions);
                restore();
            }
        }

        // drawing player's circle
        beginPath();
        ctx.arc(0, 0, obj.r, 0, twoPI, false);
        ctx.lineWidth = 3;
        stroke();
        if (!performance) {
            ctx.clip();
            // fill();
            ctx.fillStyle = obj.color;
            let skin = obj.skin;
            let r = obj.r/2;
            translate(-obj.r-2.5, -obj.r-2.5)
            // draw skins
            if (skin) {
                for(let i = 0; i < skin.length; i++) {
                    for(let j = 0; j < skin[i].length; j++) {
                        ctx.fillStyle = skin[i][j];
                        if (!skin[i][j]) continue;
                        fillRect(r * i, r * j, +r.toFixed(1), +r.toFixed(1))
                    }
                }
            }
        }
        closePath();
        restore();
    }
    shoot (obj = this) {
        if (!obj.canShoot) return;
        // ! changed here
        window.Tank.prototype.shoot.call(obj)
        // sock.emit('shoot');
    }
    bodyCollision () {
        for (let i of cells) {
            if (i.dead) return;
            if (RectCircleColliding(this, i)) {
                this.health -= i.bodyDamage;
                if (this.health <= 0)
                    this.dead = true;
                i.health -= this.bodyDamage;
                if (i.health <= 0) {
                    i.dead = true;
                    this.updateScore(i);
                    return;
                }
                let vx, vy;
                if (this.moveButtons.left === true) {
                    vx = -1;
                }
                else if (this.moveButtons.right === true) {
                    vx = 1;
                }
                if (this.moveButtons.up === true) {
                    vy = -1;
                }
                else if (this.moveButtons.down === true) {
                    vy = 1;
                }
                i.vx = 5 * vx|0;
                i.vy = 5 * vy|0;
                i.x += i.vx;
                i.y += i.vy;
            }
        }
    }
    bulletCollision () {
        for (let j of this.bullets) {
            for (let i of cells) {
                if (i.dead) return;
                if (RectCircleColliding(j, i)) {
                    j.health -= i.bodyDamage + i.penetration;
                    if (j.health <= 0) {
                        this.bullets.splice(this.bullets.indexOf(j), 1);
                    }
                    i.health -= this.bulletDamage;
                    if (i.health <= 0) {
                        i.dead = true;
                        setTimeout(() => {
                            let type = Math.random() > .5 ? 'square' : 'triangle';
                            cells.push(new Geometry(type));
                        }, 1000);
                        this.updateScore(i);
                        return;
                    }
                    let vx, vy;
                    if (j.speedX < 0) {
                        vx = -1;
                    }
                    else if (j.speedX > 0) {
                        vx = 1;
                    }
                    if (j.speedY < 0) {
                        vy = -1;
                    }
                    else if (j.speedY > 0) {
                        vy = 1;
                    }
                    i.vx = 2 * vx|0;
                    i.vy = 2 * vy|0;
                    i.x += i.vx;
                    i.y += i.vy;
                }
            }
        }
    }
}