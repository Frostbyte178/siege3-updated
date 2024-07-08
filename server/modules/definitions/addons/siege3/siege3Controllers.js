class io_circleTarget extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.orbitRange = opts.range ?? 400;
        this.turnwise = opts.turnwise ?? 1;
    }
    think(input) {
        if (input.target != null) {
            let target = new Vector(input.target.x, input.target.y);
            // Set target
            let distanceToRange = target.length - this.orbitRange,
                targetBearing = util.clamp(distanceToRange / 200, -Math.PI / 2, Math.PI / 2) - Math.PI / 2 * this.turnwise,
                targetAngle = targetBearing + target.direction,
                newX = target.length * Math.cos(targetAngle),
                newY = target.length * Math.sin(targetAngle);
            // Set goal
            let dir = this.turnwise * target.direction + 0.05;
            let goal = {
                x: this.body.x + target.x - this.orbitRange * Math.cos(dir),
                y: this.body.y + target.y - this.orbitRange * Math.sin(dir),
            }
            
            return {
                goal,
                target: {x: newX, y: newY},
            }
        }
    }
}
ioTypes.circleTarget = io_circleTarget;

class io_bombingRun extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.goAgainRange = opts.goAgainRange ?? 1000;
        this.breakAwayRange = opts.breakAwayRange ?? 350;
        this.firingRange = opts.firingRange ?? 400;
        this.breakAwayAngle = opts.breakAwayAngle ?? 45;
        this.alwaysFireInRange = opts.alwaysFireInRange ?? false;
        // If we should continue to do bombing runs below 15% health
        this.bombAtLowHealth = opts.bombAtLowHealth ?? false;

        this.currentlyBombing = true;
        this.dodgeDirection = 0;
        this.storedAngle = 0;
        this.breakAwayAngle *= Math.PI / 180;
    }
    // Determine if the desired goal is within the bounds of the map
    validatePosition() {
        switch (c.ROOM_SETUP[1]) {
            case "map_siege_citadel":
            case "map_siege_fortress":
                // Clamp to center square
                return this.body.x > room.center.x * 0.5 &&
                    this.body.x < room.center.x * 1.5 && 
                    this.body.y > room.center.y * 0.5 &&
                    this.body.y < room.center.y * 1.5
            case "map_siege_blitz":
                // Clamp to right rectangle
                return this.body.x > room.center.x * 1.15 &&
                    this.body.x < room.center.x * 1.75 && 
                    this.body.y > room.center.y * 0.25 &&
                    this.body.y < room.center.y * 1.75
        }
    }
    think(input) {
        if (input.target != null) {
            let target = new Vector(input.target.x, input.target.y);
            // Set status
            if (target.length < this.breakAwayRange || (!this.bombAtLowHealth && this.body.health.display < 0.2)) {
                this.currentlyBombing = false;
            }
            if (target.length > this.goAgainRange && (this.bombAtLowHealth || this.body.health.display() > 0.65) || !this.validatePosition()) {
                this.currentlyBombing = true;
            }

            let goal, 
                newX = target.x, 
                newY = target.y,
                fire = true;
            if (this.currentlyBombing) {
                goal = {
                    x: target.x + this.body.x,
                    y: target.y + this.body.y,
                };
                this.storedAngle = this.body.facing;
                this.dodgeDirection = this.breakAwayAngle * (ran.random(1) < 0.5 ? 1 : -1);
            } else {
                let exitAngle = this.storedAngle + this.dodgeDirection;
                newX = target.x + this.goAgainRange * Math.cos(exitAngle);
                newY = target.y + this.goAgainRange * Math.sin(exitAngle);
                goal = {
                    x: newX + this.body.x,
                    y: newY + this.body.y,
                };
                // Avoid twitching when at the turnaround range
                if ((newX ** 2 + newY ** 2) < 900) {
                    newX = target.x;
                    newY = target.y;
                    fire = false;
                }
            }
            
            return {
                goal,
                target: {x: newX, y: newY},
                fire,
                alt: (this.alwaysFireInRange || this.currentlyBombing) && target.length < this.firingRange,
            }
        }
    }
}
ioTypes.bombingRun = io_bombingRun;

