


//init 1
	var width = 770;
	var height = 70;
	var app = new PIXI.Application(width, 12 * height);

	document.body.appendChild(app.view);

	// make textures
	var texture = PIXI.Texture.fromImage("light_green.jpg");
	var texture2 = PIXI.Texture.fromImage("dark_green.png");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// create tiling sprites
	var tiles = [];
	for(i = 0; i < 12; i ++) {
		if(i % 2 == 1) var tile = new PIXI.TilingSprite(texture2, width, height);
		else var tile = new PIXI.TilingSprite(texture, width, height);
		tile.y = height * i;
		tile.interactive = true;
		tile.buttonMode = true;
		tile.on("click", onDown);
		tiles.push(tile);
	}
	var points = [];
	points[0] = [125, 8 * height];

	function clearArray(array) {
		points = [];
	}
	function onDown(event) {
		var len = points.length;
		var x = event.data.originalEvent.clientX;
		var y = event.data.originalEvent.clientY;

		if (len >= 1) {
			var line = new PIXI.Graphics();
			line.lineStyle(4, 0xffff00, 1);
			line.pivot.set(0, 0);
			line.rotation = 0;
			line.moveTo(points[len-1][0], points[len-1][1]);
			line.lineTo(x, y);
			app.stage.addChild(line);
		}
		points.push([x, y]);
	}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	var line_height = 6;
	var add_y = line_height / 2;

	// create horizontal lines
	var Lines = [];
	for (i = 1; i < 12; i++) {
		var line = new PIXI.Graphics();
		line.lineStyle(line_height, 0xffffff, 1);
		line.rotation = 1.5709;
		line.x = width;
		line.y = tiles[i].y + add_y;
		line.moveTo(0,0);
		line.lineTo(0, width);
		Lines.push(line);
	}

	// vertical lines
	var vLine1 = new PIXI.Graphics();
	vLine1.lineStyle(line_height, 0xffffff, 1);
	vLine1.pivot.set(0, 0);
	vLine1.rotation = 0;
	vLine1.x = 250;
	vLine1.moveTo(0,0);
	vLine1.lineTo(0, height * 12);
	Lines.push(vLine1);

	var vLine2 = new PIXI.Graphics();
	vLine2.lineStyle(line_height, 0xffffff, 1);
	vLine2.pivot.set(0, 0);
	vLine2.rotation = 0;
	vLine2.x = 520;
	vLine2.moveTo(0, 0);
	vLine2.lineTo(0, height * 12);
	Lines.push(vLine2);

