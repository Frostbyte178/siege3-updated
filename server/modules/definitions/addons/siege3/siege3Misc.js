const { combineStats, makeAuto, weaponArray } = require('../../facilitators.js');
const { base, gunCalcNames } = require('../../constants.js');
const g = require('../../gunvals.js');

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
Class.assassinTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0]
        }
    ]
}
Class.fireworkTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
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
Class.eliteNailgunTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    BODY: { FOV: 2 },
    CONTROLLERS: [ "canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster" ],
    COLOR: -1,
    INDEPENDENT: true,
    GUNS: [{
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.3, maxSpeed: 1.3, reload: 0.75}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.3, maxSpeed: 1.3, reload: 0.75}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {speed: 1.3, maxSpeed: 1.3, reload: 0.75}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
}
Class.sidewinderTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
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
Class.irrigatorTurret = {
    PARENT: "genericTank",
    COLOR: 16,
    MIRROR_MASTER_ANGLE: true,
    GUNS: [
        {
            POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, damage: 0.5, size: 0.7, range: 1.1, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.35}, CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1400}]]}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
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
    COLOR: -1,
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
    BODY: {FOV: 3 * base.FOV},
    COLOR: -1,
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
    LABEL: "Turret",
    CONTROLLERS: ['nearestDifferentMaster'],
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
Class.pounderTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [
        {
            POSITION: [20.5, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        }
    ]
}
