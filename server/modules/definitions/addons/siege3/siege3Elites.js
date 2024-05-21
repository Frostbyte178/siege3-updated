const { combineStats, skillSet } = require('../../facilitators.js');
const { base, gunCalcNames } = require('../../constants.js');
const g = require('../../gunvals.js');

Class.eggDrone = {
    PARENT: 'drone',
    SHAPE: 0
}
Class.squareDrone = {
    PARENT: 'drone',
    SHAPE: 4
}
Class.pentaDrone = {
    PARENT: 'drone',
    SHAPE: 5
}
Class.hexaDrone = {
    PARENT: 'drone',
    SHAPE: 6
}
Class.basicAutoGun = {
    PARENT: "auto4gun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [16.5, 8, 1, 0, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, {range: 1.15}]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.eliteHarbor = {
    PARENT: 'elite',
    UPGRADE_LABEL: "Elite Harbor",
    UPGRADE_COLOR: "pink",
    CONTROLLERS: [["minion", {orbit: 600, repel: 610}], ["underseerRepel", {trigger: 825, repelDrones: 31, minDrones: 12, repelCenterDistance: -0.25}]],
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 1, // default: 0.2
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0,
    }),
    BODY: {
        FOV: 2
    },
    AI: { STRAFE: false, IGNORE_SHAPES: true },
    GUNS: [
        // 2 egg 2 square 2 tri 2 penta 1 hexa
        // hp factors: 0.4 / 0.6 / 0.8 / 1.1 / 1.3
        // size factors: 0.9 / 1.25 / 1.35 / 1.6 / 1.8
        { // FR
            POSITION: [5, 6, 1.4, 6, 5.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.4, size: 0.9}]),
                TYPE: 'eggDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 6, 1.4, 6, -5.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.8, size: 1.35}]),
                TYPE: 'drone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 8, 1.4, 8, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 1.1, size: 1.6}]),
                TYPE: 'pentaDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, { // FL
            POSITION: [5, 6, 1.4, 6, 5.5, -60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.6, size: 1.25}]),
                TYPE: 'squareDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 6, 1.4, 6, -5.5, -60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.8, size: 1.35}]),
                TYPE: 'drone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 8, 1.4, 8, 0, -60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 1.3, size: 1.8}]),
                TYPE: 'hexaDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, { // Back
            POSITION: [5, 6, 1.4, 6, 5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.4, size: 0.9}]),
                TYPE: 'eggDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 6, 1.4, 6, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 0.6, size: 1.25}]),
                TYPE: 'squareDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }, {
            POSITION: [5, 8, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.overseer, {health: 1.1, size: 1.6}]),
                TYPE: 'pentaDrone',
                MAX_CHILDREN: 4,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10.5, 0, 0, 0, 360, 1],
            TYPE: ["basicAutoGun", { COLOR: -1 }],
        },
    ]
}

Class.eliteAssembler = {
    PARENT: 'elite',
    UPGRADE_LABEL: "Elite Assembler",
    SHAPE: 3.5,
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    FORCE_TWIGGLE: true,
    CONTROLLERS: [["drag", {range: 350, useAlt: true}], ["assemble", {assembleRange: 350, hideDelay: 3100, ahead: 9}]],
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 1, // default: 0.2
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0,
    }),
    BODY: {
        FOV: 2,
    },
    AI: { STRAFE: false, IGNORE_SHAPES: true },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.setTrap, {reload: 0.7}]),
                TYPE: 'assemblerTrap',
                MAX_CHILDREN: 10,
                STAT_CALCULATOR: gunCalcNames.block,
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [2.5, 14, 0, 0, 360, 1],
            TYPE: 'assemblerDot'
        },
        {
            POSITION: [13, 6, 0, 120, 170, 0],
            TYPE: "basicAutoGun"
        },
        {
            POSITION: [13, 6, 0, -120, 170, 0],
            TYPE: "basicAutoGun"
        },
    ]
}

Class.eliteSniper = {
    PARENT: 'elite',
    UPGRADE_LABEL: 'Elite Sniper',
    SHAPE: 3,
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    FORCE_TWIGGLE: true,
    CONTROLLERS: [["drag", {range: 700}]],
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.5, // default: 0.2
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0,
    }),
    BODY: {
        FOV: 2,
    },
    AI: { STRAFE: false, IGNORE_SHAPES: true, SKYNET: true },
    GUNS: [
        {
            POSITION: [12.5, 12, 1, 0, 0, 180, 0]
        },
        {
            POSITION: [3.5, 12, 1.5, 12.5, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.destroyer]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
                AUTOFIRE: true
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [13, 6, 0, 60, 170, 0],
            TYPE: "eliteSniperTurret"
        },
        {
            POSITION: [13, 6, 0, -60, 170, 0],
            TYPE: "eliteSniperTurret"
        },
    ],
}

Class.elites.UPGRADES_TIER_0.push("eliteHarbor", "eliteAssembler", "eliteSniper");
