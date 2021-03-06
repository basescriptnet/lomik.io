

// require
// require('./globals');
// require('./updater');
// const classes = require('./classes');
// let { checkCells, checkPlayers, checkEnemies } = require('./entities');
castle = new Castle();
let nightCount = 0;
const modeInterval = {
    easy: {
        firstNight: 10e3,
        whenBoss: 30e3,
        regular: 20e3
    },
    normal: {
        firstNight: 10e3,
        whenBoss: 30e3,
        regular: 20e3
    },
    hard: {
        firstNight: 10e3,
        whenBoss: 30e3,
        regular: 20e3
    },
    crazy: {
        firstNight: 10e3,
        whenBoss: 30e3,
        regular: 20e3
    },
    impossible: {
        firstNight: 60e3,
        whenBoss: 45e3,
        regular: 45e3
    }
};

// global reusable variables and functions
let intervalId = null;
let nightInterval = null;
let isGameOver = false;

let reset = () => {
    window.players = {offline: new window.Tank('offline', 0)};
    isNight = false;
    castle = new Castle();
    isGameOver = false;
    // for (let i in players) {
    //     if (!players[i]) return;
    //     clients[i] = false;
    //     players[i] = new Tank(i);
    // }
    cells = [];
    enemies = [];

    window.Geometry.prototype.createCell('any', 20, true);
    window.Geometry.prototype.createCell('heptagon', 1, true);

    let enemyAmount = 1;



    nightInterval = setInterval(() => {
        isNight = !isNight;
        isNight && nightCount++;
        if (!isNight) return; 
        if (enemies.length > 5) return;
            
        if (nightCount % 10 === 0) {
            enemies.push(new Enemy(true));
        }
        if (nightCount % 3 === 0) {
            if (enemyAmount < 10) 
                enemyAmount++;
        }
        // if (enemyAmount < 5) Math.random() > .85 ? enemyAmount++ : null;
        for (let i = 0; i < enemyAmount; i++) {
            let enemyClass;
            switch (random(0, 10)) {
                case 1:
                case 2:
                    enemyClass = 'machineGun';
                    break;
                case 3:
                case 4:
                    enemyClass = 'machineGun';
                    break;
                case 5:
                case 6:
                    enemyClass = 'flankguard';
                    break
                case 7:
                case 8:
                    enemyClass = 'sniper';
                    break;
                case 9:
                    enemyClass = 'quadTank';
                    break;
                case 10:
                    enemyClass = 'pentashot';
                    break;
            }
            let enemy = new Enemy();
            // if (n <= 4) {
            //     enemyClass = 'sniper';
            // } else if (n >= 4 && n <= 6) {
            //     enemyClass = 'flankguard';
            // } else if (n >= 6 && n <= 8) {
            //     enemyClass = 'twin';
            // } else if (n >= 8 && n <= 10) {
            //     enemyClass = 'machineGun';
            // }
            classes.call(enemy, enemyClass, enemy);
            // classes.call(boss, 'boss', boss);
            enemy.reloadDelay *= 1.3;
            enemies.push(enemy);
        }
        window.Geometry.prototype.createCell('attacker', playersLength, true);
    }, 15e3);
    castle.aliveFrom = Date.now();
    castle.dead = false;
};

let connect = () => {
// io.on('connection', sock => {
    players[sock.id] = new window.Tank(sock.id, 0);
    clients[sock.id] = false;
    reset();
    // enemies.push(new Enemy());
    let opacity = 0;
    let newGameIn = 0;
    intervalId = setInterval(() => {
        now = Date.now();
        if (isGameOver) {
            // io.emit('update', {objects: {
            //     seconds: ~~((newGameIn - now)/1000),
            //     castle
            // }});
            seconds = ~~((newGameIn - now)/1000);
            if (now > newGameIn) {
                clearInterval(intervalId);
                clearInterval(nightInterval);
                reset();
            }
            return;
        };
        // gets lightweight variant of players object, so you can update it faster
        let updatedPlayers;
        try {
            updatedPlayers = checkPlayers();
            // enemies
            checkEnemies();
            checkCells();
            Collision.castleCollision();
            if (castle.health <= 0) {
                isGameOver = true;
                castle.lastedUntil = now;
                // debugger
                newGameIn = now+5e3;
                clearInterval(intervalId);
                clearInterval(nightInterval);
                setTimeout(connect, 5e3);
                return;
            }
            regen(castle);

            if (!isNight) opacity -= 0.02;
            else opacity += 0.02;
            if (opacity > .5) opacity = .5;
            else if (opacity < 0) opacity = 0;

            // io.emit('update', {objects: {
            //     players: updatedPlayers,
            //     cells, enemies, isNight, castle, opacity
            // }});
        }
        catch (err) {
            console.log(err);
        }
    }, 1000/60);
}
connect();

    sock.on('rotate', function (obj) {
        let player = players[sock.id];
        if (!player || !obj) return;
        player.angle = obj.angle|0;
    });

    // sock.on('score', 
    function addScore () {
        let player = players[sock.id];
        if (!player) return;
        player.score += 1000;
        // player.level++;
        updateScore(player);
        updateLevel(player);
    };

    // sock.on('changeTank', 
    function changeTank (n) {
        let player = players[sock.id];
        if (!player || !(n in player.availableClasses)) return;
        classes.call(player, n, player);
        updateLevel(player);
    };

    function upgrade (key) {
        let player = players[sock.id];
        if (!player) return;

        player.upgrade(player, key);
    };

    sock.on('shoot', function () {
        let player = players[sock.id];
        if (!player.canShoot) return;
        player.shoot();
    });

    function update (obj) {
        if (!players[obj.id]) return;
        if (!obj.property && !obj.props) {
            players[obj.id] = obj.player;
        }
        else {
            let updatedPlayer = players[obj.id];

            if (typeof obj.property === 'string')
                updatedPlayer[obj.property] = obj.value;
            else if (obj.props) {
                let props = obj.props;
                // [index: i, [[path to property], value]: prop]
                for (let i = 0; i < props.length; i++) {
                    let arr = props[i]; // [prop, value]
                    let property = arr[0]; // prop
                    

                    if (property instanceof Array) {
                        let path = updatedPlayer[property[0]], last, len = property.length;

                        for (let j = 0; j < len; j++) {
                            if (j == len -1 && j > 0) {
                                last = property[j];
                                break;
                            }
                            path = path[property[j]];
                        }
        
                        path[last] = arr[1]; // value
                    }
                    else updatedPlayer[property] = arr[1];

                }
            }
            else if (obj.property instanceof Array) {
                let path = players[obj.id], last, len = obj.property.length;
                for (let i = 0; i < len; i++) {
                    if (i == len -1 && i > 0) {
                        last = obj.property[i];
                        break;
                    }
                    path = path[obj.property[i]];
                }

                path[last] = obj.value;
            }
            else updatedPlayer[obj.property] = obj.value;
        }
        io.emit('update', obj);
    // });
};