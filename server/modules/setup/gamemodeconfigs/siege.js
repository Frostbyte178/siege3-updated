let map = ran.choose(['fortress', 'citadel', 'blitz']);
module.exports = {
    MODE: "tdm",
    TEAMS: 1,
    SPECIAL_BOSS_SPAWNS: true,
    BOSS_SPAWN_COOLDOWN: Number.MAX_SAFE_INTEGER,
    WAVES: 100, // CLASSIC_SIEGE: false to use this setting
    CLASSIC_SIEGE: false,
    TILE_WIDTH: 400,
    TILE_HEIGHT: 400,
    ROOM_SETUP: [`map_siege_${map}`],
    BOT_XP: 500,
};