// const { checkCells } = require("../../../../entities");

global.Enemy = class Enemy extends Tank {
    constructor (boss = false) {
        super();
        this.id = Math.random().toString(16).substr(2, 8); // generates a random String
        this.isPlayer = false;
        this.isEnemy = true;
        
        let d = 'red';
        let b = 'purple';
        this.skin = [
            [d, b, b, b, d],
            [d, b, b, b, d],
            [b, d, b, d, b],
            [b, b, d, b, b],
            [b, b, d, b, b],
        ];
        // check if chosen position collides with the player
        // let collision;
        // do {
        //     collision = false;
            this.x = random(this.r-60, 900+this.r)+60;
            this.y = [-100, 1000][random(0, 1)];
        //     // for (let i = cells.length; i <= 0; i--) {
        //     //     let cell = cells[i];
        //     //     if (CircularCollision({x: this.x, y: this.y, r: this.r*10}, cell))
        //     //         collision = true;
        //     // }
        //     for (let i in players) {
        //         let player = players[i];
        //         if (CircularCollision({x: this.x, y: this.y, r: this.r*10}, player))
        //             collision = true;
        //     }
        // } while (collision);
        this.className = 'twin';
        this.reloadDelay = 1000; // default
        this.bodyDamage -= 300;
        // this.maxHealth = this.health = this.maxHealth * 3;
        // this.r *= 3;
        // this.guns.map(i => {
        //     i.width *= 3;
        //     i.height *= 3;
        //     i.r *= 3;
        //     // i.y = -this.r / 2;
        //     i.x += i.width / 3;
        //     return i;
        // })
        this.color = 'purple';
        this.x = Math.random() > .5 ? random(-30, 0) : random(600, 630);
        this.y = Math.random() > .5 ? random(-30, 0) : random(600, 630);
        this.x = Math.random() > .5 ? random(0, -30) : random(630, 600);
        this.y = Math.random() > .5 ? random(0, -30) : random(630, 600);

        if (boss) {
            this.color = 'yellow';
            
            let d = 'yellow';
            let b = 'purple';
            this.skin = [
                [d, b, b, b, d],
                [d, b, b, b, d],
                [b, d, b, d, b],
                [b, b, d, b, b],
                [b, b, d, b, b],
            ];
            this.reloadDelay = 700; // default
            this.maxHealth = this.health = this.maxHealth * 3;
            this.r = 20;
            this.bulletSpeed += 3;
            this.bulletDamage += 150;
            // this.spread = [-.3, .3];
            this.guns = [{
                x: 0,
                y: -5,
                r: 10,
                width: 40,
                height: 10,
                angle: 0,
            }]
        }
    }
    get closestPlayer () {
        let distances = [];
        let ids = [];
        for (let i in players) {
            if (players[i].dead) continue;
            let dist = Math.sqrt((this.x-players[i].x)**2 + (this.y-players[i].y)**2);
            distances.push(dist)
            ids.push(players[i].id);
        }
        let closest = Math.min(...distances);
        if (closest > 300) {
            if (this.x == this.defaultX && this.y == this.defaultY) return;
            this.angle = -Math.atan2(this.y - this.defaultY, -(this.x - this.defaultX));
            let vx = Math.cos(this.angle)*1.5;
            let vy = Math.sin(this.angle)*1.5;
            this.x += ~~vx;
            this.y += ~~vy;
            return;
        };
        let index = distances.indexOf(closest);
        let player = players[ids[index]];
        if (!player) return null;
        return player;
    }
    attack () {
        if (!this.cell || this.cell.dead)
            this.cell = this.closestPlayer;
        // attack the castle
        if (!this.cell || this.cell.dead) {
            if (this.x > castle.x-100 && this.x < castle.x+100
                && this.y > castle.y-100 && this.y < castle.y+100)
            {
                this.angle = -Math.atan2(this.y - 450, -(this.x - 450));
                return;
            }
            let x, y;
            if (this.x < castle.x) x = this.x - castle.x - 50;
            else x = this.x - castle.x + 50;

            if (this.y < castle.x) y = this.y - castle.y - 50;
            else y = this.y - castle.y + 50;

            this.angle = -Math.atan2(y, -x);
        }
        // attack the closest player
        else {
            let distanceX = this.x - this.cell.x;
            let distanceY = this.y - this.cell.y;
            if (Math.abs(distanceX) > 150 || Math.abs(distanceY) > 150) {
                if (this.x > castle.x-100 && this.x < castle.x+100
                    && this.y > castle.y-100 && this.y < castle.y+100)
                {
                    this.angle = -Math.atan2(this.y - castle.x, -(this.x - castle.y));
                    return;
                }
                let x, y;
                // visibility of the player is 300px
                // if (this.x < 300) x = this.x - 250;
                // else x = this.x - 350;
                
                // if (this.y < 300) y = this.y - 250;
                // else y = this.y - 350;
                
                if (this.x < castle.x) x = this.x - castle.x - 50;
                else x = this.x - castle.x + 50;

                if (this.y < castle.x) y = this.y - castle.y - 50;
                else y = this.y - castle.y + 50;

                this.angle = -Math.atan2(y, -x);
                // this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
            }
            else this.angle = -Math.atan2(distanceY, -distanceX);
        }
        let vx = Math.cos(this.angle)*1.5;
        let vy = Math.sin(this.angle)*1.5;
        this.x += ~~vx|0;
        this.y += ~~vy|0;
    }
}

window.checkEnemies = function checkEnemies () {
    if (!enemies.length) return;
    for (let j = 0; j < enemies.length; j++) {
        let enemy = enemies[j];
        if (!enemy) continue;
        // if (isNight) {
            Enemy.prototype.attack.call(enemy);
            // enemy.attack();
            // ? fix ↑
            Collision.bulletCollision(enemy, players);
            Collision.bodyCollision(enemy, players);
            if (enemy.health < enemy.maxHealth) {
                regen(enemy);
            }
        // }
        if (enemy.lastShootTime + enemy.reloadDelay < now) {
            enemy.shoot();
            // for (let n = 0, len = enemy.guns.length; n < len; n++) {
            //     let i = enemy.guns;
            //     let angle = enemy.angle + i.angle;
            //     let speedX = Math.cos(angle) * enemy.bulletSpeed + Math.random() - .5;
            //     let speedY = Math.sin(angle) * enemy.bulletSpeed + Math.random() - .5;
            //     enemy.bullets.push({
            //         lifeEnd: now + enemy.bulletLifeTime,
            //         health: enemy.penetration,
            //         speedX: +speedX.toFixed(2),
            //         speedY: +speedY.toFixed(2),
            //         x: +(enemy.x + i.x + speedX*3).toFixed(2),
            //         y: +(enemy.y + i.y + speedY*3).toFixed(2)
            //     });
            // }
            enemy.lastShootTime = now;
        }
        if (enemy.bullets.length) {
            for (let n = 0, len = enemy.bullets.length; n < len; n++) {
                let bullet = enemy.bullets[n];
                if (bullet.aliveUntil < now) {
                    enemy.bullets.splice(n, 1);
                    len--;
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
    }
}