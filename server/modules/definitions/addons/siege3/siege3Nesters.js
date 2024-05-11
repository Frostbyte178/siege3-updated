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
    UPGRADE_LABEL: "Nest Purger",
    GUNS: weaponArray([
        {
            POSITION: [-1.5, 8, 1.2, 11, 0, 36, 0],
        }, {
            POSITION: [1.5, 8, 1.2, 11, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { speed: 0.5, maxSpeed: 0.5 }, { speed: 0.7, maxSpeed: 0.7 }, { reload: 0.5 }, { reload: 0.5 }, { size: 0.5 } ]),
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
            TYPE: [ "assassin", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"]}, ],
        }, 5)
    ],
};

//Firework Nester.
Class.nestGrenadier = {
    PARENT: "genericNester",
    LABEL: "Nest Grenadier",
    UPGRADE_LABEL: "Nest Grenadier",
    GUNS: weaponArray([
        {
            POSITION: [11, 7.5, -0.4, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 7.5, 1.3, 11, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.hexaTrapper, { shudder: 0.75, size: 0.25 } ]),
                TYPE: "trap"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "fireworkTurret" ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "superNailgunTurret" ],
        }, 5)
    ],
};

// Launcher Nester
Class.nestBrigadier = {
    PARENT: "genericNester",
    LABEL: "Nest Brigadier",
    UPGRADE_LABEL: "Nest Brigadier",
    GUNS: weaponArray([
        {
            POSITION: [2.5, 6.5, 1, 9.5, 0, 36, 0],
        }, {
            POSITION: [1.5, 9, 1, 9.5, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.pounder, g.destroyer, { speed: 0.78, maxSpeed: 0.125, reload: 0.7, damage: 0.17, health: 7, size: 0.85, range: 1.3 } ]),
                TYPE: "bigminimissile",
                STAT_CALCULATOR: gunCalcNames.block
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "sidewinderTurret" ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 25, 0],
            TYPE: [ "homingMissileTurret" ],
        }, 5)
    ],
};

// Spawner nester
Class.nestIndustry = {
    PARENT: "genericNester",
    LABEL: "Nest Industry",
    UPGRADE_LABEL: "Nest Industry",
    GUNS: weaponArray([
        {
            POSITION: [11.75, 9.5, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 10.5, 1, 11.75, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, { health: 0.7, size: 0.4 }]),
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
    UPGRADE_LABEL: "Nest Synthesizer",
    GUNS: weaponArray([
        {
            POSITION: [10, 10, -0.5, 4, 0, 36, 0],
        }, {
            POSITION: [12, 11, -1.3, 0, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.sniper, g.sniper, g.hunter, g.sidewinder, {range: 2, size: 0.55}]),
                TYPE: "snake",
                STAT_CALCULATOR: gunCalcNames.sustained,
                AUTOFIRE: true,
            },
        },
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'predatorTurret'
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 0, 0],
            TYPE: 'flameTurret',
        }, 5)
    ],
};

// Brawler nester
Class.nestPurifier = {
    PARENT: 'genericNester',
    LABEL: "Nest Purifier",
    UPGRADE_LABEL: "Nest Purifier",
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
            TYPE: 'culverinTurret'
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 0, 0],
            TYPE: 'topplerTurret',
        }, 5)
    ],
}

//Push Nester to Nesters.
Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier", "nestIndustry", "nestSynthesizer", 'nestPurifier', 'nestBreeder');
