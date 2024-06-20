const { combineStats, skillSet, menu } = require('../../facilitators.js');
const { base, gunCalcNames } = require('../../constants.js');
const g = require('../../gunvals.js');

const harvesterStats = {
    FOV: 2,
    SPEED: 0.65 * base.SPEED,
    HEALTH: 5 * base.HEALTH,
    DAMAGE: 1.75 * base.DAMAGE,
    SHIELD: 2 * base.SHIELD,
    // Elite stats for reference:
    // FOV: 1.25,
    // SPEED: 0.1 * base.SPEED,
    // HEALTH: 7 * base.HEALTH,
    // DAMAGE: 2.5 * base.DAMAGE,
};

function addThruster(recoilFactor = 2) {
    return [
        {
            POSITION: [12.5, 14, -0.5, 3, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: recoilFactor, size: 0.45}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9, 8.5, 0.001, 6, 1.5, -152, 0],
        }, {
            POSITION: [9, 8.5, 0.001, 6, -1.5, 152, 0],
        }
    ]
}

Class.genericHarvester = {
    PARENT: "genericBoss",
    FACING_TYPE: "toTarget",
    BODY: harvesterStats,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 22,
    VALUE: 3e5,
    FORCE_TWIGGLE: true,
    AI: {IGNORE_SHAPES: true},
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
}

// Rushdown destroyer + bombs
Class.furrower = {
    PARENT: "genericHarvester",
    LABEL: "Furrower",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: -25, // 75
        isHealer: 0, // -25
        isSanctuary: -1e80, // 100
        killCount: 2.5, // 2.5
        cluster: -0.5, // 2
    }], "bombingRun"],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.75,
        SPEED: harvesterStats.SPEED * 1.75,
    },
    AI: {IGNORE_SHAPES: true, BLIND: true, chase: true},
    GUNS: [
        { // Bomb launchers
            POSITION: [5, 5, 1, 8.5, 7, 12, 0],
        }, {
            POSITION: [10, 6.5, 1.4, 1.5, 7, 12, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, {range: 0.3, speed: 2, maxSpeed: 0.4, size: 1.2, reload: 2.2, damage: 0.8, recoil: 0.15}]),
                TYPE: "trueBomb",
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, {
            POSITION: [5, 5, 1, 8.5, -7, -12, 0],
        }, {
            POSITION: [10, 6.5, 1.4, 1.5, -7, -12, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, {range: 0.3, speed: 2, maxSpeed: 0.4, size: 1.2, reload: 2.2, damage: 0.8, recoil: 0.15}]),
                TYPE: "trueBomb",
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, { // Destroyer
            POSITION: [18, 9.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, {speed: 1.6, maxSpeed: 1.3, health: 0.7, reload: 1.5, recoil: 0.15}]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        },
        ...addThruster(2),
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}

// Circler with bombs
Class.pressurizerTurret = {
    PARENT: "genericTank",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {FOV: 15},
    AI: {IGNORE_SHAPES: true, chase: true},
    COLOR: 16,
    GUNS: [
        {
            POSITION: [12, 9, 1, 9, 0, 0, 0],
        }, {
            POSITION: [13, 12.5, 1.4, 5, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, {damage: 0.8, range: 0.65, speed: 2.5, maxSpeed: 0.55, size: 1.4, reload: 1.8, recoil: 0.15}]),
                TYPE: "trueBomb",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        }, 
    ]
}
Class.pressurizer = {
    PARENT: "genericHarvester",
    LABEL: "Pressurizer",
    CONTROLLERS: [["targetSelection", {
        health: 150, // 150
        score: 0.00125, // 0.00075
        danger: 5, // 5
        isBoss: 25, // 75
        isHealer: 0, // -25
        isSanctuary: -125, // 100
        killCount: 2.5, // 2.5
        cluster: 3, // 2
    }], "circleTarget"],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.8,
        SPEED: harvesterStats.SPEED * 1.5,
        SHIELD: harvesterStats.SHIELD * 1.3,
    },
    AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
    GUNS: [
        {
            POSITION: [13, 12, 0.001, 6, 0, 0, 0],
        }, { // Machine traps
            POSITION: [12.5, 8, 1, 0, 0, 60, 0]
        }, {
            POSITION: [2.5, 8, 1.55, 12.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 0.7, maxSpeed: 0.7 }, {size: 0.95, damage: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            }
        }, {
            POSITION: [12.5, 8, 1, 0, 0, -60, 0]
        }, {
            POSITION: [2.5, 8, 1.55, 12.5, 0, -60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 0.7, maxSpeed: 0.7 }, {size: 0.95, damage: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            }
        },
        ...addThruster(1.8),
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }, {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "pressurizerTurret"
        }
    ]
}