class io_drag extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.idealRange = opts.range ?? 400;
        this.useAlt = opts.useAlt ?? false;
        this.runAwayDistance = opts.runRange ?? (this.idealRange / 2.5);
        this.turnwise = 0;
    }
    clampGoal(goal) {
        let x = goal.x;
        let y = goal.y;
        
        switch (c.ROOM_SETUP[1]) {
            case "map_siege_citadel":
            case "map_siege_fortress":
                // Clamp to center square
                x = util.clamp(x, room.center.x * 0.5, room.center.x * 1.5);
                y = util.clamp(y, room.center.y * 0.5, room.center.y * 1.5);
                break;
            case "map_siege_blitz":
                // Clamp to right rectangle
                x = util.clamp(x, room.center.x * 1.15, room.center.x * 1.75);
                y = util.clamp(y, room.center.y * 0.25, room.center.y * 1.75);
                break;
        }
        
        return {x, y};
    }
    think(input) {
        if (input.target == null || !input.main) {
            return {};
        }
        let sizeFactor = this.body.master.size / this.body.master.SIZE,
            orbit = this.idealRange * sizeFactor,
            goal,
            power = 1,
            nearestEntity = input.target.nearestEntity,
            target = new Vector(input.target.x, input.target.y);
        
        if (input.main) {
            // Avoid nearest if provided
            if (nearestEntity) {
                let relativeX = nearestEntity.x - this.body.x;
                let relativeY = nearestEntity.y - this.body.y;
                let distance = Math.sqrt(relativeX ** 2 + relativeY ** 2);
                
                // Only run if close
                if (distance < (this.runAwayDistance * sizeFactor + this.body.master.size)) {
                    let angleToNearest = Math.atan2(relativeY, relativeX);
                    let relativeAngleToNearest = util.angleDifference(angleToNearest, target.direction);
                    if (relativeAngleToNearest < 0 & relativeAngleToNearest > Math.PI * -1.8) {
                        this.turnwise = 0.2;
                    } else if (relativeAngleToNearest > 0 & relativeAngleToNearest < Math.PI * 1.8) {
                        this.turnwise = -0.2;
                    }
                } else {
                    this.turnwise = 0;
                }
            } else {
                this.turnwise = 0;
            }

            // Sit at range from point
            let dir = target.direction;
            goal = {
                x: this.body.x + target.x - orbit * Math.cos(dir + this.turnwise),
                y: this.body.y + target.y - orbit * Math.sin(dir + this.turnwise),
            }

            // Clamp goal to in-bounds area
            goal = this.clampGoal(goal);

            // Decelerate when close to goal
            let distanceToGoal = Math.sqrt((goal.x - this.body.x) ** 2 + (goal.y - this.body.y) ** 2);
            if (distanceToGoal < this.body.size * 2) {
                power = Math.max(0, 1 - distanceToGoal / this.body.size);
            }
        }
        return {
            fire: !this.useAlt | target.length >= (orbit + 50),
            alt: this.useAlt && target.length <= (orbit + 100),
            goal,
            power,
        }
    }
}
ioTypes.drag = io_drag;

