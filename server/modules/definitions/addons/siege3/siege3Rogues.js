const { base, gunCalcNames } = require("../../constants");
const g = require('../../gunvals.js');
const { combineStats, weaponArray } = require("../../facilitators");

// Hex rogues
Class.rogueBarricadeTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    INDEPENDENT: true,
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16, 19, -0.7, 0, 0, 0, 0],
        }, {
            POSITION: [4, 19, 1.3, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.power, { speed: 0.7, maxSpeed: 0.7 }, g.hexaTrapper, {shudder: 0.5}]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
        },
    ],
}
Class.rogueBarricade = {
    PARENT: "miniboss",
    LABEL: "Rogue Barricade",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.001, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: 0.5, // 2
    }], ["drag", {range: 450}]],
    BODY: {
        FOV: 1.7,
        SPEED: 0.4 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
        REGEN: base.REGEN * 0.3,
    },
    GUNS: weaponArray({
        POSITION: [5, 6, 1.3, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, { reload: 1.5 }, {size: 1.5}]),
            TYPE: "drone",
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            AUTOFIRE: true,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 0, 0],
        TYPE: "rogueBarricadeTurret",
    }, 6),
}
Class.rogueBalustradeTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    INDEPENDENT: true,
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [18, 16, 1, 0, 0, 0, 0],
        }, {
            POSITION: [2, 16, 1.2, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.hexaTrapper, g.pounder, {reload: 0.73, speed: 1.4, range: 0.8}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
        },
    ],
}
Class.rogueBalustrade = {
    PARENT: "miniboss",
    LABEL: "Rogue Balustrade",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.001, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: 0.5, // 2
    }], ["drag", {range: 450}], ["underseerRepel", {trigger: 825, repelDrones: 25, minDrones: 15}]],
    BODY: {
        FOV: 1.7,
        SPEED: 0.4 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
        REGEN: base.REGEN * 0.3,
    },
    GUNS: weaponArray([{
        POSITION: [4, 5, 1.3, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, {health: 1.4, damage: 1.4, density: 2, resist: 1.15, reload: 1.65, maxSpeed: 0.9, size: 1.15}]),
            TYPE: "drone",
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: true,
            AUTOFIRE: true,
            MAX_CHILDREN: 5,
            SYNCS_SKILLS: true
        }
    }], 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 0, 0],
        TYPE: "rogueBalustradeTurret",
    }, 6),
}

// Septa rogues
Class.rogueBattalionTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    BODY: {
        FOV: 2,
    },
    INDEPENDENT: true,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16, 14, 1, 0, 0, 0, 0],
        }, {
            POSITION: [4, 14, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {speed: 1.1, shudder: 0.2}]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true,
            },
        },
    ],
}
Class.rogueBattalion = {
    PARENT: "miniboss",
    LABEL: "Rogue Battalion",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    CONTROLLERS: [["targetSelection", {
        health: 250, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 125, // 75
        isHealer: -50, // -25
        isSanctuary: 50, // 100
        killCount: 4, // 2.5
        cluster: 4, // 2
    }], ["drag", {range: 225}]],
    SHAPE: 7,
    SIZE: 32,
    VALUE: 5e5,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.5,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 4,
        REGEN: base.REGEN * 0.3,
        DAMAGE: base.DAMAGE * 4,
    },
    GUNS: weaponArray({
        POSITION: [13, 6, 1, 0, 0, 360/14, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, {speed: 1.1, maxSpeed: 1.1}]),
            TYPE: "bullet",
        }
    }, 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 130, 0],
        TYPE: "rogueBattalionTurret",
    }, 7),
}
Class.rogueCoalitionTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    BODY: {
        FOV: 2,
    },
    INDEPENDENT: true,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        }, {
            POSITION: [17, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 2, damage: 2.15}]),
                TYPE: "missile",
                STAT_CALCULATOR: gunCalcNames.sustained,
                AUTOFIRE: true,
            },
        },
    ],
}
Class.rogueCoalition = {
    PARENT: "miniboss",
    LABEL: "Rogue Coalition",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    CONTROLLERS: [["targetSelection", {
        health: 250, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 125, // 75
        isHealer: -50, // -25
        isSanctuary: 50, // 100
        killCount: 4, // 2.5
        cluster: 4, // 2
    }], ["drag", {range: 225}]],
    SHAPE: 7,
    SIZE: 32,
    VALUE: 5e5,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.5,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 4,
        REGEN: base.REGEN * 0.3,
        DAMAGE: base.DAMAGE * 4,
    },
    GUNS: weaponArray([
        {
            POSITION: [11.5, 6, 1, 0, 0, 360/14, 0],
        }, {
            POSITION: [1, 6, 1.15, 11.5, 0, 360/14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, g.pounder, {health: 1.2, range: 0.8}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: gunCalcNames.block,
            }
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 130, 0],
        TYPE: "rogueCoalitionTurret",
    }, 7)
}

