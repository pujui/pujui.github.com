/**
 * TileMove
 * @author Kim's
 */
function TileMove(master){
	this.master = master;
	this.moveRecords = [];
	return this;
}

TileMove.prototype.moveDefine = {
	merge	: 'merge',	// 已經合併過
	space	: 'space',	// 空閒位置
	same	: 'same',	// 相同數值
	no		: 'no'		// 不可移動
};

// 本地合併至目標並清除
TileMove.prototype.merge = function(local, moveLocal){
	// 同位置不需合併
	if(local.x == moveLocal.x && local.y == moveLocal.y){
		return false;
	}
	this.master.area[moveLocal.x][moveLocal.y] = this.master.area[local.x][local.y];
	this.master.area[local.x][local.y] = 0;
	return true;
}

TileMove.prototype.checkLocalMove = function(local, xy, max){
	// 該位置無值, 不需移動
	if(this.master.area[local.x][local.y] == 0){
		return false;
	}
	// 已無法移動
	if(xy == max){
		return false;
	}
	return true;
}

// 本地搬移至目標地點, 並回傳處理結果。
TileMove.prototype.doMoveAction = function(local, moveLocal, moveRecord){
	// 已經合併過 不給合併
	if(this.moveRecords[moveLocal.x] && this.moveRecords[moveLocal.x][moveLocal.y] === true){
		return this.moveDefine.merge;
	}
	// 移動目標未被佔據給移動
	if(this.master.area[moveLocal.x][moveLocal.y] == 0){
		moveRecord.x = moveLocal.x;
		moveRecord.y = moveLocal.y;
		return this.moveDefine.space;
	// 移動目標與本地一樣記錄合併
	}else if(this.master.area[moveLocal.x][moveLocal.y] == this.master.area[local.x][local.y]){
		moveRecord.x = moveLocal.x;
		moveRecord.y = moveLocal.y;
		this.master.area[local.x][local.y] *= 2;
		if(typeof this.moveRecords[moveLocal.x] === "undefined"){
			this.moveRecords[moveLocal.x] = [];
		}
		this.moveRecords[moveLocal.x][moveLocal.y] = true;
		return this.moveDefine.same;
	}
	return this.moveDefine.no;
}

// 清除搬移記錄
TileMove.prototype.clearRecord = function(){
	this.moveRecords = [];
}