class io_missileGuidance extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.slowTurnDelay = opts.slowTurnDelay || 0;
        this.fastTurnDelay = opts.fastTurnDelay || 1000;
        this.slowTurnRate = opts.slowTurnRate || 0.045;

        this.initTime = Date.now();
    }
    think(input) {
        // If no target then exit
        if (!input.target) return;

        let lifetime = Date.now() - this.initTime;

        let currentAngle = this.body.facing;
        let target = new Vector(input.target.x, input.target.y);
        let desiredAngle = target.direction;
        let targetLength = target.length;

        let newX = 0, newY = 0;

        // If it's before the slow turn phase then don't turn and activate the secondary thruster
        if (lifetime < this.slowTurnDelay) {
            newX = targetLength * Math.cos(currentAngle);
            newY = targetLength * Math.sin(currentAngle);
            return {
                fire: true,
                alt: false,
                target: {x: newX, y: newY},
            }
        }

        this.body.facingType[0] = "toTarget";
        let angleDifference = util.angleDifference(currentAngle, desiredAngle);

        // If it's during the fast turn phase then cancel sideways velocity and activate the primary thruster
        if (lifetime > this.fastTurnDelay) {
            angleDifference = util.angleDifference(this.body.velocity.direction, desiredAngle);
            let newAngle = desiredAngle + util.clamp(angleDifference, -0.5, 0.5);
            newX = targetLength * Math.cos(newAngle);
            newY = targetLength * Math.sin(newAngle);
            return {
                fire: false,
                alt: true,
                target: {x: newX, y: newY},
            }
        }

        // Otherwise slowly turn to the target angle and activate the secondary thruster
        let turnRate = util.clamp(angleDifference, -this.slowTurnRate, this.slowTurnRate);
        let newAngle = currentAngle + turnRate;
        newX = targetLength * Math.cos(newAngle);
        newY = targetLength * Math.sin(newAngle);
        return {
            fire: true,
            alt: false,
            target: {x: newX, y: newY},
        }
    }
}
ioTypes.missileGuidance = io_missileGuidance;

class io_burstFire extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.useAlt = opts.alt ?? true;
        this.startDelay = opts.delay ?? 0;
        this.fireTime = opts.length ?? 700;

        this.timer = this.startDelay + this.fireTime + 1e5;
        this.initTime = 1;
        this.isBursting = false;
    }
    think(input) {
        let fireInput = this.useAlt ? input.alt : input.fire;

        if (fireInput && !this.isBursting) {
            this.initTime = Date.now();
            this.isBursting = true;
        }

        this.timer = Date.now() - this.initTime;
        if (this.isBursting && this.timer > this.startDelay + this.fireTime) {
            this.isBursting = false;
            return;
        }
        if (this.isBursting) {
            return {
                fire: !this.useAlt || input.fire,
                alt: this.useAlt || input.alt,
            }
        }
    }
}
ioTypes.burstFire = io_burstFire;

class io_underseerRepel extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.repelOffset = opts.repelOffset ?? 10;
        this.repelTriggerRange = opts.trigger ?? 175;
        this.baseRepelCenterDistance = opts.repelDistance ?? 1.5;
        this.repelAtDroneCount = opts.repelDrones ?? this.body.maxChildren;
        this.minDroneCount = opts.minDrones ?? this.body.maxChildren / 2;
        this.droneRepelStartDelay = opts.repelDelay ?? 700;

        this.actionId = 0;
        this.drones = [];
        /*
        0: waiting for drones
        1: repel stage 1
        2: repel stage 2
        3: squishing
        */
    }
    getDroneMeanDistance() {
        let meanDistance = 0;
        // Sample drones for mean distance
        for (let drone of this.drones) {
            let relativeX = drone.x - this.body.x;
            let relativeY = drone.y - this.body.y;
            let distance = Math.sqrt(relativeX ** 2 + relativeY ** 2);
            meanDistance += distance;
        }
        return meanDistance / this.drones.length;
    }
    getChildren() {
        if (this.body.maxChildren) {
            return this.body.children;
        }

        let children = [];
        for (let gun of this.body.guns) {
            if (gun.countsOwnKids) {
                children.push(...gun.children);
            }
        }
        return children;
    }
    think(input) {
        if (!input.fire && !input.alt || !input.target) {
            this.actionId = 0;
            return;
        }

        this.awaitDroneRange = this.body.size * 1.25;
        this.repelCenterDistance = this.baseRepelCenterDistance * this.body.size;
        this.drones = this.getChildren();

        let target = new Vector(input.target.x, input.target.y);
        let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE);
        let repelTriggerRange = this.repelTriggerRange * sizeFactor;

        let meanDistance = this.getDroneMeanDistance();
        if (this.actionId == 3 && meanDistance < target.length * 0.45) {
            this.actionId = 0;
        } else if (this.actionId == 0 && this.drones.length >= this.repelAtDroneCount && target.length <= repelTriggerRange) {
            setTimeout(() => this.actionId = 1, this.droneRepelStartDelay);
        } else if (this.actionId == 1 && meanDistance >= this.awaitDroneRange * 3) {
            this.actionId = 2;
        } else if (this.actionId == 2 && meanDistance >= (target.length + this.repelOffset)) {
            this.actionId = 3;
        }

        let newX, newY;
        switch (this.actionId) {
            case 0:
                newX = this.awaitDroneRange * Math.cos(target.direction);
                newY = this.awaitDroneRange * Math.sin(target.direction);
                return {
                    target: {x: newX, y: newY},
                    fire: true,
                    alt: false,
                }
            case 1:
                newX = -2 * this.awaitDroneRange * Math.cos(target.direction);
                newY = -2 * this.awaitDroneRange * Math.sin(target.direction);
                return {
                    target: {x: newX, y: newY},
                    fire: false,
                    alt: true,
                }
            case 2:
                newX = this.repelCenterDistance * Math.cos(target.direction);
                newY = this.repelCenterDistance * Math.sin(target.direction);
                return {
                    target: {x: newX, y: newY},
                    fire: false,
                    alt: true,
                }
            case 3:
                return {
                    fire: true,
                    alt: false,
                }
        }
    }
}
ioTypes.underseerRepel = io_underseerRepel;

