// function RectCircleColliding(circle, rect) {
//     let distX = Math.abs(circle.x - rect.x-rect.r);
//     let distY = Math.abs(circle.y - rect.y-rect.r);

//     if (distX > (rect.r + circle.r)) { return false; }
//     if (distY > (rect.r + circle.r)) { return false; }

//     if (distX <= (rect.r)) { return true; } 
//     if (distY <= (rect.r)) { return true; }

//     let dx = distX-rect.r;
//     let dy = distY-rect.r;
//     return (dx**2 + dy**2 <= circle.r**2);
// }

window.Collision = {
    bulletCollision (obj, cells) {
        if (!obj || obj.dead) return;
        if (obj.isEnemy && cells && cells[0] && cells[0].isEnemy) return;
        let incrementor = 1
        if (obj.isPlayer) {
            if (CircularCollision(obj, {x: 200, y: 200, r: 20})) {
                incrementor = 2;
            }
        }
        if (obj.bullets.length == 0) return;
        for (let i = 0, len = obj.bullets.length; i < len; i++) {
            let bullet = obj.bullets[i];
            if (bullet === void 0) break; // may accur because of setTimeouts on client
            for (let j in cells) { // for in loop makes sure, that objects are parsed as well
                let cell = cells[j];
                if (!cell) continue;
                if (cell.dead) continue;
                if (CircularCollision(bullet, cell)) {
                    bullet.health -= cell.bodyDamage + obj.penetration;
                    if (bullet.health <= 0) {
                        obj.bullets.splice(obj.bullets.indexOf(bullet), 1);
                    }
                    cell.health -= obj.bulletDamage * incrementor;
                    if (cell.health <= 0) {
                        cell.dead = true;
                        if (cell.isEnemy) {
                            updateScore(obj, cell.type);
                        } else if (cell.isPlayer) { // player
                            cell.lastDamaged = now;
                            io.emit('update', {objects: {
                                seconds: now + 5e3,
                                player: cell.simplify
                            }});
                        } else if (cells.length) {
                            setTimeout(() => {
                                window.Geometry.prototype.createCell('any', 1, true);
                            }, 3000);
                            updateScore(obj, cell.type);
                        }
                        return;
                    }
                    else cell.lastDamaged = now;
                    let vx, vy;
                    if (bullet.speedX < 0) {
                        vx = -1;
                    }
                    else if (bullet.speedX > 0) {
                        vx = 1;
                    }
                    if (bullet.speedY < 0) {
                        vy = -1;
                    }
                    else if (bullet.speedY > 0) {
                        vy = 1;
                    }
                    cell.vx = 2 * vx|0;
                    cell.vy = 2 * vy|0;
                    cell.x += cell.vx;
                    cell.y += cell.vy;
                }
            }
            for (let j = 0, len = enemies.length; j < len; j++) {
                // neee. spese lengthi xndir kunenam... Amen merneluc bdi len-- enes
                let enemy = enemies[j];
                if (!enemy) continue;
                // if (enemy.dead) return;
                if (CircularCollision(bullet, enemy)) {
                    bullet.health -= enemy.bodyDamage + obj.penetration;
                    if (bullet.health <= 0) {
                        obj.bullets.splice(obj.bullets.indexOf(bullet), 1);
                    }
                    enemy.health -= obj.bulletDamage;
                    if (enemy.health <= 0) {
                        enemies.splice(j, 1);
                        len--;
                        // if (enemies.length) {
                        //     setTimeout(() => {
                        //         cells.push(Geometry.prototype.createCell());
                        //     }, 3000);
                            updateScore(obj, 'enemy');
                            return;
                        // }
                    }
                    else enemy.lastDamaged = now;
                    let vx, vy;
                    if (bullet.speedX < 0) {
                        vx = -1;
                    }
                    else if (bullet.speedX > 0) {
                        vx = 1;
                    }
                    if (bullet.speedY < 0) {
                        vy = -1;
                    }
                    else if (bullet.speedY > 0) {
                        vy = 1;
                    }
                    enemy.vx = 2 * vx|0;
                    enemy.vy = 2 * vy|0;
                    enemy.x += enemy.vx;
                    enemy.y += enemy.vy;
                }
            }
        }
    },
    bodyCollision (obj, cells) {
        if (!obj || obj.dead) return;
        if (obj.isEnemy && cells && cells[0] && cells[0].isEnemy) return;
        // for (let i = 0, len = cells.length;  i < len; i++) {
        for (let i in cells) {
            let cell = cells[i];
            if (!cell) continue;
            if (cell.dead) continue;
            if (CircularCollision(obj, cell))  {
                obj.health -= cell.bodyDamage;
                if (obj.health <= 0) {
                    if (obj.isEnemy) {
                        updateScore(cell, 'enemy');
                        return enemies.splice(enemies.indexOf(obj), 1);
                    }
                    obj.dead = true;
                }
                else obj.lastDamaged = now;

                cell.health -= obj.bodyDamage;
                if (cell.health <= 0) {
                    cell.dead = true;
                    if (cell.isEnemy) {
                        enemies.splice(enemies.indexOf(obj), 1);
                    } else if (cell.isPlayer) { // player
                        cell.lastDamaged = now;
                        // io.emit('update', {objects: {
                        //     seconds: now + 5e3,
                        //     player: cell.simplify
                        // }});
                        
                        // updateScore(obj, 'enemy');
                        seconds = now + 5e3;
                    } else if (cells.length) {
                        setTimeout(() => {
                            window.Geometry.prototype.createCell('any', 1, true);
                        }, 3000);
                        updateScore(obj, cell.type);
                    }
                    return;
                }
                else cell.lastDamaged = now;
                let vx, vy;
                if (obj.moveButtons.left === true) {
                    vx = -1;
                }
                else if (obj.moveButtons.right === true) {
                    vx = 1;
                }
                if (obj.moveButtons.up === true) {
                    vy = -1;
                }
                else if (obj.moveButtons.down === true) {
                    vy = 1;
                }
                cell.vx = 5 * vx|0;
                cell.vy = 5 * vy|0;
                cell.x += cell.vx;
                cell.y += cell.vy;
                obj.x -= cell.vx*1.2;
                obj.y -= cell.vy*1.2;
            }
        }
        // if the object is an enemy (cuz the checker function is the same for all)
        // if (enemies.includes(obj)) return;
        if (obj.isEnemy) return;
        for (let j = enemies.length; j >= 0; j--) {
            // neee. spese lengthi xndir kunenam... Amen merneluc bdi len-- enes
            let enemy = enemies[j];
            if (!enemy || enemy.dead) continue;
            if (CircularCollision(obj, enemy))  {
                obj.health -= enemy.bodyDamage;
                if (obj.health <= 0) {
                    obj.dead = true;
                    // if (obj)
                    // console.log('dead by body damage')
                }
                else obj.lastDamaged = now;
                enemy.health -= obj.bodyDamage;
                if (enemy.health <= 0) {
                    enemies.splice(j, 1);
                    j--;
        //             // if (enemies.length) {
        //             //     setTimeout(() => {
        //             //         cells.push(Geometry.prototype.createCell());
        //             //     }, 3000);
                        updateScore(obj, 'enemy');
                        return;
        //             // }
                }
                let vx = 0,
                    vy = 0;
                if (obj.moveButtons.left === true) {
                    vx = -1;
                }
                else if (obj.moveButtons.right === true) {
                    vx = 1;
                }
                if (obj.moveButtons.up === true) {
                    vy = -1;
                }
                else if (obj.moveButtons.down === true) {
                    vy = 1;
                }
                enemy.vx = 2 * vx;
                enemy.vy = 2 * vy;
                enemy.x += enemy.vx;
                enemy.y += enemy.vy;
            }
        }
    },
    castleCollision () {
        if (castle.dead) return;
        for (let i = 0, len = enemies.length; i < len; i++) {
            let enemy = enemies[i];
            if (!enemy) continue;
            // if (RectCircleColliding(enemy, castle))  {aw
            if (enemy.x + enemy.r > castle.x - castle.side/2
                && enemy.x - enemy.r < castle.x + castle.side/2
                && enemy.y + enemy.r > castle.y - castle.side/2
                && enemy.y - enemy.r < castle.y + castle.side/2){
                castle.health -= enemy.bodyDamage;
                if (castle.health <= 0) {
                    castle.dead = true;
                    castle.lastedUntil = now;
                }
                else castle.lastDamaged = now;
                enemy.health -= castle.bodyDamage;
                if (enemy.health <= 0) {
                    // enemy.dead = true;
                    enemies.splice(i, 1);
                    i--;
                    len--;
                }
                else enemy.lastDamaged = now;
            }
            for (let j = 0, len = enemy.bullets.length; j < len; j++) {
                let bullet = enemy.bullets[j];
                if (!bullet) continue;
                
            // if (RectCircleColliding(bullet, castle))  {
                if (bullet.x + bullet.r > castle.x - castle.side/2
                    && bullet.x - bullet.r < castle.x + castle.side/2
                    && bullet.y + bullet.r > castle.y - castle.side/2
                    && bullet.y - bullet.r < castle.y + castle.side/2)
                {
                    castle.health -= enemy.bulletDamage + enemy.penetration;
                    if (castle.health <= 0) {
                        castle.dead = true;
                    }
                    else castle.lastDamaged = now;

                    bullet.health -= castle.bodyDamage;
                    if (bullet.health <= 0) {
                        enemy.bullets.splice(enemy.bullets.indexOf(bullet), 1);
                    }
                }
            }
        }
    }
}