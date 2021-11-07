window.Castle = class Castle {
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
            delay: 15e3,
        };
        this.x = 450;
        this.y = 450;
    }
};