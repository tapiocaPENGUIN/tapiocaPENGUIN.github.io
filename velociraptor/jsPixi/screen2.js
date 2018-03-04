var End_Game = false;

var Location = function(_x, _y) {
	this.x = _x;
	this.y = _y;

	this.plus = function(otherLoc) {
		var outX = this.x + otherLoc.x;
		var outY = this.y + otherLoc.y;
		return new Location(outX, outY);
	}
}

var range = function(tl, br) {
	this.topLeft = tl;
	this.botRight = br;
	this.center = new Location(((br.x - tl.x) / 2)
		+ tl.x, ((tl.y - br.y) / 2) + br.y);

	this.inRange = function(target){
		//console.log(target.loc.x, this.topLeft.x);
		if(target.loc.x + 20 >= this.topLeft.x && target.loc.x <= this.botRight.x
			&& target.loc.y >= this.topLeft.y && target.loc.y <= this.botRight.y){

			return true;
		}

		return false;
	}
}

var Ball = function(play_type) {
	if(play_type == "pass") {
		this.thrown = false;		// has the ball been thrown
		this.caught = false;		// has the ball been caught
	}

	this.play = play_type;
	this.player;
	this.yards = -5;				//starting gain in yards at snap
	this.steps = [];
	this.index = 0;
	this.ready = false;
	this.loc;

	this.setPlayer = function(newPlayer) {
		this.player = newPlayer;
		this.loc = newPlayer.loc;
	};

	this.handoff = function(newPlayer) {
		this.player = newPlayer;
		newPlayer.takeBall();
	}


	this.down = function(player) {
		if(this.thrown == true) {
			if(this.caught == true) {
				this.yards = player.yards;
			}
			else {
				this.yards = 0;
			}
		}
	}

	this.throw = function(targetLoc) {
		if(this.thrown == false){
			//console.log("ball thrown");
			this.thrown = true;
			this.steps.push(this.player.loc);

			for(i = 1; i <= 90; i++) {
				var newX = (this.player.loc.x + ((targetLoc.x - this.player.loc.x) / 90) * i);
				var newY = (this.player.loc.y + ((targetLoc.y - this.player.loc.y) / 90) * i);
				this.steps.push(new Location(newX, newY));
			}
		}
	}

	this.move = function() {
		if(this.caught == true || this.thrown == false){
			this.loc = this.player.loc;
		}
		else if(this.thrown == true){
			if(this.index >= this.steps.length - 1 && this.ready == false) {
				//console.log("ball ready");
				this.ready = true;
			}
			else {
				this.loc = this.steps[this.index];
				this.index++;
			}
		}
	}

	this.action = function() {
		this.move();
	}
}

var Player = function(_name, _loc) {
	this.name = _name;
	this.loc = _loc;
	this.status = "free" 	//Could be free, blocked, ball, tackled
	this.yards = 0; 		//how many yards made by player with the ball
	this.index = 0;			//position into steps
	this.hasBall = false;

	this.steps = [this.loc];


	this.takeBall = function() {
	this.hasBall = true;
	}

	this.addLeg = function(loc, time) {
		var lastLoc = this.steps[this.steps.length - 1];

		for(i = 1; i <= time * 60; i++) {
			var newX = (lastLoc.x + ((loc.x - lastLoc.x) / (time * 60)) * i);
			var newY = (lastLoc.y + ((loc.y - lastLoc.y) / (time * 60)) * i);
			this.steps.push(new Location(newX, newY));
		}
	}

	this.move = function() {
		if(this.index < this.steps.length && this.status != "tackled") {
			this.loc = this.steps[this.index];
		}
		this.index++;
	}

	this.action = function() {
		this.move();
	}
}

var Running_Back = function(_name, _loc, _ball) {
	Player.call(this, _name, _loc);
	this.ball = _ball;
}

var Receiver = function(_name, _loc, _qb, _ball) {
	Player.call(this, _name, _loc);
	this.ball = _ball;
	this.qb = _qb;
	this.defs;
	this.range;

	this.setDefs = function(_defs){
		this.defs = _defs;
	}

	this.catch = function() {
		if(this.qb.recv == this && this.ball.ready == true && this.ball.caught == false){
			console.log("player caught the ball");
			this.hasBall = true;
			this.ball.caught = true;
			this.ball.player = this;
			this.setRange(new Location(this.loc.x + 20, this.loc.y), 15, 15);
		}
	}

	this.setRange = function(center, xRadius, yRadius) {
		this.range = new range(
			center.plus(new Location(-xRadius, -yRadius)),
			center.plus(new Location(xRadius, yRadius))
		);
	}

	this.action = function() {
		this.move();
		this.catch();

		if(this.hasBall) {
			for(j = 0; j < this.defs.length; j++) {
				if(this.range.inRange(this.defs[j]) && this.status != "tackled") {
					this.status = "tackled";
					console.log("player tackled");
					app.ticker.stop();
					End_Game = true;
					break;
				}
			}

		}
	}
}

