let checkMazeForBlocks = (initX, initY, size) => {
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (!maze[initY + y] || !maze[initY + y][initX + x]) return;
            }
        }
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                maze[initY + y][initX + x] = false;
            }
        }
        maze[initY][initX] = size;
    },
    maze,
    size,
    padding,
    rollMazeSpawn = (chance) => {
        return ran.random(1) <= chance;
    }
    generateCitadelMaze = () => {
        size = 34;
        padding = 2;
        maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(false))));
        const fullWalls = [1, 2, 3, 4, 5, size - 6, size - 5, size - 4, size - 3, size - 2];
        const outerWalls = [0, size - 1];
        // const innerWalls = [5, size - 6];
        const innerWalls = [];
        for (let i = 10; i < size - 10; i++) {
            for (let pos of fullWalls) {
                maze[pos][i] = true;
                maze[i][pos] = true;
            }
            for (let pos of outerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.4);
                maze[i][pos] ||= rollMazeSpawn(0.4);
            }
            for (let pos of innerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.65);
                maze[i][pos] ||= rollMazeSpawn(0.65);
            }
        }
        // Forced walls
        // Lip on walls
        let forcedX = [9];
        let forcedY = [1, 2, 3];
        for (let x of forcedX) {
            for (let y of forcedY) {
                let inverseX = size - x - 1;
                let inverseY = size - y - 1;
                maze[x][y] = -1;
                maze[inverseX][y] = -1;
                maze[x][inverseY] = -1;
                maze[inverseX][inverseY] = -1;
                maze[y][x] = -1;
                maze[y][inverseX] = -1;
                maze[inverseY][x] = -1;
                maze[inverseY][inverseX] = -1;
            }
        }
        // Inner corners
        maze[10][5] = -1;
        maze[size - 11][5] = -1;
        maze[10][size - 6] = -1;
        maze[size - 11][size - 6] = -1;
        maze[5][10] = -1;
        maze[5][size - 11] = -1;
        maze[size - 6][10] = -1;
        maze[size - 6][size - 11] = -1;
    }
    generateFortressMaze = () => {
        size = 32;
        padding = 3;
        maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(false))));
        const fullWalls = [1, 2, 3, 4, size - 5, size - 4, size - 3, size - 2];
        const outerWalls = [0, size - 1];
        // const innerWalls = [4, size - 5];
        const innerWalls = [];
        for (let i = 4; i < size / 2 - 4; i++) {
            for (let pos of fullWalls) {
                maze[pos][i] = true;
                maze[i][pos] = true;
                maze[pos][size - i - 1] = true;
                maze[size - i - 1][pos] = true;
            }
            for (let pos of outerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.55);
                maze[i][pos] ||= rollMazeSpawn(0.55);
                maze[pos][size - i - 1] ||= rollMazeSpawn(0.55);
                maze[size - i - 1][pos] ||= rollMazeSpawn(0.55);
            }
            for (let pos of innerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.65);
                maze[i][pos] ||= rollMazeSpawn(0.65);
                maze[pos][size - i - 1] ||= rollMazeSpawn(0.65);
                maze[size - i - 1][pos] ||= rollMazeSpawn(0.65);
            }
        }
        // Corners
        maze[2][2] = rollMazeSpawn(0.4);
        maze[2][3] = rollMazeSpawn(0.5);
        maze[3][2] = rollMazeSpawn(0.5);
        maze[3][3] = -1;
        maze[size - 3][2] = rollMazeSpawn(0.4);
        maze[size - 3][3] = rollMazeSpawn(0.5);
        maze[size - 4][2] = rollMazeSpawn(0.5);
        maze[size - 4][3] = -1;
        maze[2][size - 3] = rollMazeSpawn(0.4);
        maze[2][size - 4] = rollMazeSpawn(0.5);
        maze[3][size - 3] = rollMazeSpawn(0.5);
        maze[3][size - 4] = -1;
        maze[size - 3][size - 3] = rollMazeSpawn(0.4);
        maze[size - 3][size - 4] = rollMazeSpawn(0.5);
        maze[size - 4][size - 3] = rollMazeSpawn(0.5);
        maze[size - 4][size - 4] = -1;
        
        // Edges of red
        let forcedX = [10, 11];
        let forcedY = [4];
        for (let x of forcedX) {
            for (let y of forcedY) {
                let inverseX = size - x - 1;
                let inverseY = size - y - 1;
                maze[x][y] = -1;
                maze[inverseX][y] = -1;
                maze[x][inverseY] = -1;
                maze[inverseX][inverseY] = -1;
                maze[y][x] = -1;
                maze[y][inverseX] = -1;
                maze[inverseY][x] = -1;
                maze[inverseY][inverseX] = -1;
            }
        }
    }
    generateBlitzMaze = () => {
        size = 36;
        padding = 1;
        maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(false))));
        const fullWalls = [1, 2, size - 3, size - 2];
        const outerWalls = [0, size - 1];
        // const innerWalls = [2, size - 3];
        const innerWalls = [];
        for (let i = 1; i < size - 1; i++) {
            for (let pos of outerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.4);
                maze[i][pos] ||= rollMazeSpawn(0.4);
            }
        }
        for (let i = 1; i < size - 1; i++) {
            for (let pos of fullWalls) {
                maze[pos][i] = true;
                maze[i][pos] = true;
            }
        }
        for (let i = 2; i < size - 2; i++) {
            for (let pos of innerWalls) {
                maze[pos][i] ||= rollMazeSpawn(0.8);
                maze[i][pos] ||= rollMazeSpawn(0.8);
            }
        }
        // Forced walls
        maze[2][2] = true;
        maze[2][size - 3] = true;
        maze[size - 3][2] = true;
        maze[size - 3][size - 3] = true;
    }
    generateVolcanoMaze = () => {
        size = 36;
        padding = 1;
        maze = JSON.parse(JSON.stringify(Array(size).fill(Array(size).fill(false))));
        const fullWalls = [size / 2 - 3];
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.005 * Math.PI) {
            for (let radius of fullWalls) {
                let x = Math.floor(size / 2 + radius * Math.cos(theta));
                let y = Math.floor(size / 2 + radius * Math.sin(theta));
                maze[x][y] = true;
            }
        }
    }
    generateSiegeMaze = (mode) => {
        switch (mode) {
            case "map_siege_citadel":
                generateCitadelMaze();
                break;
            case "map_siege_fortress":
                generateFortressMaze();
                break;
            case "map_siege_blitz":
                generateBlitzMaze();
                break;
            case "map_siege_volcano":
                generateVolcanoMaze();
                break;
        }
        // Remove invalid walls
        const scale = room.width / (size + 2 * padding);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (maze[x][y] === true) {
                    d = {
                        x: ((x + padding) * scale) + (scale / 2),
                        y: ((y + padding) * scale) + (scale / 2),
                        s: scale,
                    };
                    if (!room.getAt(d).data.allowMazeWallSpawn) {
                        maze[x][y] = false;
                    }
                } else if (maze[x][y] === -1) {
                    maze[x][y] = true;
                }
            }
        }

        // Convert to big walls
        for (let x = 0; x < size - 1; x++) {
            for (let y = 0; y < size - 1; y++) {
                for (s = 5; s >= 2; s--) checkMazeForBlocks(x, y, s);
            }
        }
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let spawnWall = false,
                    d = {};

                // Find spawn location and size
                for (let s = 5; s >= 1; s--) {
                    if (maze[x][y] == s) {
                        d = {
                            x: ((x + padding) * scale) + (scale * s / 2),
                            y: ((y + padding) * scale) + (scale * s / 2),
                            s: scale * s,
                        };
                        spawnWall = true;
                        break
                    }
                }
                if (spawnWall) {
                    let o = new Entity({
                        x: d.x,
                        y: d.y
                    });
                    o.define("wall");
                    o.SIZE = d.s * 0.5 - 2;
                    o.team = TEAM_ENEMIES;
                    o.protect();
                    o.life();
                    makeHitbox(o);
                    walls.push(o);
                }
            }
        }
    };

module.exports = { generateSiegeMaze };