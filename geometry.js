module.exports = class Geometry {
    constructor (type) {
        this.r = 7.5;
        let collision;
        // // checks if the chosen position is collapsed with a player, if yes, choses another position
        do {
            collision = false;
            this.x = random(this.r, 900-this.r);
            this.y = random(this.r, 900-this.r);
            for (let i in players) {
                let player = players[i];
                if (CircularCollision({x: this.x, y: this.y, r: this.r*10}, player)) {
                    collision = true;
                    break;
                }
            }
            if (CircularCollision({x: this.x, y: this.y, r: this.r*10}, {x: castle.x, y: castle.y, r: castle.side+200})) 
                collision = true;
        } while (collision);

        switch (type) {
            case 'square':
                // this.x = random(this.r, 600-this.r);
                // this.y = random(this.r, 600-this.r);
                this.maxHealth = 400;
                this.bodyDamage = 100;
                break;
            case 'triangle':
                // this.x = random(this.r, 600-this.r);
                // this.y = random(this.r, 600-this.r);
                this.maxHealth = 1300;
                this.bodyDamage = 150;
                break;
            case 'attacker':
                this.r = 4;
                this.x = Math.random(1) < 0.5 ? 600+50 : -50;
                this.y = Math.random(1) < 0.5 ? 600+50 : -50;
                this.defaultX = this.x;
                this.defaultY = this.y;
                this.maxHealth = 1300;
                this.bodyDamage = 150;
                break;
            case 'hexagon':
                this.r = 20;
                this.x = random(this.r+600/2-150, 600/2+150-this.r);
                this.y = random(this.r+600/2-150, 600/2+150-this.r);
                this.maxHealth = 3800;
                this.bodyDamage = 550;
                break;
            case 'pentagon':
                this.r = 10;
                this.x = random(this.r+600/2-150, 600/2+150-this.r);
                this.y = random(this.r+600/2-150, 600/2+150-this.r);
                this.maxHealth = 6500;
                this.bodyDamage = 800;
                break;
            case 'heptagon':
                this.r = 18;
                this.x = random(this.r+600/2-150, 600/2+150-this.r);
                this.y = random(this.r+600/2-150, 600/2+150-this.r);
                this.maxHealth = 2500;
                this.bodyDamage = 600;
                break;
            default:
                break;
        }
        this.cell = null;
        this.health = this.maxHealth;
        this.lastDamaged = 0;
        this.regeneration = {
            speed: 2,
            delay: 3000,
        }
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.direction = Math.random() > .5 ? 1 : -1;
        this.angle = random(0, 360);
        this.dead = false;
        this.scale = 1;
    }
    recalculate () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= 900) this.x = 900;
        if (this.y <= 0) this.y = 0;
        else if (this.y >= 900) this.y = 900;

        if (this.vx > 0) this.vx-=.2;
        else if (this.vx < 0) this.vx += .2;
        if (this.vy > 0) this.vy-=.2;
        else if (this.vy < 0) this.vy += .2;
        this.angle += .01 * this.direction;
        if (this.angle >= 360) this.angle = 0; 
    }
    attack (destination = players) {
        // if (destination && destination[0] && !destination[0].isPlayer) debugger
        let distances = [];
        let ids = [];
        // let index = -1;
        for (let i in destination) {
            // index++;
            if (destination[i].dead) continue;
            let dist = Math.sqrt((this.x-destination[i].x)**2 + (this.y-destination[i].y)**2);
            distances.push(dist);
            ids.push(destination[i].id);
        }
        let closest = Math.min(...distances);
        // if (closest > 300) {
            // if (this.x == this.defaultX && this.y == this.defaultY) {
            //     this.angle = -Math.atan2(this.y - this.defaultY, -(this.x - this.defaultX));
            //     let vx = Math.cos(this.angle)*1.5;
            //     let vy = Math.sin(this.angle)*1.5;
            //     this.x += vx;
            //     this.y += vy;
            // }
            // return;
        // };
        let index = distances.indexOf(closest);
        let player = destination[ids[index]] || destination[index]; // 1. for players, 2. for enemies
        if (!player) return;

        this.angle = -Math.atan2(this.y - player.y, -(this.x - player.x));
        let vx = Math.cos(this.angle)*1.5;
        let vy = Math.sin(this.angle)*1.5;
        this.x += ~~vx;
        this.y += ~~vy;
    }
    createCell (setType = 'any', count = 1, push = false) {
        let result = [];
        for (let i = 0; i < count; i++) {
            let type = setType;
            if (!type || type == 'any') {
                type = random(0, 11);
                switch (type) {
                    case 0: case 1: case 2: case 3:
                        type = 'square';
                        break;
                    case 4:
                        type = 'hexagon';
                        break;
                    case 5: case 6: case 7: case 8:
                        type = 'triangle';
                        break;
                    case 9:
                        type = 'attacker';
                        break;
                    case 10:
                        type = 'pentagon';
                        break;
                }
            }
            if (push)
                cells.push(new Geometry(type))
            else {
                if (count == 1)
                    return new Geometry(type);
                else result.push(new Geometry(type));
            }
        }
        return result;
    }
}