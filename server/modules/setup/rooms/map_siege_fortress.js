let { bossSpawnNew:   b  , atmg: atmg , outside:   o , killWall:   K  } = require('../tiles/siege.js'),
    { normalNoFood: WALL, normalNoFood: ____ } = require('../tiles/misc.js'),
	{ base1: sanc } = require('../tiles/tdm.js'),

room = [
    [atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  b ,  b ,  b ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg],
    [  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  b ,  b ,  b ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ],
    [  o ,  o ,WALL,WALL,WALL,WALL,WALL,  o ,  b ,  b ,  b ,  o ,WALL,WALL,WALL,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,WALL,WALL,WALL,  K ,  K ,  K ,  K ,  K ,WALL,WALL,WALL,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,sanc,____,____,____,____,____,sanc,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,  o ,  K ,____,____,____,____,____,____,____,____,____,____,____,  K ,  o ,  o ,  o ],
    [  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,____,____,____,____,  K ,  b ,  b ,  b ],
    [  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,____,____,____,____,  K ,  b ,  b ,  b ],
    [  b ,  b ,  b ,  K ,____,____,____,____,____,____,____,____,____,____,____,  K ,  b ,  b ,  b ],
    [  o ,  o ,  o ,  K ,____,____,____,____,____,____,____,____,____,____,____,  K ,  o ,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,sanc,____,____,____,____,____,sanc,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,WALL,WALL,WALL,  K ,  K ,  K ,  K ,  K ,WALL,WALL,WALL,WALL,WALL,  o ,  o ],
    [  o ,  o ,WALL,WALL,WALL,WALL,WALL,  o ,  b ,  b ,  b ,  o ,WALL,WALL,WALL,WALL,WALL,  o ,  o ],
    [  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  b ,  b ,  b ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ],
    [atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  b ,  b ,  b ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg],
];

module.exports = room;