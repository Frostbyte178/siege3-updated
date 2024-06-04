let { bossSpawnNew:   b  , atmg: atmg , outside:   o , killWall:   K  } = require('../tiles/siege.js'),
    { normalNoFood: WALL, normalNoFood: ____ } = require('../tiles/misc.js'),
	{ base1: sanc } = require('../tiles/tdm.js'),

room = [
    [  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ],
    [  o ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  K ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,sanc,____,____,WALL,  o ],
    [atmg,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,atmg],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,sanc,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,sanc,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [atmg,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,atmg],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,sanc,____,____,WALL,  o ],
    [  o ,WALL,  b ,  b ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  K ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  o ],
    [  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ],
];

module.exports = room;