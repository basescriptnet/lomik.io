window.checkCells = function checkCells () {
    for (let j = 0, len = cells.length; j < len; j++) {
        let i = cells[j];
        if (i.dead) {
            i.scale += .1;
            if (performance || i.scale >= 2)
                cells.splice(j, 1);
                len--;
            continue;
        }
        else if (i.type == 'attacker') {
            i.attack();
        } else if (i.type == 'heptagon') {
            // for future. It lets you to set the enemies as a target
            // and to attack with geometric objects
            // i.attack(enemies);
        }
        if (i.health < i.maxHealth) {
            regen(i);
        }
        i.recalculate();
    }
}