class io_assemble extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.assembleBehindLimit = opts.behind ?? 3;
        this.assembleAheadLimit = opts.ahead ?? 7;
        this.assembleRange = opts.range ?? 400;
        this.hideDelay = opts.hideDelay ?? 1500;

        this.actionId = 0;
        this.assembleCount = 0;
        this.holdPos = {x: 0, y: 0};
        /*
        0: approaching target
        1: assembling behind
        2: moving behind trap
        3: assembling ahead
        4: assembling into the target
        */
    }
    getAssembleCount() {
        let children = [...this.body.children];
        for (let gun of this.body.guns) {
            if (gun.countsOwnKids) {
                children.push(...gun.children);
            }
        }
        for (let child of children) {
            if (child.assemblerLevel) {
                return child.assemblerLevel;
            }
        }
        return 0;
    }
    think(input) {
        if (!input.fire && !input.alt || !input.target) {
            this.actionId = 0;
            return;
        }

        let target = new Vector(input.target.x, input.target.y);
        let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE);

        if (this.actionId == 0 && target.length <= (this.assembleRange * sizeFactor + 100)) {
            this.actionId = 1;
        } else if (this.actionId == 1 && this.assembleCount >= this.assembleBehindLimit && this.assembleCount < this.assembleAheadLimit) {
            this.actionId = 2;
            this.holdPos = {
                x: this.body.x,
                y: this.body.y,
            }
            setTimeout(() => this.actionId = 3, this.hideDelay);
        } else if (this.actionId == 3 && this.assembleCount >= this.assembleAheadLimit) {
            this.actionId = 4;
        } else if (this.actionId == 4 && (this.assembleCount <= 1 || this.assembleCount >= this.assembleAheadLimit + 1)) {
            this.actionId = 0;
        }

        let newX, newY, goal;
        let bodySize = this.body.size;
        this.assembleCount = this.getAssembleCount();
        switch (this.actionId) {
            case 0:
                return {
                    fire: false
                };
            case 1:
                newX = bodySize * -2.5 * Math.cos(target.direction);
                newY = bodySize * -2.5 * Math.sin(target.direction);
                return {
                    target: {x: newX, y: newY},
                    fire: true,
                };
            case 2:
                newX = bodySize * 0.5 * Math.cos(target.direction);
                newY = bodySize * 0.5 * Math.sin(target.direction);
                goal = {
                    x: this.holdPos.x - bodySize * 5 * Math.cos(target.direction),
                    y: this.holdPos.y - bodySize * 5 * Math.sin(target.direction),
                }
                return {
                    target: {x: newX, y: newY},
                    goal,
                    fire: false,
                };
            case 3:
                newX = bodySize * 2.5 * Math.cos(target.direction);
                newY = bodySize * 2.5 * Math.sin(target.direction);
                goal = {
                    x: this.holdPos.x - bodySize * 5 * Math.cos(target.direction),
                    y: this.holdPos.y - bodySize * 5 * Math.sin(target.direction),
                }
                return {
                    target: {x: newX, y: newY},
                    goal,
                    fire: true,
                };
            case 4:
                goal = {
                    x: this.holdPos.x - bodySize * 5 * Math.cos(target.direction),
                    y: this.holdPos.y - bodySize * 5 * Math.sin(target.direction),
                }
                return {
                    goal,
                    fire: true
                }
        }
    }
}
ioTypes.assemble = io_assemble;