var LineMan = function(_name, _loc, _ball) {
	Player.call(this, _name, _loc);
	this.ball = _ball;
}

var Defensive_Back = function(_name, _speed, _loc) {
	Player.call(this, _name, _loc);

	this.speed = _speed;	// being distance per second

	this.ROC = function(loc, dist) {
		return (dist / Math.sqrt(Math.pow(loc.x, 2) + Math.pow(loc.y, 2) ) );
	}

	this.chase = function(targetLoc, x_multiplier, y_multiplier) {
		newLoc = new Location((targetLoc.x - this.loc.x), (targetLoc.y - this.loc.y))
		this.loc.x = this.loc.x + (newLoc.x
			* this.ROC(targetLoc, x_multiplier * (this.speed / 60)));

		this.loc.y = this.loc.y + (newLoc.y
			* this.ROC(targetLoc, y_multiplier * (this.speed / 60)));
	}

	this.action = function() {
		this.move();
	}
}

var Defensive_Back_Man = function(_name, _speed, _target, _loc, _ball) {
	Defensive_Back.call(this, _name, _speed, _loc);
	this.target = _target;
	this.thresh = this.loc.y + 25;
	this.ball = _ball;

	this.slide = function() {
		this.loc.x += 0.8 * (this.target.loc.x - this.loc.x);
	}

	this.move = function() {
		if(this.target.loc.y >= this.thresh) {
			this.slide(this.target);
		}
		else {
			this.chase(this.target.loc, 12, 12);
		}
	}

	this.action = function() {
		if(this.ball.caught) {
			if(this.ball.player.loc.x <= width /2) 
				newLoc = new Location (this.ball.player.loc.x - 80, this.ball.player.loc.y -180);
			else newLoc = new Location (this.ball.player.loc.x + 80, this.ball.player.loc.y -180);
			this.chase(newLoc, .4, 6);
		}
		else {
			this.move();
		}

	}
}

var Defensive_Safety = function(_name, _speed, _loc) {
	Defensive_Back.call(this, _name, _speed, _loc);
	this.recvs = [];
	this.target;
	this.lead = 60;
	this.final = false;

	this.setRecvs = function(_recvs){
		this.recvs = _recvs;
		this.target = this.recvs[0];
	}

	this.chooseTarget = function(){
		if(this.final == false){
			for(j = 0; j < this.recvs.length; j++) {
				if(this.recvs[j].loc.y < this.target.loc.y) {
					this.target = this.recvs[j];
				}
				if(this.recvs[j].hasBall == true){
					this.target = this.recvs[j];
					this.final = true;
					this.lead = 30;
					break;
				}
			}
		}
	}

	this.action = function() {
		this.chooseTarget();
		if(this.target.hasBall) {
			if(this.target.steps[this.target.index + this.lead] != undefined)
				newLoc = this.target.steps[this.target.index + this.lead];
			else newLoc = new Location(this.target.loc.x, this.target.loc.y - 80);
			this.chase(newLoc, 2, 1.2 + (50 - this.lead)/100);
		}
		else if(this.target.loc.y <= this.loc.y + height * 1.5) {
			newLoc = this.target.steps[this.target.index + this.lead];
			this.chase(newLoc, 2, 2 + (30 - this.lead)/20);
		}
		if(this.lead > 10) {
			this.lead--;
		}
	}
}

var Defensive_Back_Zone = function(_name, _speed, _loc, _coverage) {
	Defensive_Back.call(this, _name, __speed, _loc);

	this.range;

	this.setRange = function(center, xRadius, yRadius) {
		this.range = new range(
			center.plus(new Location(-xRadius, yRadius)),
			center.plus(new Location(xRadius, -yRadius))
		);
	}

	this.move = function(targets) {
		targets.forEach(function(target) {
			if(this.range.inRange(target)) {
				this.chase(target, 1);
				return;
			}
			else {
				this.chase(this.range.center, .4);
			}
		});
	}

	this.action = function() {
		this.move();
	}
}

