module.exports = class Castle {
    constructor () {
        this.side = 50;
        this.health = 7000;
        this.maxHealth = 7000;
        this.bodyDamage = 3000;
        this.lastDamaged = 0;
        this.aliveFrom = 0;
        this.lastedUntil = null;
        this.regeneration = {
            speed: 20,
            delay: 12e3, // ! 12e4 bdi exni
        };
        this.x = 300;
        this.y = 300;
    }
};