// Wall maker
Class.stockyard = {
    PARENT: "genericHarvester",
    LABEL: "Stockyard",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: -25, // 75
        isHealer: 0, // -25
        isSanctuary: -1e80, // 100
        killCount: 2.5, // 2.5
        cluster: -0.5, // 2
    }], ["bombingRun", {breakAwayAngle: 10, alwaysFireInRange: true}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.75,
        SPEED: harvesterStats.SPEED * 1.6,
        SHIELD: harvesterStats.SHIELD * 1.3,
    },
    AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
    GUNS: [
        { // Shockwave
            POSITION: [14, 12, -0.7, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, {speed: 0.5, health: 2, density: 3, spray: 0.5, size: 0.5, shudder: 0.1}]),
                TYPE: "bullet",
            }
        }, { // Thrusters
            POSITION: [12.5, 7.5, -0.5, 1, -5, 165, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 1, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [12.5, 7.5, -0.5, 1, 5, -165, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 1, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [7, 6.5, 0.001, 6, 2.5, -130, 0],
        }, {
            POSITION: [7, 6.5, 0.001, 6, -2.5, 130, 0],
        }, { // Block layer
            POSITION: [13.5, 10, -0.4, 0, 0, 180, 0]
        }, {
            POSITION: [1.5, 10, 1.3, 13.5, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.machineGun, g.machineGun, {health: 1.85, reload: 0.55, spray: 0.3}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: gunCalcNames.block,
                ALT_FIRE: true,
            }
        },
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}

// MIRV
Class.irrigator = {
    PARENT: "genericHarvester",
    LABEL: "Irrigator",
    CONTROLLERS: [["targetSelection", {
        health: 100, // 150
        score: 0.00175, // 0.00075
        danger: 5, // 5
        isBoss: 100, // 75
        isHealer: 25, // -25
        isSanctuary: -75, // 100
        killCount: 3, // 2.5
        cluster: 1.5, // 2
    }], ["drag", {range: 1100, useAlt: true}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 1.5,
        SPEED: harvesterStats.SPEED,
        SHIELD: harvesterStats.SHIELD * 1.7,
        FOV: harvesterStats.FOV * 0.7,
    },
    AI: {IGNORE_SHAPES: true, SKYNET: true},
    GUNS: [
        { // BR Missile
            POSITION: [9, 7, -0.7, 6, 3, 55, 0.18],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, damage: 0.4, size: 0.7, range: 1.1, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.35}, CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1700}]]}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, {
            POSITION: [17, 10.5, 0.65, -4, 3, 55, 0],
        }, {
            POSITION: [13.5, 7.5, -0.55, -4, 3, 55, 0],
        }, { // BL Missile
            POSITION: [9, 7, -0.7, 6, -3, -55, 0.18],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, damage: 0.4, size: 0.7, range: 1.1, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.35}, CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1700}]]}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, {
            POSITION: [17, 10.5, 0.65, -4, -3, -55, 0],
        }, {
            POSITION: [13.5, 7.5, -0.55, -4, -3, -55, 0],
        }, { // FR Missile
            POSITION: [9, 7, -0.7, 7.5, 1, 25, 0.06],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, damage: 0.4, size: 0.7, range: 1.1, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.35}, CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1400}]]}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, {
            POSITION: [17, 10.5, 0.65, -2.5, 1, 25, 0],
        }, {
            POSITION: [13.5, 7.5, -0.55, -2.5, 1, 25, 0],
        }, { // FL Missile
            POSITION: [9, 7, -0.7, 7.5, -1, -25, 0.06],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 8, damage: 0.5, size: 0.7, range: 1.1, reload: 3.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.35}, CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1400}]]}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, {
            POSITION: [17, 10.5, 0.65, -2.5, -1, -25, 0],
        }, {
            POSITION: [13.5, 7.5, -0.55, -2.5, -1, -25, 0],
        }, 
        ...addThruster(2)
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}
g.quarterstaff = { reload: 3, health: 1.6, speed: 1.3, spray: 1.5 }
Class.quarterstaff = {
    PARENT: "genericHarvester",
    LABEL: "Quarterstaff",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: -25, // 75
        isHealer: 0, // -25
        isSanctuary: -1e80, // 100
        killCount: 2.5, // 2.5
        cluster: -0.5, // 2
    }], ["bombingRun", {goAgainRange: 1200, firingRange: 550, breakAwayRange: 400, alwaysFireInRange: true}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.7,
        SPEED: harvesterStats.SPEED * 1.8,
        FOV: harvesterStats.FOV * 1.2,
    },
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.8, // Default 0.2
        atk: 0.3,
        hlt: 0.7, // Default 1
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: {IGNORE_SHAPES: true, BLIND: true, SKYNET: true, chase: true},
    GUNS: [
        { // Shotgun of 15 bullets
            POSITION: [4, 3, 1, 11, -3, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [4, 3, 1, 11, 3, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [4, 4, 1, 13, 0, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 4, 1, 12, -1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 4, 1, 11, 1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 3, 1, 13, -1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 3, 1, 13, 1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 2, 1, 13, 2, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 2, 1, 13, -2, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, { // New guns
            POSITION: [1, 4, 1, 11, 3, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 3, 1, 12, -2, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 2, 1, 11, 0, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 4, 1, 13, 0, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "bullet",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 3, 1, 12, 1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [1, 3, 1, 12, 1, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [15, 11, 1, 6, 0, 0, 0.05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.quarterstaff, g.fake]),
                TYPE: "casing",
                ALT_FIRE: true,
            },
        }, {
            POSITION: [8, 11, -1.3, 4, 0, 0, 0],
        }, { // Thrusters
            POSITION: [12.5, 7.5, -0.5, 1, -5, 160, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 1.1, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [12.5, 7.5, -0.5, 1, 5, -160, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 1.1, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [7, 6.5, 0.001, 6, 2.5, -125, 0],
        }, {
            POSITION: [7, 6.5, 0.001, 6, -2.5, 125, 0],
        }, { // Bomb launcher
            POSITION: [10, 7, 1, 9, 0, 180, 0],
        }, {
            POSITION: [11, 10.5, 1.4, 5, 0, 180, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, {range: 0.22, speed: 1.9, maxSpeed: 0.4, size: 1.4, reload: 3, recoil: 0.6}]),
                TYPE: "trueBomb",
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        }, 
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}
g.shepherd = {range: 0.25, speed: 1.5, maxSpeed: 0.2, size: 1.2, reload: 0.7, recoil: 0.15}
Class.shepherd = {
    PARENT: "genericHarvester",
    LABEL: "Shepherd",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: -25, // 75
        isHealer: 0, // -25
        isSanctuary: -1e80, // 100
        killCount: 2.5, // 2.5
        cluster: -0.5, // 2
    }], ["bombingRun", {goAgainRange: 1300, firingRange: 525, breakAwayRange: 450, breakAwayAngle: 6}], ["burstFire", {alt: true, length: 1750}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.8,
        SPEED: harvesterStats.SPEED * 1.65,
        FOV: harvesterStats.FOV * 1.2,
    },
    AI: {IGNORE_SHAPES: true, BLIND: true, SKYNET: true, chase: true},
    GUNS: [
        { // Bomb launcher
            POSITION: [7.5, 7.75, 1, 12.5, 0, 0, 0],
        }, {
            POSITION: [12, 10, 1.4, 5.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.shepherd]),
                TYPE: "trueBomb",
                STAT_CALCULATOR: gunCalcNames.sustained,
                ALT_FIRE: true,
            },
        },
        ...addThruster(2),
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}
Class.sniperPillboxTurret = {
    PARENT: "autoTurret",
    LABEL: "",
    BODY: {
        FOV: 10,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [29, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1 }, {reload: 1.2, health: 1.55, speed: 0.8, maxSpeed: 0.8, range: 1.75}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [5, 10, -1.6, 8.5, 0, 0, 0],
        },
    ],
}
Class.sniperPillbox = {
    PARENT: 'unsetTrap',
    LABEL: "Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    DIE_AT_RANGE: true,
    INDEPENDENT: true,
    BODY: {FOV: 5},
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "sniperPillboxTurret",
        },
    ],
};
Class.scarecrow = {
    PARENT: "genericHarvester",
    LABEL: "Scarecrow",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: -0.5, // 2
    }], ["drag", {range: 1250, useAlt: true}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 1.5,
        SPEED: harvesterStats.SPEED,
        SHIELD: harvesterStats.SHIELD * 1.7,
        FOV: harvesterStats.FOV * 2,
    },
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.8, // Default 0.2
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: {IGNORE_SHAPES: true, SKYNET: true},
    GUNS: [
        {
            POSITION: [28, 9.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.pounder, {reload: 1.55, damage: 1.6, health: 1.1, speed: 1.45, maxSpeed: 1.45, range: 1.2}]),
                TYPE: "bullet",
                ALT_FIRE: true,
            }
        }, {
            POSITION: [5, 9.5, -1.4, 8, 0, 0, 0]
        }, {
            POSITION: [13, 8, 1, 0, 0, 60, 0]
        }, {
            POSITION: [3, 8, 1.5, 13, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {reload: 1.3, speed: 1.3}]),
                TYPE: "sniperPillbox",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            }
        }, {
            POSITION: [13, 8, 1, 0, 0, -60, 0]
        }, {
            POSITION: [3, 8, 1.5, 13, 0, -60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {reload: 1.3, speed: 1.3}]),
                TYPE: "sniperPillbox",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            }
        },
        ...addThruster(1.6)
    ],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }
    ]
}
Class.cultivatorTurret = {
    PARENT: "genericTank",
    CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc"],
    INDEPENDENT: true,
    BODY: {FOV: 15},
    AI: {IGNORE_SHAPES: true},
    COLOR: 16,
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 10, 0, 0, 0],
        }, {
            POSITION: [18, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.3}]),
                TYPE: "missile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ]
}
Class.cultivator = {
    PARENT: "genericHarvester",
    LABEL: "Cultivator",
    CONTROLLERS: [["targetSelection", {
        health: 150, // 150
        score: 0.00125, // 0.00075
        danger: 5, // 5
        isBoss: 25, // 75
        isHealer: 0, // -25
        isSanctuary: -125, // 100
        killCount: 2.5, // 2.5
        cluster: 3, // 2
    }], ["circleTarget", {range: 475}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 0.8,
        SPEED: harvesterStats.SPEED * 1.4,
        SHIELD: harvesterStats.SHIELD * 1.3,
    },
    AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
    GUNS: [
        {
            POSITION: [13, 12, 0.001, 6, 0, 0, 0],
        }, {
            POSITION: [3, 9, 0.75, 9, 0, 60, 0],
        }, {
            POSITION: [3, 9, 0.75, 9, 0, -60, 0],
        }, { // Thrusters
            POSITION: [12.5, 7.5, -0.5, 1, -5, 165, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 0.85, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [12.5, 7.5, -0.5, 1, 5, -165, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.triAngle, g.thruster, {reload: 0.7, recoil: 0.85, size: 0.8}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [7, 6.5, 0.001, 6, 2.5, -130, 0],
        }, {
            POSITION: [7, 6.5, 0.001, 6, -2.5, 130, 0],
        }, {
            POSITION: [13, 9.5, 1, 0, 0, 180, 0]
        }, {
            POSITION: [3, 9.5, 1.5, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, {reload: 1.45, health: 1.45, range: 0.9}]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            }
        },
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }, {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "cultivatorTurret"
        }
    ]
}

// Healer
Class.harrower = {
    PARENT: "genericHarvester",
    LABEL: "Harrower",
    CONTROLLERS: [["targetSelection", {
        health: -175, // 150
        score: 0.0015, // 0.00075
        danger: 10, // 5
        isBoss: 75, // 75
        isHealer: 0, // -25
        isSanctuary: -1e80, // 100
        killCount: 4, // 2.5
        cluster: 1, // 2

        sameTeam: true, // go for same team
        avoidNearest: false // don't run from nearest valid target
    }], ["drag", {range: 400, useAlt: true}]],
    BODY: {
        HEALTH: harvesterStats.HEALTH * 1.1,
        SPEED: harvesterStats.SPEED * 1.4,
    },
    AI: {IGNORE_SHAPES: true, BLIND: true, chase: true},
    GUNS: [
        {
            POSITION: [13, 20, 0.45, 2, 0, 0, 0]
        },
        {
            POSITION: [8, 8, -0.5, 11, 0, 0, 0]
        },
        {
            POSITION: [16.5, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.healer, {size: 0.9, speed: 2.5}]),
                TYPE: "healerBulletIndicated",
                ALT_FIRE: true,
            }
        },
        ...addThruster(1.7),
    ],
    TURRETS: [
        {
            POSITION: [13.5, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ]
}

Class.harvesters = menu("Harvesters", "hexagon", 6);
Class.harvesters.UPGRADES_TIER_0 = ["furrower", "stockyard", "quarterstaff", "shepherd", "irrigator", "scarecrow", "pressurizer", "cultivator", "harrower"];
Class.harvesters.PROPS = [{
    POSITION: [15, 0, 0, 180, 1],
    TYPE: ["hexagon", {COLOR: -1}]
}];

Class.bosses.UPGRADES_TIER_0.push("harvesters");