var Quarter_Back = function(_name, _loc, wait, _ball) {
	Player.call(this, _name, _loc);
	this.wait_time = wait * 60;	//nums of secs to wait
	this.index = 0;
	this.range;
	this.ball = _ball;
	this.hasBall = true;
	this.recv;

	this.setRecv = function(_recv) {
		this.recv = _recv;
	}

	this.setRange = function() {
		this.range = new range(
			this.loc.plus(new Location(-100, -100)),
			this.loc.plus(new Location(100, 100))
		);
	}

	this.throw = function(target){
		//console.log("qb threw");
		if(target.steps[target.index + 90] != undefined) {
			this.ball.throw(target.steps[target.index + 90])
		}
		else {
			this.ball.throw(target.steps[target.steps.length - 1])
		}
	}

	this.action = function(){
		if(this.ball.play == "run" && this.wait_time <= this.index) {
			this.setRange();
			if(this.range.inRange(this.recv) && this.hasBall == true){
				this.ball.handoff(this.recv);
       			this.hasBall = false;
			}
			else {
				this.play = "pass";
				this.wait_time += 60;
			}
		}
		if(this.ball.play == "pass" && this.ball.thrown == false && this.wait_time <= this.index) {
			//console.log("qb preparing to throw");
			this.throw(this.recv);
		}
		if(this.index < this.steps.length && this.status != "tackled") {
			this.loc = this.steps[this.index];
		}
		this.index++;
	}
}


