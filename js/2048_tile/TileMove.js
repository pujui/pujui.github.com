
function TileMove(master){
	this.master = master;
	return this;
}

TileMove.prototype.merge = function(local, moveLocal){
	// 同位置不需合併
	if(local.x == moveLocal.x && local.y == moveLocal.y){
		return false;
	}
	this.master.area[moveLocal.x][moveLocal.y] = this.master.area[local.x][local.y];
	this.master.area[local.x][local.y] = 0;
	return true;
}