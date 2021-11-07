// const { updateLevel } = require("./updater/helper");

window.levelSettings = (() => {
    let arr = [0],
        sc = 5;
    for (let i = 0; i < 45; i++) {
        arr.push(sc);
        sc = Math.ceil(sc * 1.2);
    }
    return arr;
})();
window.Tank = class Tank {
    constructor(id, score = 0) {
        // place the player in the center
        this.r = 10;
        this.x = random(castle.x - 50 + this.r, castle.x + 50 - this.r);
        this.y = random(castle.y - 50 + this.r, castle.y + 50 - this.r);
        this.isPlayer = true;
        this.id = id;
        this.className = 'default';
        this.color = 'dodgerblue';
        this.upgradedNTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.classPath = [];
        this.availableClasses = {};
        this.speed = 2;
        this.bulletSpeed = 5;
        this.spread = [-.5, .5];
        this.dead = false;
        this.maxHealth = 1800;
        this.health = this.maxHealth;
        this.levelSettings = levelSettings;
        this.level = 0;
        this.score = score|0;
        this.buttons = {
            c: false,
            e: false
        };
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            r: 5,
            width: 30,
            height: 8,
            angle: 0
        }];
        // randomator
        // this.guns = (() => {
        //     let arr = []
        //     for (let i = 0; i < 360; i+=10) {
        //         arr.push({
        //             x: 0,
        //             y: -this.r/2,
        //             width: 30,
        //             height: 8,
        //             angle: ~~(Math.random() * (360 - 0) + 0)
        //         })
        //     }
        //     return arr;
        // })();
        this.angle = 0;
        this.bodyDamage = 700;
        this.bulletDamage = 300;
        this.penetration = 0;
        this.bulletLifeTime = 1000;
        this.reloadDelay = 500;
        this.canShoot = true;
        this.bullets = [];
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
        updateScore(this);
        updateLevel(this);
    }
    get prevLevelsTotal () {
        let sum = 0;
        let levels = this.levelSettings;
        for (let i in levels) {
            sum += levels[i];
            if (this.score < sum) {
                this.upgradedNTimes[8] += i -1 - this.level;
                this._prevLevelsTotal = sum - levels[i];
                this.level = this.levelSettings.indexOf(levels[i-1]);
                // this.r = 10 + this.level/20;
                return this._prevLevelsTotal;
            }
        }
        return sum;
    }
    set prevLevelsTotal (value) {
        return this._prevLevelsTotal = value;
    }
    upgrade(obj = this, n) {
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
                obj.penetration += 50;
                // obj.bulletDamage += 2;
                break;
            case 5:
                obj.bulletDamage += 50;
                break;
            case 6:
                obj.reloadDelay -= 35;
                break;
            case 7:
                obj.speed += .2;
                break;
        }

        if (obj.upgradedNTimes[n] !== undefined) {
            obj.upgradedNTimes[n]++;
            obj.upgradedNTimes[8]--;
            return true;
        }
    }
    shoot () {
        // if (this.lastShootTime + this.reloadDelay < now) {
        //     this.canShoot = true;
        // }
        // if (!this.canShoot) {
        //     return
        // };
        this.lastShootTime = now;
        let guns = this.guns;
        let bulletSpeed = this.bulletSpeed;
        let spread = this.spread;
        let tankAngle = this.angle;
// debugger
        for (let j = 0, len = guns.length; j < len; j++) {
            let gun = guns[j];
            let angle = tankAngle + gun.angle;
            // let speedX = ~~(Math.cos(angle) * bulletSpeed + random(spread[0], spread[1]));
            // let speedY = ~~(Math.sin(angle) * bulletSpeed + random(spread[0], spread[1]));
            // get the unit vector of the rotated x axis. Along player forward
            let xAx = Math.cos(angle);
            let xAy = Math.sin(angle);
            let speedX = ~~(xAx * bulletSpeed + random(spread[0], spread[1]));
            let speedY = ~~(xAy * bulletSpeed + random(spread[0], spread[1]));
            this.bullets.push({
                aliveUntil: now + this.bulletLifeTime,
                health: this.penetration,
                speedX, speedY,
                x: ~~((gun.x + gun.r/2) * xAx - (gun.y + gun.r/2) * xAy + this.x) + speedX*3,// - gunX / 2 + speedX*3),
                y: ~~((gun.x + gun.r/2) * xAy + (gun.y + gun.r/2) * xAx + this.y) + speedY*3,
                r: gun.r
            });
        }
        this.canShoot = false;
        // this.x -= Math.cos(this.angle)/.3;
        // this.y -= Math.sin(this.angle)/.3;
        this.x -= Math.cos(this.angle)*2;
        this.y -= Math.sin(this.angle)*2;
        setTimeout(() => this.canShoot = true, this.reloadDelay);
    }
    get simplify() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            r: this.r,
            className: this.className,
            classPath: this.classPath,
            canShoot: this.canShoot,
            guns: this.guns,
            bullets: this.bullets,
            moveButtons: this.moveButtons,
            buttons: this.buttons,
            upgradedNTimes: this.upgradedNTimes,
            color: this.color,
            dead: this.dead,
            maxHealth: this.maxHealth,
            health: this.health,
            levelSettings: this.levelSettings,
            level: this.level,
            prevLevelsTotal: this.prevLevelsTotal,
            score: this.score,
            angle: this.angle,
            bulletR: this.bulletR,
            availableClasses: this.availableClasses
        }
    }
}