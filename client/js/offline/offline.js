let mousedown = false;

globalThis.players = {offline: new Tank('offline')};
globalThis.enemies = [];
globalThis.isNight = false;
globalThis.seconds = 0;
// globalThis.cells = [];
globalThis.mobile = false;

function updateCells (obj) {
    cells = obj;
}

function updateEnemies (obj) {
    enemies = obj;
}

function update (obj) {
    if (obj.objects) {
        for (let i in obj.objects) {
            globalThis[i] = obj.objects[i];
            // eval(i + ' = obj.objects[i]');
        }
    }
    else if (!obj.property && !obj.props) {
        if (!obj.id) players = obj;
        else players[obj.id] = obj;
        // players[obj.id].prototype = Tank.prototype;
    }
    else {
        let updatedPlayer = players[obj.id];
        if (!updatedPlayer) return;
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
    }
};

// init the game
(function () {
    let initServerTimeoutlId = () => {
        if (Object.keys(players).length === 0 || !players[sock.id]) {
            setTimeout(initServerTimeoutlId, 100);
            return;
        }
        let availableClassTouch = (ex, ey, execute) => {
            let player = players[sock.id];
            if (!player) return;
            if (Object.keys(player.availableClasses).length > 0) {
                // let ex = po;
                // let ey = y;
                
                let available = player.availableClasses;
                let x = 20;
                let y = 20;
                for (let i in available) {
                    if (ex > x
                        && ex < x + 70
                        && ey > y
                        && ey < y + 70)
                    {
                        debugger
                        if (execute) changeTank(i);
                        return true;
                    }
                    else {
                        x += 75;
                        if (x > 95) {
                            x = 20;
                            y += 75;
                        }
                    }
                }
            }
            return false;
        };

        let rotatedLastTime = 0;


        // if (globalThis.mobile) {
            
        // }
        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", function (e) {
            if (!mobile) return;
            e.preventDefault();
            availableClassTouch(e.touches[0].clientX, e.touches[0].clientY, true);
            // mousePos = getTouchPos(canvas, e);
            if (now < rotatedLastTime + 30) return;
            let touch = e.touches[0];
            if (touch.clientX < 240 && touch.clientY < 270) {
                
            };
            if (touch.clientX > cw/2) {
                // debugger
                let mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX - cw * 2/4,
                    clientY: touch.clientY - ch * 2/4
                });
                canvas.dispatchEvent(mouseEvent);
                return;
            }

        }, false);

        canvas.addEventListener("touchend", function (e) {
            if (!mobile) return;
            if (now < rotatedLastTime + 30) return;
            let mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
            // debugger

            // if (e.clientX < cw/2) {
            //     let dispatch = function (object) {
            //         let e = new TouchEvent('touchmove', object);
            //         canvas.dispatchEvent(e);
            //     }
            //     dispatch({x: cw/4, y: ch*3/4});
            // }
        }, false);

        canvas.addEventListener("touchmove", function (e) {
            if (!mobile) return;
            if (now < rotatedLastTime + 30) return;
            for (let i = 0; i < 2; i++) {
                let touch = e.touches[i];
                if (!touch) continue;
                if (touch.clientX > cw/2) {
                    if (CircularCollision({x: cw * 3/4, y: ch * 3/4, r: 70}, {x: touch.clientX, y: touch.clientY, r: 1})) {
                        let mouseEvent = new MouseEvent("mousemove", {
                            clientX: touch.clientX - cw / 4,
                            clientY: touch.clientY - ch / 4,
                        });
                        canvas.dispatchEvent(mouseEvent);
                        // debugger
                            
                        if (availableClassTouch(touch.clientX - cw * 2/4, touch.clientY - ch * 2/4)) {
                            let mouseDownEvent = new MouseEvent("mousedown", {
                                clientX: cw/2 - touch.clientX/100-10,
                                clientY: ch/2 - touch.clientX/100-10
                            });
                            canvas.dispatchEvent(mouseDownEvent);
                            return;
                        }
                        let mouseDownEvent = new MouseEvent("mousedown", {
                            clientX: touch.clientX - cw * 2/4,
                            clientY: touch.clientY - ch * 2/4
                        });
                        canvas.dispatchEvent(mouseDownEvent);
                    }
                    return;
                }
                if (CircularCollision({x: cw/4, y: ch * 3/4, r: 70}, {x: touch.clientX, y: touch.clientY, r: 1})) {
                    let distanceX = touch.clientX - cw/4;
                    let distanceY = touch.clientY - ch*3/4;
                    let dispatch = function (eventType, object) {
                        let e = new KeyboardEvent(eventType, object);
                        canvas.dispatchEvent(e);
                    }
                    // left
                    if (distanceX > 15) {
                        dispatch('keydown', {
                            keyCode: 39
                        })
                    } else {
                        dispatch('keyup', {
                            keyCode: 39
                        })
                    }
                    // right
                    if (distanceX < -15) {
                        dispatch('keydown', {
                            keyCode: 37
                        })
                    } else {
                        dispatch('keyup', {
                            keyCode: 37
                        })
                    }
                    // down
                    if (distanceY > 15) {
                        dispatch('keydown', {
                            keyCode: 40
                        })
                    } else {
                        dispatch('keyup', {
                            keyCode: 40
                        })
                    }
                    // up
                    if (distanceY < -15) {
                        dispatch('keydown', {
                            keyCode: 38
                        })
                    } else {
                        dispatch('keyup', {
                            keyCode: 38
                        })
                    }
                }
            }
        }, false);

        // canvas.addEventListener('mousemove', e => {
        //     if (now < rotatedLastTime + 30) return;
        //     rotatedLastTime = now;
        //     Tank.prototype.rotate(players[sock.id], e);
        // });

        canvas.addEventListener('mousemove', e => {
            if (now < rotatedLastTime + 30) return;
            rotatedLastTime = now;
            Tank.prototype.rotate(players[sock.id], e);
        });

        canvas.addEventListener('mousedown', e => {
            availableClassTouch(e.clientX, e.clientY, true)
            // let player = players[sock.id];
            // if (!player) return;
            // if (Object.keys(player.availableClasses).length > 0) {
            //     let ex = e.clientX;
            //     let ey = e.clientY;
                
            //     let available = player.availableClasses;
            //     let x = 20;
            //     let y = 20;
            //     for (let i in available) {
            //         if (ex > x
            //             && ex < x + 70
            //             && ey > y
            //             && ey < y + 70)
            //         {
            //             sock.emit('changeTank', i);
            //             return;
            //         }
            //         else {
            //             x += 75;
            //             if (x > 95) {
            //                 x = 20;
            //                 y += 75;
            //             }
            //         }
            //     }
            // }
            mousedown = true;
            Tank.prototype.shoot(player, e);
        });
        canvas.addEventListener('mouseup', () => mousedown = false);
        canvas.addEventListener('contextmenu', e => e.preventDefault());

        canvas.addEventListener('keydown', e => Tank.prototype.moveHandler(players[sock.id], e));
        canvas.addEventListener('keyup', e => Tank.prototype.moveHandler(players[sock.id], e));
        canvas.addEventListener('keypress', e => Tank.prototype.keyHandler(players[sock.id], e));
        requestAnimationFrame(game);
        window.addEventListener('blur', () => paused = true);
        window.addEventListener('focus', () => {
            paused = false;
            requestAnimationFrame(game);
        });
        // window.addEventListener('close', () => sock.emit('disconnect'));
    };

    setTimeout(initServerTimeoutlId, 200);
})();