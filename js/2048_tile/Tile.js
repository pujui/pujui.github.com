/**
 * Tile
 * @author Kim's
 */
function Tile(config){
	this.config = config;
	// X 與 Y 長度
	this.line = [];
	// 圖形區塊資料
	this.area = [];
	// 移動物件
	this.moveClass = new TileMove(this);
	return this;
}

Tile.prototype.isDebug = true;

Tile.prototype.init = function(){
	this.node = $(this.config.target);
	// 設定遊戲區域長寬
	this.node.attr('width', this.config.width);
	this.node.attr('height', this.config.height);
	// bind all event by keydown
	$(window).on('keydown', $.proxy(this.catchKeyDown, this));
	// 計算遊戲畫面大小
	this.setCalculateLine();
	// 初始化區域資料
	this.createInitPoint();
	// 建立初始點
	for(var i = 0; i < 2; i++){
		this.createPoint();
	}
	// 刷新介面
	this.render();
	return this;
}

// 抓取移動事件
Tile.prototype.catchKeyDown = function( e ){
	var master = this;
	var moveStatus = false;
	var action = {
		37 : function(){ // LEFT
			moveStatus = master.calculateMoveLeft('trigger');
		},
		38 : function(){ // TOP
			moveStatus = master.calculateMoveTop('trigger');
		},
		39 : function(){ // RIGHT
			moveStatus = master.calculateMoveRight();
		},
		40 : function(){ // BOTTOM
			moveStatus = master.calculateMoveBottom('trigger');
		},
	};
	if(!action[e.keyCode]){
		return;
	}
	action[e.keyCode]();
	if(moveStatus == true){
		this.createPoint();
	}
	this.moveClass.clearRecord();
	this.render();
}

Tile.prototype.calculateMoveRight = function(){
	var local = {x : 0, y : 0};
	var moveStatus, checkStatus = false;
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			local.x = this.config.tilePoint.x - x - 1;
			local.y = this.config.tilePoint.y - y - 1;
			if(this.area[local.x][local.y] < 1){
				continue;
			}
			checkStatus = this._calculateMoveRight(local.x, local.y);
			if(checkStatus === true){
				moveStatus = true;
			}
		}
	}
	return moveStatus;
}

Tile.prototype._calculateMoveRight = function(x, y){
	var local = {x : x, y : y};
	var moveRecord = {x : x, y : y};
	var moveAction;
	if(!this.moveClass.checkLocalMove(local, y, this.config.tilePoint.y-1)){
		return false;
	}
	for(var i = y; i < this.config.tilePoint.y; i++){
		moveAction = this.moveClass.doMoveAction(local, {x:x, y:i+1}, moveRecord);
		if(moveAction !== this.moveClass.moveDefine.space){
			break;
		}
	}
	return this.moveClass.merge(local, moveRecord);
}

Tile.prototype.calculateMoveLeft = function(action, x, y){
	if(action == 'trigger'){
		var local = {x : 0, y : 0};
		var moveStatus, checkStatus = false;
		for(var x = 0; x < this.config.tilePoint.x; x++){
			for(var y = 0; y < this.config.tilePoint.y; y++){
				local.x = x;
				local.y = y;
				if(this.area[local.x][local.y] > 0){
					this.calculateMoveLeft('', local.x, local.y);
					if(checkStatus === true){
						moveStatus = true;
					}
				}
			}
		}
		return moveStatus;
	}
	
	// 紀錄目前位置
	var local = {x : x, y : y};
	var moveRecord = {x : x, y : y};
	var moveAction;
	
	if(!this.moveClass.checkLocalMove(local, y, 0)){
		return false;
	}
	
	for(var i = y; i > 0; i--){
		moveAction = this.moveClass.doMoveAction(local, {x:x, y:i-1}, moveRecord);
		if(moveAction !== this.moveClass.moveDefine.space){
			break;
		}
	}
	
	return this.moveClass.merge(local, moveRecord);
}

