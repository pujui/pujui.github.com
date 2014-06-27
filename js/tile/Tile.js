/**
 * Tile
 * @author Kim's
 */
function Tile(config){
	this.config = config;
	// X and Y length
	this.line = [];
	// Graph data
	this.area = [];
	// Move object
	this.moveClass = new TileMove(this);
	this.moveLogs = [];
	return this;
}

Tile.prototype.isDebug = true;

Tile.prototype.init = function(){
	this.node = $(this.config.target);
	// Setting width and height the game area
	this.node.attr('width', this.config.width);
	this.node.attr('height', this.config.height);
	// Bind all event by keydown
	$(window).on('keydown', this.catchKeyDown.bind(this));
	// Calculate width and height the game screen
	this.setCalculateLine();
	// Initalize the game area
	this.createInitPoint();
	// Initalize the point
	for(var i = 0; i < 2; i++){
		this.createPoint();
	}
	// Flash graph interface
	this.render();
	return this;
}
Tile.prototype.setDegreeOfDifficulty = function( event, target ){
	var action = $(event).val();
	if(action == '+'){
		this.config.number *= 2;
	}else if(action == '-'){
		this.config.number /= 2;
	}
	$(target).val(this.config.number);
	this.log();
}

// Catch move event
Tile.prototype.catchKeyDown = function( e ){
	var master = this;
	var moveStatus = false;
	var action = {
		37 : function(){ // LEFT
			moveStatus = master.moveClass.calculateMoveLeft();
		},
		38 : function(){ // TOP
			moveStatus = master.moveClass.calculateMoveTop();
		},
		39 : function(){ // RIGHT
			moveStatus = master.moveClass.calculateMoveRight();
		},
		40 : function(){ // BOTTOM
			moveStatus = master.moveClass.calculateMoveBottom();
		},
	};
	if(!action[e.keyCode]){
		return;
	}
	action[e.keyCode]();
	if(moveStatus == true){
		this.createPoint();
	}
	// clear the move record
	this.moveClass.clearRecord();
	// active the move animation
	this.moveClass.renderAnimation();
	// check game mission success
	this.processGameOver();
}


// Calculate width and height the point
Tile.prototype.setCalculateLine = function(){
	this.line.x = this.config.width/this.config.tilePoint.x;
	this.line.y = this.config.height/this.config.tilePoint.y;
}

/**
 * Draw graph area
	(Y)
	|
	|
	|_____(X)
*/
Tile.prototype.createInitPoint = function(){
	this.area = [];
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			if(!this.area[x]){
				this.area[x] = [];
			}
			this.area[x][y] = 0;
		}
	}
}

// Create random location
Tile.prototype.createPoint = function(){
	var colloctSpacePoint = [];
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			if(this.area[x][y] == 0){
				colloctSpacePoint.push({x : x, y : y});
			}
		}
	}
	var maxLength = colloctSpacePoint.length;
	if(maxLength > 0){
		var randNumber = this.randNumber(maxLength - 1);
		var point = colloctSpacePoint[randNumber];
		this.area[point.x][point.y] = this.config.tileNumbers[ this.randNumber(this.config.tileNumbers.length - 1)]
		return true;
	}
	return false;
}

// Set max-length to get a random number
Tile.prototype.randNumber = function(maxLength){
	return Math.floor( Math.random() * ( maxLength + 1 ) );
}

// Flash canvas
Tile.prototype.render = function(){
	var context = this.node[0].getContext('2d');
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			this._createDiagram(context, x, y);
		}
	}
}

// Draw tile
Tile.prototype._createDiagram = function(context, x, y){
	// Draw graph border
	context.fillStyle = this.config.LineColor;
	context.fillRect(
		y * this.line.x,
		x * this.line.y,
		this.line.x,
		this.line.y
	);
	if(this.area[x][y] > 0){
		// Draw graph number point
		context.fillStyle = this.config.valueBgColor;
		context.fillRect(
			y * this.line.x - this.config.LineWeight,
			x * this.line.y - this.config.LineWeight,
			this.line.x - this.config.LineWeight,
			this.line.y - this.config.LineWeight
		);
		context.fillStyle = this.config.textColor;
		context.font = "30px Georgia";
		context.fillText(
			this.area[x][y],
			( y + this.config.textLocalPower.x ) * this.line.x,
			( x + this.config.textLocalPower.y ) * this.line.y
		);
	}else{
		// Draw graph empty point
		context.fillStyle = this.config.bgColor;
		context.fillRect(
			y * this.line.x - this.config.LineWeight,
			x * this.line.y - this.config.LineWeight,
			this.line.x - this.config.LineWeight,
			this.line.y - this.config.LineWeight
		);
	}
}

Tile.prototype.processGameOver = function(){
	var missionSucceed = false;
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			if(this.area[x][y] >= this.config.number){
				missionSucceed = true;
			}
		}
	}
	if(missionSucceed === true){
		alert('MISSION SUCCESS!!');
	}
}

// show log
Tile.prototype.log = function(log){
	if(typeof console !== 'undefined' && this.isDebug === true){
		console.log(log);
	}
	return this;
}
