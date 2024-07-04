//Demo for Nester-type boss ideas.

// NAMES (future): "Nest Paralyzer", "placeholder"
// TODO: Helix (Arms race tank, not desmos), 

const { combineStats, weaponArray } = require('../../facilitators.js');
const { base, gunCalcNames } = require('../../constants.js');
const g = require('../../gunvals.js');

//Base for Nesters, this is for creating them so I don't have to go back into bosses for them.

Class.genericNester = {
    PARENT: "miniboss",
    LABEL: "Nest Base",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    RECOIL_MULTIPLIER: 0,
    VALUE: 3e5,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.4,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
};

// Ok now it's Nester time.

//Undertow Nester.
Class.nestPurger = {
    PARENT: "genericNester",
    LABEL: "Nest Purger",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.00125, // 0.00075
        danger: 7.5, // 5
        isBoss: 100, // 75
        isHealer: 0, // -25
        isSanctuary: -100, // 100
        killCount: 3, // 2.5
        cluster: 5, // 2
    }], ["drag", {range: 500}]],
    GUNS: weaponArray([
        {
            POSITION: [-1.5, 7.5, 1.2, 11, 0, 36, 0],
        }, {
            POSITION: [1.5, 7.5, 1.2, 11, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { reload: 1.75, health: 1.5, range: 0.7, speed: 0.5, maxSpeed: 0.5, size: 0.65, recoil: 0 } ]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "undertowTurret",
        },
        ...weaponArray({
            POSITION: [8, 10, 0, 0, 120, 0],
            TYPE: "assassinTurret"
        }, 5)
    ],
};

//Firework Nester.
Class.nestGrenadier = {
    PARENT: "genericNester",
    LABEL: "Nest Grenadier",
    CONTROLLERS: [["targetSelection", {
        health: 175, // 150
        score: 0.001, // 0.00075
        danger: 7.5, // 5
        isBoss: 50, // 75
        isHealer: 20, // -25
        isSanctuary: -50, // 100
        killCount: 3.5, // 2.5
        cluster: 4, // 2
    }], ["drag", {range: 425}]],
    GUNS: weaponArray([
        {
            POSITION: [11, 7, -0.4, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 7, 1.3, 11, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.hexaTrapper, { shudder: 0.75, size: 0.25, recoil: 0 } ]),
                TYPE: "trap"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "fireworkTurret",
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: ["nailgunTurret", {COLOR: -1, INDEPENDENT: true}],
        }, 5)
    ],
};

// Launcher Nester
Class.nestBrigadier = {
    PARENT: "genericNester",
    LABEL: "Nest Brigadier",
    CONTROLLERS: [["targetSelection", {
        health: 175, // 150
        score: 0.001, // 0.00075
        danger: 7.5, // 5
        isBoss: 50, // 75
        isHealer: 20, // -25
        isSanctuary: -50, // 100
        killCount: 3.5, // 2.5
        cluster: 4, // 2
    }], ["drag", {range: 450}]],
    GUNS: weaponArray([
        {
            POSITION: [2.5, 5.75, 1, 9.5, 0, 36, 0],
        }, {
            POSITION: [1.5, 8, 1, 9.5, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.pounder, g.destroyer, { speed: 0.78, maxSpeed: 0.125, reload: 0.7, damage: 0.17, health: 7, size: 0.85, range: 1.3, recoil: 0 } ]),
                TYPE: "bigminimissile",
                STAT_CALCULATOR: gunCalcNames.sustained
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "sidewinderTurret",
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 25, 0],
            TYPE: "homingMissileTurret",
        }, 5)
    ],
};

// Spawner nester
Class.nestIndustry = {
    PARENT: "genericNester",
    LABEL: "Nest Industry",
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
    GUNS: weaponArray([
        {
            POSITION: [11.5, 7.5, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 8.5, 1, 11.5, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, { health: 0.7, size: 0.45 }]),
                TYPE: ["sentinelCrossbow", {CLEAR_ON_MASTER_UPGRADE: true, ACCEPTS_SCORE: false, VARIES_IN_SIZE: false, GIVE_KILL_MESSAGE: false}],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                MAX_CHILDREN: 2,
                WAIT_TO_CYCLE: true,
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'nestIndustryTop'
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: "builderTurret",
        }, 5)
    ],
};
Class.nestIndustry.GUNS[5].PROPERTIES.TYPE[0] = "sentinelCrossbow"
Class.nestIndustry.GUNS[6].PROPERTIES.TYPE[0] = "sentinelMinigun"
Class.nestIndustry.GUNS[7].PROPERTIES.TYPE[0] = "sentinelLauncher"
Class.nestIndustry.GUNS[8].PROPERTIES.TYPE[0] = "sentinelCrossbow"
Class.nestIndustry.GUNS[9].PROPERTIES.TYPE[0] = "sentinelLauncher"

// Long range nester
Class.nestSynthesizer = {
    PARENT: "genericNester",
    LABEL: "Nest Synthesizer",
    CONTROLLERS: [["targetSelection", {
        health: 125, // 150
        score: 0.0015, // 0.00075
        danger: 7.5, // 5
        isBoss: 50, // 75
        isHealer: 15, // -25
        isSanctuary: -75, // 100
        killCount: 3, // 2.5
        cluster: 1, // 2
    }], ["drag", {range: 500}]],
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: gunCalcNames.drone,
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'predatorTurret'
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: 'sidewinderTurret2',
        }, 5)
    ],
};

// Brawler nester
Class.nestPurifier = {
    PARENT: 'genericNester',
    LABEL: "Nest Purifier",
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
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'shotgunTurret'
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 0, 0],
            TYPE: 'topplerTurret',
        }, 5)
    ],
}

// Boomer nester
Class.nestWatchman = {
    PARENT: 'genericNester',
    LABEL: "Nest Watchman",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 7.5, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 7.5, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor, {range: 0.5}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: gunCalcNames.block,
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ['rocketeerTurret', {INDEPENDENT: false, COLOR: -1}]
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 0, 0],
            TYPE: 'boomerTurretWeak',
        }, 5)
    ]
}

//Push Nester to Nesters.
Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier", "nestIndustry", "nestSynthesizer", 'nestPurifier', 'nestWatchman');