Tile.prototype.calculateMoveTop = function(action, x, y){
	if(action == 'trigger'){
		var local = {x : 0, y : 0};
		var moveStatus, checkStatus = false;
		for(var y = 0; y < this.config.tilePoint.y; y++){
			for(var x = 0; x < this.config.tilePoint.x; x++){
				local.x = x;
				local.y = y;
				if(this.area[local.x][local.y] > 0){
					checkStatus = this.calculateMoveTop('', local.x, local.y);
					if(checkStatus === true){
						moveStatus = true;
					}
				}
			}
		}
		return moveStatus;
	}
	
	// 紀錄目前位置
	var local = {x : x, y : y};
	var moveRecord = {x : x, y : y};
	var moveAction;
	
	if(!this.moveClass.checkLocalMove(local, x, 0)){
		return false;
	}
	
	for(var i = x; i > 0; i--){
		moveAction = this.moveClass.doMoveAction(local, {x:i-1, y:y}, moveRecord);
		if(moveAction !== this.moveClass.moveDefine.space){
			break;
		}
	}
	return this.moveClass.merge(local, moveRecord);
}

Tile.prototype.calculateMoveBottom = function(action, x, y){
	if(action == 'trigger'){
		var local = {x : 0, y : 0};
		var moveStatus, checkStatus = false;
		for(var y = 0; y < this.config.tilePoint.y; y++){
			for(var x = 0; x < this.config.tilePoint.x; x++){
				local.x = this.config.tilePoint.x - x - 1;
				local.y = this.config.tilePoint.y - y - 1;
				if(this.area[local.x][local.y] > 0){
					checkStatus = this.calculateMoveBottom('', local.x, local.y);
					if(checkStatus === true){
						moveStatus = true;
					}
				}
			}
		}
		return moveStatus;
	}
	
	// 紀錄目前位置
	var local = {x : x, y : y};
	var moveRecord = {x : x, y : y};
	var moveAction;
	
	if(!this.moveClass.checkLocalMove(local, x, this.config.tilePoint.x-1)){
		return false;
	}
	
	for(var i = x; i < this.config.tilePoint.x; i++){
		// 已無法移動
		if(i == this.config.tilePoint.x-1){
			break;
		}
		moveAction = this.moveClass.doMoveAction(local, {x:i+1, y:y}, moveRecord);
		if(moveAction !== this.moveClass.moveDefine.space){
			break;
		}
	}
	
	return this.moveClass.merge(local, moveRecord);
}

// 計算方塊的X與Y長度
Tile.prototype.setCalculateLine = function(){
	this.line.x = this.config.width/this.config.tilePoint.x;
	this.line.y = this.config.height/this.config.tilePoint.y;
}

/**
 * 建立圖形區塊
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

// 建立隨機位置
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

// 取隨機值
Tile.prototype.randNumber = function(maxLength){
	return Math.floor( Math.random() * ( maxLength + 1 ) );
}

// 刷新canvas
Tile.prototype.render = function(){
	var context = this.node[0].getContext('2d');
	for(var x = 0; x < this.config.tilePoint.x; x++){
		for(var y = 0; y < this.config.tilePoint.y; y++){
			this._createDiagram(context, x, y);
		}
	}
}

// 繪製圖形
Tile.prototype._createDiagram = function(context, x, y){
	// 邊框建立
	context.fillStyle = this.config.LineColor;
	context.fillRect(
		y * this.line.x,
		x * this.line.y,
		this.line.x,
		this.line.y
	);
	if(this.area[x][y] > 0){
		// 數值內容建立
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
		// 空值內容建立
		context.fillStyle = this.config.bgColor;
		context.fillRect(
			y * this.line.x - this.config.LineWeight,
			x * this.line.y - this.config.LineWeight,
			this.line.x - this.config.LineWeight,
			this.line.y - this.config.LineWeight
		);
	}
}

// show log
Tile.prototype.log = function(log){
	if(typeof console !== 'undefined' && this.isDebug === true){
		console.log(log);
	}
	return this;
}
