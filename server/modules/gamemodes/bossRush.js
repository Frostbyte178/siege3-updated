let calculatePoints = wave => 5 + Math.floor(wave * 3 ** 0.85); // Easier until wave 59, much harder afterwards
// Each wave has a certain amount of "points" that it can spend on bosses, calculated above.
// Each boss costs an amount of points.
// It will always buy as many bosses until it has no points or else can't spend them.
// It picks a boss to buy by filtering the list of boss choices by if they are affordable.
// Then it picks a boss at random, with all choices being equally likely.

let oldGroups = {
    elites: [ "eliteDestroyer", "eliteGunner", "eliteSprayer", "eliteBattleship", "eliteSpawner" ],
    mysticals: [ "summoner", "eliteSkimmer", "nestKeeper", "roguePalisade" ],
    celestials: [ "paladin", "freyja", "zaphkiel", "nyx", "theia" ],
    eternals: [ "legionaryCrasher", "kronos", "odin" ],
};

class BossRush {
    constructor() {
        this.waveCodes = [
            ran.chooseN(oldGroups.elites, 1),
            ran.chooseN(oldGroups.elites, 2),
            ran.chooseN(oldGroups.elites, 3),
            ran.chooseN(oldGroups.elites, 4),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 1)),
            ran.chooseN(oldGroups.elites, 2).concat(ran.chooseN(oldGroups.mysticals, 2)),
            ran.chooseN(oldGroups.elites, 1).concat(ran.chooseN(oldGroups.mysticals, 3)),
            ran.chooseN(oldGroups.mysticals, 4),
            ran.chooseN(oldGroups.elites, 1).concat(ran.chooseN(oldGroups.mysticals, 4)),
            ran.chooseN(oldGroups.elites, 2).concat(ran.chooseN(oldGroups.mysticals, 4)),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 4)),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)),
            [ oldGroups.celestials[0] ],
            [ oldGroups.celestials[1] ],
            [ oldGroups.celestials[2] ],
            [ oldGroups.celestials[3] ],
            [ oldGroups.celestials[4] ],
            ran.chooseN(oldGroups.elites, 1).concat(ran.chooseN(oldGroups.mysticals, 1)).concat(ran.chooseN(oldGroups.celestials, 1)),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 1)).concat(ran.chooseN(oldGroups.celestials, 1)),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 3)).concat(ran.chooseN(oldGroups.celestials, 1)),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)).concat(ran.chooseN(oldGroups.celestials, 1)),
            ran.chooseN(oldGroups.celestials, 2),
            ran.chooseN(oldGroups.elites, 1).concat(ran.chooseN(oldGroups.mysticals, 2)).concat(ran.chooseN(oldGroups.celestials, 2)),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 3)).concat(ran.chooseN(oldGroups.celestials, 2)),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)).concat(ran.chooseN(oldGroups.celestials, 2)),
            ran.chooseN(oldGroups.celestials, 3),
            ran.chooseN(oldGroups.elites, 3).concat(ran.chooseN(oldGroups.mysticals, 3)).concat(ran.chooseN(oldGroups.celestials, 3)),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)).concat(ran.chooseN(oldGroups.celestials, 3)),
            ran.chooseN(oldGroups.celestials, 4),
            ran.chooseN(oldGroups.elites, 2).concat(ran.chooseN(oldGroups.mysticals, 2)).concat(ran.chooseN(oldGroups.celestials, 4)),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)).concat(ran.chooseN(oldGroups.celestials, 4)),
            ran.chooseN(oldGroups.celestials, 5),
            ran.chooseN(oldGroups.elites, 4).concat(ran.chooseN(oldGroups.mysticals, 4)).concat(ran.chooseN(oldGroups.celestials, 5)),
            ran.chooseN(oldGroups.eternals, 1),
        ];
        this.bossChoices = [
            // [ cost , definition reference ],

            //mysticals
            [  1, "sorcerer"],
            [  2, "summoner"],
            [  2, "enchantress"],
            [  2, "exorcistor"],
            [  2, "shaman"],

            //elites
            [  3, "eliteDestroyer"],
            [  3, "eliteGunner"],
            [  3, "eliteSprayer"],
            [  3, "eliteBattleship"],
            [  3, "eliteSpawner"],
            [  3, "eliteTrapGuard"],
            [  3, "eliteSpinner"],
            [  3, "eliteSkimmer"],

            //nesters
            [  5, "nestKeeper"],
            [  5, "nestWarden"],
            [  5, "nestGuardian"],

            //terrestrials
            [ 25, "ares"],
            [ 25, "gersemi"],
            [ 25, "ezekiel"],
            [ 25, "eris"],
            [ 25, "selene"],

            //celestials
            [ 55, "paladin"],
            [ 55, "freyja"],
            [ 55, "zaphkiel"],
            [ 55, "nyx"],
            [ 55, "theia"],

            //eternals
            [ 99, "legionaryCrasher" /*fucking mid*/],
            [100, "kronos"],
            [100, "odin"],
        ];
        this.bossChoiceExtensions = [
            [ // elites
                [  3, "eliteHarbor"],
                [  3, "eliteAssembler"],
                [  3, "eliteSniper"],
                [  3, "eliteNailgun"],
            ],
            [ // harvesters
                [  3, "furrower"],
                [  3, "stockyard"],
                [  3, "quarterstaff"],
                [  3, "shepherd"],
                [  3, "pressurizer"],
                [  3, "cultivator"],
                [  3, "irrigator"],
                [  3, "scarecrow"],
            ],
            [ // nesters
                [  5, "nestPurger"],
                [  5, "nestGrenadier"],
                [  5, "nestBrigadier"],
                [  5, "nestIndustry"],
                [  5, "nestSynthesizer"],
                [  5, "nestPurifier"],
                [  5, "nestWatchman"],
            ]
        ]
        this.bossStatMultipliers = {
            nestKeeper: 1.2,
            nestWarden: 1.2,
            nestGuardian: 1.2,

            ares: 1.75,
            gersemi: 1.75,
            ezekiel: 1.75,
            eris: 1.75,
            selene: 1.75,

            paladin: 2.5,
            freyja: 2.5,
            zaphkiel: 2.5,
            nyx: 2.5,
            theia: 2.5,
            julius: 2,
            genghis: 2,
            napoleon: 2,

            legionaryCrasher: 3.5,
            kronos: 3.5,
            odin: 3.5,
        };
        this.friendlyBossChoices = [
            [9, "roguePalisade"], [9, "rogueBarricade"], [9, "rogueBalustrade"],
            [7, "rogueArmada"], [7, "rogueBattalion"], [7, "rogueCoalition"],
            [3, "rogueAlchemist"], [3, "rogueInventor"], [3, "roguePioneer"],
            [1, "julius"], [1, "genghis"], [1, "napoleon"],
        ];
        this.bigFodderChoices = [
            [1000, 
                ["sentryGun", "sentrySwarm", "sentryTrap", "sentryThruster", "sentryRoadspike", "sentryDesmos"],
            ],
            [750, 
                ["sentinelLauncher", "sentinelCrossbow", "sentinelMinigun", "sentinelTriplex", "sentinelBees", "sentinelBomber"],
            ],
            [1, 
                ["shinySentryGun", "shinySentrySwarm", "shinySentryTrap"],
            ],
        ];
        this.smallFodderChoices = ["crasher"];
        this.length = c.CLASSIC_SIEGE ? this.waveCodes.length : c.WAVES;
        this.waves = this.generateWaves();
        this.waveId = -1;
        this.gameActive = true;
        this.timer = 0;
        this.remainingEnemies = 0;
        this.sanctuaryTier = 1;
        this.friendlyBossCooldown = 15;
        this.sanctuaries = [];
    }

    generateWaves() {
        let waves = [];
        for (let i = 0; i < this.length; i++) {
            let wave = [],
                points = calculatePoints(i),
                choices = this.bossChoices;

            while (points > 0 && choices.length) {
                choices = choices.filter(([ cost ]) => cost <= points);
                let [ cost, boss ] = ran.choose(choices);
                points -= cost;
                wave.push(boss);
            }

            waves.push(c.CLASSIC_SIEGE ? this.waveCodes[i] : wave);
        }
        return waves;
    }

    spawnFriendlyBoss() {
        let o = new Entity(getSpawnableArea(TEAM_BLUE));
        let type = this.friendlyBossChoices[ran.chooseChance(...this.friendlyBossChoices.map((x) => x[0]))][1]
        o.define(type);
        o.define({ DANGER: 10 });
        o.team = TEAM_BLUE;
        o.controllers.push(new ioTypes.nearestDifferentMaster(o), new ioTypes.wanderAroundMap(0, { lookAtGoal: true }));
        o.name = ran.chooseBossName('castle');
        o.FOV = 10;
        let statFactor = this.bossStatMultipliers[type] ?? 1;
        this.setTurretStats(o, statFactor);
        o.HEALTH *= statFactor;
        o.settings.broadcastMessage = `${o.name} has fallen!`;
        sockets.broadcast(o.name + ' has arrived and joined your team!');
        playerTeamEntities.push(o);
        o.on('dead', () => {
            // Remove from array of player team tanks
            let removeId = o.id;
            playerTeamEntities = playerTeamEntities.filter((x) => x.id != removeId);
        })
    }

    spawnSanctuary(tile, team, type = false) {
        type = type ? type : "sanctuaryTier3";
        let o = new Entity(tile.loc);
        if (team == TEAM_BLUE) {
            playerTeamEntities.push(o);
        }
        this.defineSanctuary(o, team, type, tile);
        this.sanctuaries.push(o);
    }

    defineSanctuary(entity, team, type, tile) {
        entity.define(type);
        entity.team = team;
        entity.color.base = getTeamColor(team);
        entity.skill.score = 111069;
        entity.name = 'Sanctuary';
        entity.SIZE = room.tileWidth / 17.5;
        entity.isDominator = true;
        entity.define({ DANGER: 11 })
        entity.on('dead', () => {
            if (entity.team === TEAM_ENEMIES) {
                this.spawnSanctuary(tile, TEAM_BLUE, `sanctuaryTier${this.sanctuaryTier}`);
                tile.color.interpret(getTeamColor(TEAM_BLUE));
                sockets.broadcast('A sanctuary has been repaired!');
            } else {
                this.spawnSanctuary(tile, TEAM_ENEMIES, "dominator");
                tile.color.interpret(getTeamColor(TEAM_ENEMIES));
                sockets.broadcast('A sanctuary has been destroyed!');
                let removeId = entity.id;
                playerTeamEntities = playerTeamEntities.filter((x) => x.id != removeId);
            }
            sockets.broadcastRoom();
        });
    }

    playerWin() {
        if (this.gameActive) {
            this.gameActive = false;
            sockets.broadcast(getTeamName(TEAM_BLUE) + ' has won the game!');
            setTimeout(closeArena, 1500);
        }
    }

    setTurretStats(entity, statFactor) {
        entity.gunStatScale = {health: statFactor};
        for (let turret of entity.turrets) {
            this.setTurretStats(turret, statFactor);
        }
    }

    spawnEnemyWrapper(loc, type) {
        let enemy = new Entity(loc);
        enemy.define(type);
        enemy.team = TEAM_ENEMIES;
        enemy.FOV = 10;
        let statFactor = 1.01 ** this.waveId * (this.bossStatMultipliers[type] ?? 1);
        this.setTurretStats(enemy, statFactor);
        enemy.HEALTH *= statFactor;
        enemy.refreshBodyAttributes();
        if (c.ROOM_SETUP[1] != "map_siege_blitz") {
            enemy.controllers.push(new ioTypes.bossRushAI(enemy));
        }
        enemyTeamEntities.push(enemy);

        this.remainingEnemies++;
        enemy.on('dead', () => {
            //this enemy has been killed, decrease the remainingEnemies counter
            //if afterwards the counter happens to be 0, announce that the wave has been defeated
            if (!--this.remainingEnemies) {
                sockets.broadcast(`Wave ${this.waveId + 1} has been defeated!`);
                sockets.broadcast(`The next wave will start shortly.`);
            }
            // Remove from array of enemy bosses
            let removeId = enemy.id;
            enemyTeamEntities = enemyTeamEntities.filter((x) => x.id != removeId);
        });
        return enemy;
    }

    spawnWave(waveId) {
        //yell at everyone
        sockets.broadcast(`Wave ${waveId + 1} has started!`);

        // extend the boss spawn options over time
        switch (waveId) {
            case 10:
                this.bossChoices.push(...this.bossChoiceExtensions[0]);
                break;
            case 15:
                this.bossChoices.push(...this.bossChoiceExtensions[1]);
                break;
            case 25:
                this.bossChoices.push(...this.bossChoiceExtensions[2]);
                break;
        }

        //spawn bosses
        for (let boss of this.waves[waveId]) {
            let spot = null,
                attempts = 0;
            do {
                spot = getSpawnableArea(TEAM_ENEMIES);
            } while (dirtyCheck(spot, 500) && ++attempts < 30);

            let enemy = this.spawnEnemyWrapper(spot, boss);
            enemy.define({ DANGER: 25 + enemy.SIZE / 5 });
            enemy.isBoss = true;
        }

        if (!c.CLASSIC_SIEGE) {
            //spawn fodder enemies
            let bigFodderOptions = this.bigFodderChoices[ran.chooseChance(...this.bigFodderChoices.map((x) => x[0]))][1];
            for (let i = 0; i < this.waveId / 5; i++) {
                this.spawnEnemyWrapper(getSpawnableArea(TEAM_ENEMIES), ran.choose(bigFodderOptions));
            }
            for (let i = 0; i < this.waveId / 2; i++) {
                this.spawnEnemyWrapper(getSpawnableArea(TEAM_ENEMIES), ran.choose(this.smallFodderChoices));
            }

            //spawn a friendly boss every [this.friendlyBossCooldown] waves
            if (waveId % this.friendlyBossCooldown == (this.friendlyBossCooldown - 1)) {
                setTimeout(() => this.spawnFriendlyBoss(), 5000);
            }
        }

        // Update sanctuary tiers
        let newSancTier = Math.min(Math.floor(this.waveId / 5) + 1, 6);
        if (newSancTier != this.sanctuaryTier) {
            for (let sanc of this.sanctuaries) {
                this.defineSanctuary(sanc, TEAM_BLUE, `sanctuaryTier${newSancTier}`);
            }
            sockets.broadcast(`The sanctuaries have upgraded to tier ${newSancTier}.`);
            this.sanctuaryTier = newSancTier;
        }
    }

    //runs once when the server starts
    init() {
        Class.basic.UPGRADES_TIER_2.push("healer");
        //TODO: filter out tiles that are not of sanctuary type
        for (let tile of room.spawnable[TEAM_BLUE]) {
            this.spawnSanctuary(tile, TEAM_BLUE, "sanctuaryTier1");
        }
    }

    //runs every second
    loop() {
        //the timer has ran out? reset timer and spawn the next wave
        if (this.timer <= 0) {
            this.timer = 150; // 5 seconds
            this.waveId++;
            if (this.waves[this.waveId]) {
                this.spawnWave(this.waveId);

            //if there is no next wave then simply let the players win
            } else {
                this.playerWin();
            }

        //if the timer has not ran out and there arent any remaining enemies left, decrease the timer
        } else if (!this.remainingEnemies) {
            this.timer--;
        }
    }
}

module.exports = { BossRush };