class io_targetSelection extends IO {
    constructor(body, opts = {}) {
        super(body);
        // go through all entities, assign their priority based on these weights, then shoot at the highest priorty one
        this.weights = {
            health: opts.health ?? 50, // health fraction 0-1
            score: opts.score ?? 0.001, // raw score
            danger: opts.danger ?? 5, // danger level
            isBoss: opts.isBoss ?? 50, // if it's a boss (includes rogues)
            isHealer: opts.isHealer ?? 25, // if it's a healer (geneva suggestion!)
            isSanctuary: opts.isSanctuary ?? 100, // if it's a sanctuary
            killCount: opts.kills ?? 10, // kill count
            cluster: opts.cluster ?? 10, // cluster score
        };
        this.targetsSameTeam = opts.sameTeam ?? false; // if we're a healer we should aim at allies
        this.avoidNearest = opts.avoidNearest ?? true; // run from the nearest valid target
        this.lastPriority = -1e50 // Intentionally not -Infinity so anything below this is ignored
        this.targetedEntity = undefined;
        this.nearestEntity = undefined;
        this.tick = ran.irandom(20);
    }
    baseValidation(e) {
        return (e.health.amount > 0) && // is alive
        (e.master.master.id != this.body.master.master.id) && // is something different
        (!e.master.master.ignoredByAi) && // should not be ignored
        (!isNaN(e.dangerValue)) && // has a danger value
        (!e.invuln && !e.master.master.passive && !this.body.master.master.passive) && // should be aimed at
        (this.body.aiSettings.seeInvisible || this.body.isArenaCloser || e.alpha > 0.5) && // is visible enough
        (this.body.aiSettings.BLIND || this.body.aiSettings.SKYNET || ((e.x - this.body.x) ** 2 < this.fovRange && (e.y - this.body.y) ** 2 < this.fovRange)) && // is within range
        (this.body.aiSettings.SKYNET || ((e.x - this.body.master.master.x) ** 2 < this.masterFovRange && (e.y - this.body.master.master.y) ** 2 < this.masterFovRange)); // is within master's range
    }
    getPriority(entity) {
        let priority = 0;
        priority += entity.health.display() * this.weights.health;
        priority += entity.skill.score * this.weights.score;
        priority += entity.dangerValue * this.weights.danger;
        priority += (entity.type === "miniboss") * this.weights.isBoss;
        priority += entity.isHealer * this.weights.isHealer;
        priority += (entity.label === "Sanctuary") * this.weights.isSanctuary;
        priority += (entity.killCount.solo + entity.killCount.assists * 0.5 + entity.killCount.bosses * 5) * this.weights.killCount;
        priority += entity.clusterScore * this.weights.cluster;
        return priority;
    }
    findTarget() {
        let greatestPriority = this.lastPriority; // Only retarget if the new priority is greater
        let shortestDistance = Infinity;
        let targetList;
        if (this.body.team == TEAM_ENEMIES && this.targetsSameTeam || this.body.team == TEAM_BLUE && !this.targetsSameTeam) {
            targetList = enemyTeamEntities;
        } else {
            targetList = playerTeamEntities;
        }
        for (let entity of targetList) {
            // Base validation
            if (!this.baseValidation(entity)) {
                continue;
            }
            // Firing arc validation
            if (
                this.body.firingArc != null && // has a firing arc
                !this.body.aiSettings.view360 && // has a firing arc x2
                Math.abs(util.angleDifference(util.getDirection(this.body, entity), this.body.firingArc[0])) >= this.body.firingArc[1] // isn't in firing arc
            ) {
                continue;
            }
            // Find greatest priority
            let priority = this.getPriority(entity);
            if (!isNaN(priority) && priority > greatestPriority) {
                greatestPriority = priority;
                this.targetedEntity = entity;
            }
            // Find shortest distance
            let distance = Math.sqrt((this.body.x - entity.x) ** 2 + (this.body.y - entity.y) ** 2);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                this.nearestEntity = entity;
            }
        }
        this.lastPriority = Math.max(-1e50, greatestPriority * (greatestPriority > 0 ? 2 : 0.5)); // Factor of 2 to stick with current target for longer (1/2 for negative priorities), clamped to -1e50 to preserve ignoring behavior
    }
    think(input) {
        // Override target lock upon other commands
        if (input.main || input.alt || this.body.master.autoOverride) {
            this.targetedEntity = undefined;
            return {};
        }

        this.fovRange = this.body.fov ** 2;
        if (!isFinite(this.fovRange)) {
            this.fovRange = (640 * this.body.FOV) ** 2;
        }
        this.masterFovRange = this.body.master.master.fov ** 2;
        if (!isFinite(this.masterFovRange)) {
            this.masterFovRange = (640 * this.body.master.master.FOV) ** 2;
        }

        // Check status of existing target
        if (this.targetedEntity) {
            // Base validation
            if (!this.baseValidation(this.targetedEntity)) {
                this.targetedEntity = undefined;
                this.lastPriority = -1e50; // Reset
            }
            // Firing arc validation
            else if (
                this.body.firingArc != null && // has a firing arc
                !this.body.aiSettings.view360 && // has a firing arc x2
                Math.abs(util.angleDifference(util.getDirection(this.body, this.targetedEntity), this.body.firingArc[0])) >= this.body.firingArc[1] // isn't in firing arc
            ) {
                this.targetedEntity = undefined;
            }
        }

        // Infrequently recheck target
        if (this.tick++ > 10 * c.runSpeed || !this.targetedEntity) {
            this.findTarget();
            this.tick = 0;
        }

        if (!this.targetedEntity) {
            return {}
        }

        let target = {
            x: this.targetedEntity.x - this.body.x, 
            y: this.targetedEntity.y - this.body.y, 
            velocity: this.targetedEntity.velocity
        };

        if (this.avoidNearest) {
            target.nearestEntity = this.nearestEntity;
        }

        return {
            target,
            fire: true,
            main: true
        }
    }
}
ioTypes.targetSelection = io_targetSelection;