// Octo rogues
Class.healerBulletIndicated = {
    PARENT: "healerBullet",
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ],
}
Class.unsetSurgeonPillboxTurret = {
    PARENT: "genericTank",
    LABEL: "",
    COLOR: "grey",
    BODY: {
        FOV: 3,
    },
    HAS_NO_RECOIL: true,
    FACING_TYPE: ["spin", {speed: 0.08}],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [17, 11, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.turret, {reload: 2, damage: 2}]),
                TYPE: ["healerBullet", {PERSISTS_AFTER_DEATH: true}],
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [14, 11, 1, 0, 0, 270, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.turret, {reload: 2, damage: 2}]),
                TYPE: ["healerBullet", {PERSISTS_AFTER_DEATH: true}],
                AUTOFIRE: true,
            },
        },
    ],
}
Class.unsetSurgeonPillbox = {
    PARENT: "trap",
    LABEL: "Pillbox",
    SHAPE: -6,
    MOTION_TYPE: "motor",
    INDEPENDENT: true,
    BODY: {
        SPEED: 1,
        DENSITY: 5,
        DAMAGE: 0
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "unsetSurgeonPillboxTurret",
        },
    ],
}

Class.rogueAlchemistTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [27, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.pounder, {range: 1.1}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [5, 9, -1.4, 8, 0, 0, 0]
        }
    ],
}
Class.rogueAlchemist = {
    PARENT: "miniboss",
    LABEL: "Rogue Alchemist",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 8,
    SIZE: 34,
    VALUE: 5e5,
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: -0.5, // 2
    }], ["drag", {range: 525}]],
    BODY: {
        FOV: 1.6,
        SPEED: base.SPEED * 0.35,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 4.5,
        REGEN: base.REGEN * 0.3,
        DAMAGE: base.DAMAGE * 4.5,
    },
    GUNS: weaponArray([
        {
            POSITION: [6, 5, -0.5, 7.5, 0, 0, 0],
        }, {
            POSITION: [12.5, 5.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.healer, {size: 0.8, reload: 4, maxSpeed: 0.1, range: 0.7}]),
                TYPE: "healerBulletIndicated",
                AUTOFIRE: true,
            },
        },
    ], 8),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 22.5, 120, 0],
        TYPE: "rogueAlchemistTurret",
    }, 8),
}

