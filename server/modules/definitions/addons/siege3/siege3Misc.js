const { combineStats, makeAuto, weaponArray } = require('../../facilitators.js');
const { base, gunCalcNames } = require('../../constants.js');
const g = require('../../gunvals.js');

// Controllers
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
        this.goAgainRange = opts.goAgainRange ?? 1200;
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
    think(input) {
        if (input.target != null) {
            let target = new Vector(input.target.x, input.target.y);
            // Set status
            if (target.length < this.breakAwayRange) this.currentlyBombing = false;
            if (target.length > this.goAgainRange && (this.bombAtLowHealth || this.body.health.display() > 0.15)) this.currentlyBombing = true;

            let goal, 
                newX = target.x, 
                newY = target.y;
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
                if ((goal.x ** 2 + goal.y ** 2) < 400) {
                    newX = target.x;
                    newY = target.y;
                }
            }
            
            return {
                goal,
                target: {x: newX, y: newY},
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
    }
    think(input) {
        if (input.target != null && input.main) {
            let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE),
                orbit = this.idealRange * sizeFactor,
                goal,
                power = 1,
                target = new Vector(input.target.x, input.target.y);
            if (input.main) {
                // Sit at range from point
                let dir = target.direction;
                goal = {
                    x: this.body.x + target.x - orbit * Math.cos(dir),
                    y: this.body.y + target.y - orbit * Math.sin(dir),
                }
                if (Math.abs(target.length - orbit) < this.body.size * 2) {
                    power = 0.7
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

// Projectiles
Class.trueBomb = {
    PARENT: "bullet",
    GUNS: [
        {
            POSITION: [0, 10, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0, range: 0.05, health: 1e6, size: 16, damage: 1.2}]),
                TYPE: ["bullet", { MOTION_TYPE: "withMaster", COLOR: 2, PERSISTS_AFTER_DEATH: true, ALPHA: 0.6 }],
                SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: gunCalcNames.sustained,
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [12.5, 0, 0, 0, 0, 1],
            TYPE: ["egg", {COLOR: 16}]
        },
    ]
}
Class.autoTrap = makeAuto('trap', "Auto-Trap", {type: 'droneAutoTurret'});
Class.bigminimissile = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, 0, 180, 1.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.skimmer, g.lowPower, { recoil: 1.35 }, { speed: 1.3, maxSeed: 1.3 }]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: gunCalcNames.thruster,
            },
        },
    ],
}
Class.homingMissile = {
    PARENT: "bullet",
    LABEL: "Homing Missile",
    BODY: { FOV: 10, SPEED: 2, RANGE: 100 },
    CONTROLLERS: ["nearestDifferentMaster", "missileGuidance"],
    FACING_TYPE: "withMotion",
    AI: {chase: true, SKYNET: true, },
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [16.5, 10, 1.5, 0, 0, 180, 0],
        PROPERTIES: {
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 1.6, recoil: 0.8}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        },
    }, {
        POSITION: [16.5, 10, 1.5, 0, 0, 180, 0],
        PROPERTIES: {
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 0.8, recoil: 1.15}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            ALT_FIRE: true,
        },
    }],
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 0, 1],
        TYPE: ["triangle", {COLOR: 16}]
    }]
}
Class.fireworkRocket = {
    PARENT: "missile",
    LABEL: "Firework Rocket",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [16.5, 10, 1.5, 0, 0, 180, 7.5],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {recoil: 1.25}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        }
    }, ...weaponArray({
        POSITION: [8, 2.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.flankGuard, {spray: 0, shudder: 0}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            ALT_FIRE: true,
        }
    }, 12)],
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 0, 1],
        TYPE: [ "egg", { COLOR: 16 }, ],
    }],
    ON: [{
        event: 'death',
        handler: ({body}) => {
            if (body.range > 0) return;

            for (let gun of body.guns) {
                if (!gun.altFire) continue;
                gun.spawnBullets();
            }
        }
    }]
};

