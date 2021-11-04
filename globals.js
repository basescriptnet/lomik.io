global.random = (min, max) => ~~(Math.random() * (max - min) + min);
global.now = 0;
global.isNight = false;
global.players = {};
global.clients = [];
global.cells = [];
global.enemies = [];
global.playersLength = 0;
// send objects to classes
global.Geometry = require('./geometry');
global.collision = require('./collision');
global.Tank = require('./tank');
global.classes = require('./classes');
global.CircularCollision = function CircularCollision(circle1, circle2) {
    if (!circle1 || !circle2) return;
    return ((circle1.x - circle2.x)**2 + (circle1.y - circle2.y)**2)**.5 < circle1.r + circle2.r;
    // let dx = circle1.x - circle2.x;
    // let dy = circle1.y - circle2.y;
    // let distance = (dx * dx + dy * dy)**.5;

    // return (distance < circle1.r + circle2.r);
}

global.updateScore = function (obj, cellType) {
    let score = 0;
    if (cellType) {
        switch (cellType) {
            case 'square':
                score = 10;
                break;
            case 'triangle':
            case 'attacker':
                score = 15;
                break;
            case 'pentagon':
                score = 130;
                break;
            case 'hexagon':
            case 'enemy':
                score = 250;
                break;
            case 'heptagon':
                score = 400;
                break;
        }
    }
    // ? fix it! levels are not updated. Classes are not available
    obj.score += score;

    let levels = obj.levelSettings;
    if (obj.score >= obj._prevLevelsTotal + levels[obj.level+1]) {
        let sum = 0;
        for (let i in levels) {
            sum += levels[i];
            if (obj.score < sum) {
                obj.upgradedNTimes[8] += i -1 - obj.level;
                obj._prevLevelsTotal = sum - levels[i];
                obj.level = obj.levelSettings.indexOf(levels[i-1]);
                obj.r = 10 + obj.level/20;
                break;
            }
        }
    }
}