//init 2

	// game
	var Sprites = [];
	var objs = [];

	var Look1 = function(){
		objs.push(new Ball("pass"));
		objs.push(new Quarter_Back("qb", new Location(width / 2 - 20, 10 * height - 40), 1, objs[0]));
		objs.push(new Receiver("r1", new Location(125, 8 * height), objs[1], objs[0]));
		objs.push(new Receiver("r2", new Location(225, 8 * height), objs[1], objs[0]));
		objs.push(new Receiver("r3", new Location(width - 225, 8 * height), objs[1], objs[0]));
		objs.push(new Receiver("r4", new Location(width - 125, 8 * height), objs[1], objs[0]));
		objs.push(new Defensive_Back_Man('d1', 120, objs[2], new Location(125, 6 * height), objs[0] ));
		objs.push(new Defensive_Back_Man('d2', 120, objs[3], new Location(225, 6 * height), objs[0]));
		objs.push(new Defensive_Back_Man('d3', 120, objs[4], new Location(width - 225, 6 * height), objs[0]));
		objs.push(new Defensive_Back_Man('d4', 120, objs[5], new Location(width - 125, 6 * height), objs[0]));
		objs.push(new Defensive_Safety('s', 140, new Location((width / 2 - 20), 2.5 * height)));
		objs.push(new LineMan("OL1", new Location(width / 2 - 120, 8 * height), objs[0]));
		objs.push(new LineMan("OL2", new Location(width / 2 - 70, 8 * height), objs[0]));
		objs.push(new LineMan("OL3", new Location(width / 2 - 20, 8 * height), objs[0]));
		objs.push(new LineMan("OL4", new Location(width / 2 + 30, 8 * height), objs[0]));
		objs.push(new LineMan("OL5", new Location(width / 2 + 80, 8 * height), objs[0]));
		objs.push(new LineMan("DL1", new Location(width / 2 - 120, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL2", new Location(width / 2 - 70, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL3", new Location(width / 2 - 20, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL4", new Location(width / 2 + 30, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL5", new Location(width / 2 + 80, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL6", new Location(width / 2 + 70, 8 * height - 100), objs[0]));

		objs.push(new Running_Back("RB", new Location(width / 2 + 30, 10 * height - 40), objs[0]));

		Sprites.push(PIXI.Sprite.fromImage("American_Football.png"));
		Sprites.push(PIXI.Sprite.fromImage("Lol_circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));

		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));
		Sprites.push(PIXI.Sprite.fromImage("red-circle-hi.png"));

		Sprites.push(PIXI.Sprite.fromImage("Pan_Blue_Circle.png"));
	}

	/* ~~~~~~~~~~~~~~ CHANGE CODE BELOW ~~~~~~~~~~~~~~ */

	Look1();

	/* ~~~~~~~~~~~~~~ CHANGE CODE ABOVE ~~~~~~~~~~~~~~ */

	function loadSprites(_objs){
		for(i = Sprites.length - 1; i >= 0 ; i--) {
			Sprites[i].x = _objs[i].loc.x;
			Sprites[i].y = _objs[i].loc.y;
		}
	}

	for(i = 0; i < 12; i++) {
		app.stage.addChild(tiles[i]);
	}
	for(i = 0; i < 13; i++) {
		app.stage.addChild(Lines[i]);
	}
	for(i = Sprites.length - 1; i >= 0 ; i--) {
		app.stage.addChild(Sprites[i]);
	}


	var set_Backs_Pass1 = function(){
		objs[2].addLeg(new Location(objs[2].loc.x - 120, 200), 4);
		objs[2].addLeg(new Location(objs[2].loc.x - 120, 5), 1.5);
		objs[3].addLeg(new Location(objs[3].loc.x, 500), 1);
		objs[3].addLeg(new Location(objs[3].loc.x + 250, 450), 1.4);
		objs[3].addLeg(new Location(objs[3].loc.x + 250, 0), 2);
		objs[4].addLeg(new Location(objs[4].loc.x, 0), 3);
		objs[5].addLeg(new Location(objs[5].loc.x + 85, 180), 3.5);
		objs[5].addLeg(new Location(objs[5].loc.x + 85, 0), 1.4);
		objs[22].addLeg(new Location(objs[22].loc.x, objs[22].loc.y), .5);
		objs[22].addLeg(new Location(objs[22].loc.x + 120, objs[22].loc.y + 15), .5);
		objs[22].addLeg(new Location(objs[22].loc.x + 200, objs[22].loc.y -520), 2.25);
	}

	var set_Line_Pass = function(){
		objs[11].addLeg(new Location(objs[11].loc.x, objs[11].loc.y + 80), .6);
		objs[11].addLeg(new Location(objs[11].loc.x + 20, objs[11].loc.y + 110), 1);
		objs[12].addLeg(new Location(objs[12].loc.x, objs[12].loc.y + 60), .9);
		objs[13].addLeg(new Location(objs[13].loc.x, objs[13].loc.y + 45), .9);
		objs[14].addLeg(new Location(objs[14].loc.x, objs[14].loc.y + 60), .9);
		objs[15].addLeg(new Location(objs[15].loc.x, objs[12].loc.y + 80), .6);
		objs[15].addLeg(new Location(objs[15].loc.x - 20, objs[15].loc.y + 110), 1);

		objs[16].addLeg(new Location(objs[16].loc.x, objs[16].loc.y + 120), 1.5);
		objs[17].addLeg(new Location(objs[17].loc.x, objs[17].loc.y + 70), 1.2);
		objs[18].addLeg(new Location(objs[18].loc.x, objs[18].loc.y + 55), 1.2);
		objs[19].addLeg(new Location(objs[19].loc.x, objs[19].loc.y + 70), 1.2);
		objs[20].addLeg(new Location(objs[20].loc.x, objs[20].loc.y + 120), 1.5);

		objs[21].addLeg(new Location(objs[21].loc.x + 10, objs[21].loc.y + 20), .75);
		objs[21].addLeg(new Location(objs[21].loc.x + 90, objs[21].loc.y), .75);
		objs[21].addLeg(new Location(objs[21].loc.x + 140, objs[21].loc.y - 360), 2);
	}

	var recv1 = objs[2];
	var recv2 = objs[3];
	var recv3 = objs[4];
	var recv4 = objs[5];


	/* ~~~~~~~~~~~~~~ CHANGE CODE BELOW ~~~~~~~~~~~~~~ */

	set_Backs_Pass1();		//Backs Formation
	set_Line_Pass();		//Line Formation


	objs[0].setPlayer(objs[1]);
	objs[1].setRecv(recv4);

	/* ~~~~~~~~~~~~~~ CHANGE CODE ABOVE ~~~~~~~~~~~~~~ */


	for(i = 0; i < 4; i++) {
		objs[i + 2].setDefs([objs[6], objs[7], objs[8], objs[9], objs[10]]);
	}
	objs[10].setRecvs([recv1, recv2, recv3, recv4]);


app.ticker.add(function(delta) {
	//console.log(objs[2].hasBall, objs[3].hasBall, objs[4].hasBall, objs[5].hasBall);

	for(i = 0; i < objs.length; i++) {
		objs[i].action();
	}
	if(End_Game) return;
	loadSprites(objs);
});