// Turrets
Class.fireworkTurret = {
    PARENT: "genericTank",
    LABEL: "Skimmer",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, { range: 0.9, reload: 1.5 }]),
                TYPE: "fireworkRocket",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        }, {
            POSITION: [10, 9.5, 1.4, 8, 0, 0, 0],
        },
    ],
};
Class.builderTurret = {
    PARENT: "genericTank",
    INDEPENDENT: true,
    COLOR: 'purple',
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        }, {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.setTrap, { speed: 2.5 }]),
                TYPE: "unsetTrap",
                AUTOFIRE: true,
            },
        },
    ],
};
Class.superNailgunTurret = {
    PARENT: "genericTank",
    LABEL: "Nailgun",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.1, maxSpeed: 1.1}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.1, maxSpeed: 1.1}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.1, maxSpeed: 1.1}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
}
Class.sidewinderTurret = {
    PARENT: "genericTank",
    LABEL: "Nailgun",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [10, 11.5, -0.5, 14, 0, 0, 0],
        }, {
            POSITION: [21, 12.5, -1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.assassin, g.assassin, g.hunter, g.sidewinder, {health: 1.5, reload: 0.65}]),
                TYPE: "snakeOld",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
}
Class.homingMissileTurret = {
    PARENT: "genericTank",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, maxSpeed: 2, damage: 0.3, size: 0.7, range: 1.4, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.7}}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                AUTOFIRE: true,
            },
        }, {
            POSITION: [17, 18, 0.65, 0, 0, 0, 0],
        }, {
            POSITION: [13.5, 13, -0.55, 0, 0, 0, 0],
        },
    ],
}
Class.undertowTurret = {
    PARENT: "genericTank",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [14, 15, 0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, {damage: 1/2, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [5, 13, 0, 4, -7.5, 82.5, 0],
        }, {
            POSITION: [5, 13, 0, 4, 7.5, -82.5, 0],
        },
    ],
}
Class.nestIndustryTop = {
    PARENT: "genericTank",
    COLOR: 14,
    INDEPENDENT: true,
    CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
    GUNS: weaponArray({
        POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.flankGuard, g.flankGuard]),
            TYPE: 'autoswarm',
            STAT_CALCULATOR: gunCalcNames.swarm,
            AUTOFIRE: true,
        },
    }, 10, 0.5),
};
Class.flameTurret = {
    PARENT: "genericTank",
    LABEL: "Flamethrower",
    COLOR: 14,
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [12, 11, 1.2, 3, 0, 0, 0],
        }, {
            POSITION: [12, 8, 1.25, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.machineGun, {reload: 1.5, spray: 0.2, shudder: 0.1, speed: 3, maxSpeed: 3, range: 0.25, damage: 5, health: 0.2}]),
                TYPE: "growBullet",
                AUTOFIRE: true,
            }
        }
    ],
};
Class.predatorTurret = {
    PARENT: "genericTank",
    LABEL: "Flamethrower",
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 14,
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator, {range: 2, reload: 0.85}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [21, 11, 1, 0, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.hunterSecondary, g.predator, {range: 2, reload: 0.85}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [18, 14, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.predator, {range: 2, reload: 0.85}]),
                TYPE: "bullet"
            }
        }
    ],
};
Class.culverinTurret = {
    PARENT: "genericTank",
    LABEL: "Shotgun",
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: 14,
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "casing",
            },
        }, {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "casing",
            },
        }, {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "casing",
            },
        }, {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "casing",
            },
        }, {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {shudder: 3, spray: 2}, g.shotgun]),
                TYPE: "casing",
            },
        }, {
            POSITION: [17, 14, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, g.shotgun, g.fake]),
                TYPE: "casing",
            },
        }, {
            POSITION: [8, 14, -1.3, 4, 0, 0, 0],
        },
    ],
};
Class.topplerTurret = {
    PARENT: 'genericTank',
    COLOR: 14,
    INDEPENDENT: true,
    CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [
        {
            POSITION: [20, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minigun, {reload: 1.15}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            }
        }, {
            POSITION: [18, 14, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minigun, {reload: 1.15}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            }
        }, {
            POSITION: [16, 14, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minigun, {reload: 1.15}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            }
        }
    ]
}
Class.eliteSniperTurret = {
    PARENT: 'genericTank',
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    LABEL: 'Turret',
    GUNS: [
        {
            POSITION: [28, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, {reload: 1.2, health: 1.2}]),
                TYPE: "bullet",
                ALT_FIRE: true
            }
        },
        {
            POSITION: [5, 9, -1.4, 8, 0, 0, 0]
        }
    ]
}
Class.boomerTurretWeak = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Turret",
    CONTROLLERS: ['nearestDifferentMaster'],
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [19, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [6, 10, -1.5, 7, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, {reload: 2, speed: 3}]),
                TYPE: "boomerang",
                STAT_CALCULATOR: gunCalcNames.block
            },
        },
    ],
}