//init 1
	var width = 770;
	var height = 70;
	var app = new PIXI.Application(width, 12 * height);

	document.body.appendChild(app.view);

	// make textures
	var texture = PIXI.Texture.fromImage("light_green.jpg");
	var texture2 = PIXI.Texture.fromImage("dark_green.png");

	// create tiling sprites
	var tiles = [];
	for(i = 0; i < 12; i ++) {
		if(i % 2 == 1) var tile = new PIXI.TilingSprite(texture2, width, height);
		else var tile = new PIXI.TilingSprite(texture, width, height);
		tile.y = height * i;
		tiles.push(tile);
	}


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
function play(){

	// game
	var Sprites = [];
	var objs = [];
	var Coords = [];
	var PlayLines = [];

	var Look2 = function(){
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

		objs.push(new LineMan("DL1", new Location(width / 2 - 95, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL2", new Location(width / 2 - 45, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL3", new Location(width / 2 + 5, 8 * height - 55), objs[0]));
		objs.push(new LineMan("DL4", new Location(width / 2 + 55, 8 * height - 55), objs[0]));

		objs.push(new LineMan("DL5", new Location(width / 2 - 110, 8 * height - 100), objs[0]));
		objs.push(new LineMan("DL6", new Location(width / 2 + 70, 8 * height - 100), objs[0]));

		objs.push(new Running_Back("RB", new Location(width / 2 - 70, 10 * height - 40), objs[0]));



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

	Look2();

	var but1 = PIXI.Sprite.fromImage("reset_arrow.png");
	var but2 = PIXI.Sprite.fromImage("next_arrow.png");

	var task1 = function(){
		End_Game = false;
		task2();
		play();
	}

	but1.interactive = true;
	but1.buttonMode = true;
	but1.on("click", task1);

	var task2 = function(){
		if(index >= 4) {
			Clear_Routes();
			console.log("clear routes");
		}
		index++;
		app.ticker.start(); 
	}

	but2.interactive = true;
	but2.buttonMode = true;
	but2.on("click", task2);



	/* ~~~~~~~~~~~~~~ CHANGE CODE ABOVE ~~~~~~~~~~~~~~ */

	function loadSprites(_objs){
		for(i = _objs.length - 1; i >= 0 ; i--) {
			Sprites[i].x = _objs[i].loc.x;
			Sprites[i].y = _objs[i].loc.y;
		}
	}

	but1.x = 10;
	but1.y = height * 10.1;
	but2.x = (width / 4) * 3 - 10;
	but2.y = height * 10.1;


	for(i = 0; i < tiles.length; i++) {
		app.stage.addChild(tiles[i]);
	}
	for(i = 0; i < Lines.length; i++) {
		app.stage.addChild(Lines[i]);
	}
	for(i = Sprites.length - 1; i >= 0 ; i--) {
		app.stage.addChild(Sprites[i]);
	}

	app.stage.addChild(but1);
	app.stage.addChild(but2);

	var set_Backs_Pass2 = function(){
		Coords.push(new Location(objs[2].loc.x - 20, 0));					//[0] recv1
		Coords.push(new Location(objs[3].loc.x - 10, 0));							//[2] recv2
		Coords.push(new Location(objs[4].loc.x + 10, 0));						//[5] recv3
		Coords.push(new Location(objs[5].loc.x + 20, 0));						//[6] recv4

		Coords.push(new Location(objs[22].loc.x, objs[22].loc.y));				//[8] RB
		Coords.push(new Location(objs[22].loc.x - 120, objs[22].loc.y));	//[9] RB
		Coords.push(new Location(objs[22].loc.x - 200, objs[22].loc.y -520));	//[10]RB

		objs[2].addLeg(Coords[0], 4);
		objs[3].addLeg(Coords[1], 2.8);
		objs[4].addLeg(Coords[2], 3);
		objs[5].addLeg(Coords[3], 3.5);

		objs[22].addLeg(Coords[4], .2);
		objs[22].addLeg(Coords[5], .7);
		objs[22].addLeg(Coords[6], 2.25);
	}

	var set_Line_Pass = function(){
		Coords.push(new Location(objs[11].loc.x, objs[11].loc.y + 80));
		Coords.push(new Location(objs[11].loc.x + 20, objs[11].loc.y + 110));
		Coords.push(new Location(objs[12].loc.x, objs[12].loc.y + 60));
		Coords.push(new Location(objs[13].loc.x, objs[13].loc.y + 45));
		Coords.push(new Location(objs[14].loc.x, objs[14].loc.y + 60));
		Coords.push(new Location(objs[15].loc.x, objs[12].loc.y + 80));
		Coords.push(new Location(objs[15].loc.x - 20, objs[15].loc.y + 110));

		Coords.push(new Location(objs[16].loc.x, objs[16].loc.y + 120));
		Coords.push(new Location(objs[17].loc.x, objs[17].loc.y + 70));
		Coords.push(new Location(objs[18].loc.x, objs[18].loc.y + 55));
		Coords.push(new Location(objs[19].loc.x, objs[19].loc.y + 70));
		Coords.push(new Location(objs[20].loc.x, objs[20].loc.y + 120));

		Coords.push(new Location(objs[21].loc.x + 10, objs[21].loc.y + 20));
		Coords.push(new Location(objs[21].loc.x + 90, objs[21].loc.y));
		Coords.push(new Location(objs[21].loc.x + 140, objs[21].loc.y - 360));
		

		objs[11].addLeg(Coords[7], .6);
		objs[11].addLeg(Coords[8], 1);
		objs[12].addLeg(Coords[9], .9);
		objs[13].addLeg(Coords[10], .9);
		objs[14].addLeg(Coords[11], .9);
		objs[15].addLeg(Coords[12], .6);
		objs[15].addLeg(Coords[13], 1);

		objs[16].addLeg(Coords[14], 1.5);
		objs[17].addLeg(Coords[15], 1.2);
		objs[18].addLeg(Coords[16], 1.2);
		objs[19].addLeg(Coords[17], 1.2);
		objs[20].addLeg(Coords[18], 1.5);

		objs[21].addLeg(Coords[19], .75);
		objs[21].addLeg(Coords[20], .75);
		objs[21].addLeg(Coords[21], 2);
	}

	var recv1 = objs[2];
	var recv2 = objs[3];
	var recv3 = objs[4];
	var recv4 = objs[5];

	var makeLine = function(s_coord, e_coord, color){
		var Line1 = new PIXI.Graphics();
		Line1.lineStyle(line_height * 2, color, 1);
		Line1.pivot.set(0, 0);
		Line1.rotation = 0;
		Line1.x = 15;
		Line1.moveTo(s_coord.x, s_coord.y);
		Line1.lineTo(e_coord.x, e_coord.y);
		PlayLines.push(Line1);
	}

	var Disp_Routes = function(){
		makeLine(recv1.loc, Coords[0], 0xffff00);

		makeLine(recv2.loc, Coords[1], 0xffff00);

		makeLine(recv3.loc, Coords[2], 0xff1aff);

		makeLine(recv4.loc, Coords[3], 0xffff00);



		for(i = 0; i < PlayLines.length; i++) {
			app.stage.addChild(PlayLines[i]);
		}
	}

	var Clear_Routes = function(){
		for(i = PlayLines.length - 1; i >= 0 ; i--) {
			PlayLines[i].destroy();
			PlayLines.pop();
		}
	}


	/* ~~~~~~~~~~~~~~ CHANGE CODE BELOW ~~~~~~~~~~~~~~ */

	set_Backs_Pass2();		//Backs Formation
	set_Line_Pass();		//Line Formation


	objs[0].setPlayer(objs[1]);
	objs[1].setRecv(recv3);

	/* ~~~~~~~~~~~~~~ CHANGE CODE ABOVE ~~~~~~~~~~~~~~ */


	for(i = 0; i < 4; i++) {
		objs[i + 2].setDefs([objs[6], objs[7], objs[8], objs[9], objs[10]]);
	}
	objs[10].setRecvs([recv1, recv2, recv3, recv4]);


	var index = 0;
	loadSprites(objs);
	app.ticker.add(function(delta) {
		if(End_Game) return;

		if(index == 2) {
			app.ticker.stop();
		}

		if(index == 4) {
			Disp_Routes();
			loadSprites(objs);
			app.ticker.stop();
		}

		for(i = 0; i < objs.length; i++) {
			objs[i].action();
		}

		loadSprites(objs);
		index++;

	});
}

play();