Class.healerSwarm = {
    PARENT: "swarm",
    RESET_CONTROLLERS: true,
    CONTROLLERS: [["targetSelection", {
        health: -250, // target low hp
        score: 0.001, // target higher score
        danger: 2, // target more dangerous
        isBoss: 50, // target rogues
        isHealer: 25, // target healers slightly
        isSanctuary: -1e80, // ignore sanctuaries
        killCount: 1.5, // target higher kill count
        cluster: 0, // ignore cluster
        
        sameTeam: true, // go for same team
        avoidNearest: false // don't run from nearest valid target
    }], "targetPrediction", "mapTargetToGoal"],
    AI: {BLIND: true},
    HEALER: true,
    INDEPENDENT: true,
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.rogueInventorTurret = {
    PARENT: "genericTank",
    LABEL: "Turret",
    INDEPENDENT: true,
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [9, 10, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.3, maxSpeed: 1.3, range: 1.8, reload: 1.6}]),
                TYPE: "healerSwarm",
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
    ],
    PROPS: [{
        POSITION: [12, 0, 0, 0, 1],
        TYPE: "healerSymbol"
    }]
}
Class.rogueInventor = {
    PARENT: "miniboss",
    LABEL: "Rogue Inventor",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 8,
    SIZE: 34,
    VALUE: 5e5,
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: -0.5, // 2
    }], ["drag", {range: 525}]],
    BODY: {
        FOV: 1.6,
        SPEED: base.SPEED * 0.35,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 4.5,
        REGEN: base.REGEN * 0.3,
        DAMAGE: base.DAMAGE * 4.5,
    },
    GUNS: weaponArray([
        {
            POSITION: [12.5, 5, 1, 0, 0, 0, 0],
        }, {
            POSITION: [1.75, 5, 1.5, 12.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, { speed: 1.5 }, g.hexaTrapper, {reload: 1.7, range: 0.85}]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: gunCalcNames.block,
            }
        }
    ], 8, 1/2),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 22.5, 0, 0],
        TYPE: "rogueInventorTurret",
    }, 8),
}

Class.roguePioneerTurret = {
    PARENT: "genericTank",
    BODY: { FOV: 2 * base.FOV },
    COLOR: 16,
    INDEPENDENT: true,
    CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [10, 12.25, -0.7, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {speed: 3, maxSpeed: 2, damage: 0.38, size: 0.7, range: 1.45, reload: 2.5}]),
                TYPE: ["homingMissile", {BODY: {RECOIL_MULTIPLIER: 0.18}}],
                STAT_CALCULATOR: gunCalcNames.sustained,
                AUTOFIRE: true,
            },
        }, {
            POSITION: [19, 18, 0.65, 0, 0, 0, 0],
        }, {
            POSITION: [15.5, 13, -0.55, 0, 0, 0, 0],
        },
    ],
}
Class.roguePioneer = {
    PARENT: "miniboss",
    LABEL: "Rogue Pioneer",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 8,
    SIZE: 34,
    VALUE: 5e5,
    CONTROLLERS: [["targetSelection", {
        health: 175, // 150
        score: 0.00175, // 0.00075
        danger: 7.5, // 5
        isBoss: 10, // 75
        isHealer: 20, // -25
        isSanctuary: -25, // 100
        killCount: 3, // 2.5
        cluster: 0.5, // 2
    }], ["drag", {range: 525}]],
    BODY: {
        FOV: 1.6,
        SPEED: base.SPEED * 0.35,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 4.5,
        REGEN: base.REGEN * 0.3,
        DAMAGE: base.DAMAGE * 4.5,
    },
    GUNS: weaponArray([
        {
            POSITION: [12.25, 4.75, 1, 0, 0, 0, 0],
        }, {
            POSITION: [1.5, 4.75, 1.45, 12.25, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, { speed: 1.2 }, g.hexaTrapper, {health: 1.5, reload: 5}]),
                TYPE: "unsetSurgeonPillbox",
                STAT_CALCULATOR: gunCalcNames.block,
                DESTROY_OLDEST_CHILD: true,
                MAX_CHILDREN: 2,
                AUTOFIRE: true,
            }
        }
    ], 8, 1/2),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 22.5, 0, 0],
        TYPE: "roguePioneerTurret",
    }, 8),
}


Class.rogues.UPGRADES_TIER_0.splice(1, 0, "rogueBarricade", "rogueBalustrade");
Class.rogues.UPGRADES_TIER_0.splice(4, 0, "rogueBattalion", "rogueCoalition");
Class.rogues.UPGRADES_TIER_0.splice(6, 0, "rogueAlchemist", "rogueInventor", "roguePioneer");