class io_targetPrediction extends IO {
    constructor(body) {
        super(body);
        // Always accounts for movement - simply omit this controller for no prediction
        this.tick = ran.irandom(4);
        this.leadTime = undefined;
    }
    think(input) {
        let target = input.target;
        if (!target) return;

        let targetVelocity = target.velocity;
        // Update lead time occasonally
        if (this.leadTime === undefined || this.tick++ % 4 == 0) {
            let interceptSpeed = this.body.topSpeed;
            if (!this.body.aiSettings.chase) {
                for (let i = 0; i < this.body.guns.length; i++) {
                    if (!this.body.guns[i].canShoot) continue;

                    let v = this.body.guns[i].getTracking();
                    if (v.speed == 0 || v.range == 0) continue;

                    interceptSpeed = v.speed;
                    break;
                }
            }
            if (!Number.isFinite(interceptSpeed)) {
                interceptSpeed = this.body.topSpeed + 0.01;
            }

            this.leadTime = timeOfImpact(target, targetVelocity, interceptSpeed)
        }
        return {
            target: {
                x: target.x + this.leadTime * targetVelocity.x,
                y: target.y + this.leadTime * targetVelocity.y,
            },
            fire: true,
            main: true
        };
    }
}
ioTypes.targetPrediction = io_targetPrediction;
