// const Tank = require("../tank");

window.checkPlayers = function checkPlayers () {
    let updatedPlayers = {};
    // for (let i in players) {
        let player = players['offline'];
        // if (clients[i]) continue;
        if (!player) {
            return;
        }
        else if (player.dead && player.lastDamaged + 5e3 > now) {
            updatedPlayers[player.id] = player
            // io.emit('update', {objects: {
            //     player: player.simplify
            // }});
            // player = player.simplify
            return;
        } else if (player.dead) {
            let id = player.id;
            players[id] = new window.Tank(id, ~~player.score/2)
            updateScore(players[id])
            updateLevel(players[id])
            return;
        }
        let level = player.level;
        Collision.bulletCollision(player, cells);
        Collision.bodyCollision(player, cells);
        if (level < player.level)
            updateLevel(player);
    
        if (player.health < player.maxHealth) {
            if (player.health > 0)
                regen(player);
            else {
                // ! this is commented lastly
                // io.emit('update', {objects: {
                    // seconds: now + 5e3,
                    // players
                // }});
                // ? this used instead
                window.seconds = now + 5e3;
                // players = 

                // setTimeout(() => {
                //     // let player = players[i];
                //     // debugger;
                //     if (!players[i]) return;
                //     players[i] = new Tank(i,
                //         ~~players[i].score/2,
                //     )
                //     updateScore(players[i])
                // }, 5e3);
            }
        }
    
        if (player.buttons.c === true)
            player.angle += .02;
    
        if (player.bullets.length) {
            let bullets = player.bullets;
            let len = bullets.length;
    
            for (let i = 0; i < len; i++) {
                let bullet = bullets[i];
                if (bullet.aliveUntil < now) {
                    bullets.splice(i, 1);
                    len--;
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
                isOutOfBox(player);
            }
        }
        move(player);
        updatedPlayers[player.id] = player;
    // }
    return updatedPlayers;
}