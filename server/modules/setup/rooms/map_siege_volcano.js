let { bossSpawnNew:   b  , atmg: atmg , outside:   o , killWall:   K  } = require('../tiles/siege.js'),
    { normalNoFood: WALL, normalNoFood: ____ } = require('../tiles/misc.js'),
	{ base1: sanc } = require('../tiles/tdm.js'),

room = [
    [  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ],
    [  o ,  o ,  o ,  o ,  o ,  o ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  o ,  o ,  o ,  o ,  o ,  o ],
    [  o ,  o ,  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ,  o ,  o ],
    [  o ,  o ,  o ,WALL,____,____,____,____,____,sanc,____,____,____,____,____,WALL,  o ,  o ,  o ],
    [atmg,  o ,WALL,____,____,____,____,____,____,____,____,____,____,____,____,____,WALL,  o ,atmg],
    [  o ,  o ,WALL,____,____,____,____,____,____,____,____,____,____,____,____,____,WALL,  o ,  o ],
    [  o ,WALL,____,____,____,____,____,  K ,  K ,  K ,  K ,  K ,____,____,____,____,____,WALL,  o ],
    [  o ,WALL,____,____,____,____,  K ,  K ,  b ,  b ,  b ,  K ,  K ,____,____,____,____,WALL,  o ],
    [  o ,WALL,____,____,____,____,  K ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,WALL,  o ],
    [  o ,WALL,____,sanc,____,____,  K ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,sanc,____,WALL,  o ],
    [  o ,WALL,____,____,____,____,  K ,  b ,  b ,  b ,  b ,  b ,  K ,____,____,____,____,WALL,  o ],
    [  o ,WALL,____,____,____,____,  K ,  K ,  b ,  b ,  b ,  K ,  K ,____,____,____,____,WALL,  o ],
    [  o ,WALL,____,____,____,____,____,  K ,  K ,  K ,  K ,  K ,____,____,____,____,____,WALL,  o ],
    [  o ,  o ,WALL,____,____,____,____,____,____,____,____,____,____,____,____,____,WALL,  o ,  o ],
    [atmg,  o ,WALL,____,____,____,____,____,____,____,____,____,____,____,____,____,WALL,  o ,atmg],
    [  o ,  o ,  o ,WALL,____,____,____,____,____,sanc,____,____,____,____,____,WALL,  o ,  o ,  o ],
    [  o ,  o ,  o ,  o ,WALL,WALL,____,____,____,____,____,____,____,WALL,WALL,  o ,  o ,  o ,  o ],
    [  o ,  o ,  o ,  o ,  o ,  o ,WALL,WALL,WALL,WALL,WALL,WALL,WALL,  o ,  o ,  o ,  o ,  o ,  o ],
    [  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,  o ,atmg,  o ,  o ,  o ,  o ],
];

module.exports = room;