let classes = require('../classes');
let createClass = className => {
    let tank = new Tank(0, 0).simplify;
    classes.call(tank, className, tank);
    return tank;
};

let classStructure = {
    twin: {
        tripleshot: {
            pentashot: null,
            octoTank: null,
            triple: null
        },
        twinHawk: {
            tripleTwin: null,
        },
        quadTank: {
            octoTank: null
        }
    },
    sniper:{
        overseer: null,
    },
    machineGun: {
        destroyer: {
            hybrid: null,
            annihilator: null,
            skimmer: null,
        },
        gunner: null,
    },
    flankguard: {
        tri_angle: {
            booster: null,
            fighter: null,
        },
    },
};

function move(player) {
    let dx = 0,
        dy = 0;
    if (player.isMoving) {
        let buttons = player.moveButtons;
        if (buttons.left) dx = -1;
        if (buttons.right) dx = 1;
        if (buttons.up) dy = -1;
        if (buttons.down) dy = 1;

        // are keys opposite
        if (buttons.left && buttons.right) dx = 0;
        if (buttons.up && buttons.down) dy = 0;
        if (dx !== 0 || dy !== 0) {
            let x = ~~(player.x + player.speed * dx);
            let y = ~~(player.y + player.speed * dy);
            if (x > player.r && x < 900 - player.r)
                player.x = x;
            if (y > player.r && y < 900 - player.r)
                player.y = y;

            isOutOfBox(player);
        }
    }
}

function isOutOfBox(obj) {
    let r = obj.r|0;
    if (obj.x - r <= 0)
        obj.x = r;
    else if (obj.x + r >= 900)
        obj.x = 900 - (r || obj.w|0);
    if (obj.y - r <= 0)
        obj.y = r;
    else if (obj.y + r >= 900)
        obj.y = 900 - (r || obj.h|0);
}

function updateLevel(player) {
    // 2 is the number of levels required each time to get a new upgrade
    if (player.level > player.classPath.length * 2) {
        player.availableClasses = {};
        let tmp = classStructure;
        for (let i = 0, len = player.classPath.length; i < len; i++) {
            tmp = tmp[player.classPath[i]];
        }
        for (let i in tmp) {
            player.availableClasses[i] = createClass(i);
        }
    } else player.availableClasses = {};
}

function regen(obj) {
    if (obj.lastDamaged + obj.regeneration.delay < now) {
        obj.health += obj.regeneration.speed;
        if (obj.health > obj.maxHealth) {
            obj.health = obj.maxHealth;
        }
    }
}

module.exports = {
    classStructure,
    move,
    isOutOfBox,
    updateLevel,
    regen
}