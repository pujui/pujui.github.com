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
    merge    : 'merge',    // It was merged
    space    : 'space',    // This is space
    same    : 'same',    // The same value
    no        : 'no'        // Can not move
};

// Merge local and target after clear local the location
TileMove.prototype.merge = function(local, moveLocal){
    // If it is the same location then can not merge.
    if(local.x == moveLocal.x && local.y == moveLocal.y){
        return false;
    }
    this.master.area[moveLocal.x][moveLocal.y] = this.master.area[local.x][local.y];
    this.master.area[local.x][local.y] = 0;
    if(typeof this.moveRecords[moveLocal.x] !== "undefined" 
        && this.moveRecords[moveLocal.x][moveLocal.y]){
        this.master.score += this.master.area[moveLocal.x][moveLocal.y];
        this.master.updatedScore(this.master.score);
    }
    return true;
}

// Merge local to target
TileMove.prototype.doMerge = function(area, local, moveLocal){
    // If local and target the same location
    if(local.x == moveLocal.x && local.y == moveLocal.y){
        return false;
    }
    area[moveLocal.x][moveLocal.y] = area[local.x][local.y];
    area[local.x][local.y] = 0;
    return true;
}

TileMove.prototype.checkLocalMove = function(local, xy, max){
    // If this is not value the localtion then can not move
    if(this.master.area[local.x][local.y] == 0){
        return false;
    }
    // Can not move
    if(xy == max){
        return false;
    }
    return true;
}

// The localtion move to target and return status.
TileMove.prototype.doMoveAction = function(local, moveLocal, moveRecord){
    // If it was merged then can not merge.
    if(this.moveRecords[moveLocal.x] && this.moveRecords[moveLocal.x][moveLocal.y] === true){
        return this.moveDefine.merge;
    }
    // If move to target is empty then copy to it.
    if(this.master.area[moveLocal.x][moveLocal.y] == 0){
        moveRecord.x = moveLocal.x;
        moveRecord.y = moveLocal.y;
        return this.moveDefine.space;
    // If move to target the same location then merge it.
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

// Clear move records.
TileMove.prototype.clearRecord = function(){
    this.moveRecords = [];
}

// Clone area move object.
TileMove.prototype.cloneAreaToMoveLog = function (area)
{
    var moveLog = [];
    for(var x in area){
        for(var y in area[x]){
            if(!moveLog[x]){
                moveLog[x] = [];
            }
            moveLog[x][y] = area[x][y];
        }
    }
    return moveLog;
}

TileMove.prototype.calculateMoveRight = function(){
    var local = {x : 0, y : 0},
        moveStatus = false,
        tempStatus;
    for(var x = 0; x < this.master.config.tilePoint.x; x++){
        for(var y = 0; y < this.master.config.tilePoint.y; y++){
            local.x = this.master.config.tilePoint.x - x - 1;
            local.y = this.master.config.tilePoint.y - y - 1;
            if(this.master.area[local.x][local.y] < 1){
                continue;
            }
            tempStatus = this._calculateMoveRight(local.x, local.y);
            if(tempStatus === true){
                moveStatus = true;
            }
        }
    }
    return moveStatus;
}

TileMove.prototype._calculateMoveRight = function(x, y){
    var local = {x : x, y : y};
    var moveRecord = {x : x, y : y};
    var moveAction, cloneRecord;
    if(!this.checkLocalMove(local, y, this.master.config.tilePoint.y-1)){
        return false;
    }
    for(var i = y; i < this.master.config.tilePoint.y; i++){
        cloneRecord = {
            local : {
                x: moveRecord.x, 
                y: moveRecord.y
            }
        };
        moveAction = this.doMoveAction(local, {x:x, y:i+1}, moveRecord);
        if(moveAction !== this.moveDefine.space){
            break;
        }
        this.saveMoveLogs(cloneRecord, moveRecord, x, y);
    }
    return this.merge(local, moveRecord);
}

TileMove.prototype.calculateMoveLeft = function(){
    var local = {x : 0, y : 0},
        moveStatus;
    for(var x = 0; x < this.master.config.tilePoint.x; x++){
        for(var y = 0; y < this.master.config.tilePoint.y; y++){
            local.x = x;
            local.y = y;
            if(this.master.area[local.x][local.y] < 1){
                continue;
            }
            tempStatus = this._calculateMoveLeft(local.x, local.y);
            if(tempStatus === true){
                moveStatus = true;
            }
        }
    }
    return moveStatus;
}

TileMove.prototype._calculateMoveLeft = function(x, y){
    var local = {x : x, y : y};
    var moveRecord = {x : x, y : y};
    var moveAction, cloneRecord;
    if(!this.checkLocalMove(local, y, 0)){
        return false;
    }
    for(var i = y; i > 0; i--){
        cloneRecord = {
            local : {
                x: moveRecord.x, 
                y: moveRecord.y
            }
        };
        moveAction = this.doMoveAction(local, {x:x, y:i-1}, moveRecord);
        if(moveAction !== this.moveDefine.space){
            break;
        }
        this.saveMoveLogs(cloneRecord, moveRecord, x, y);
    }
    return this.merge(local, moveRecord);
}

TileMove.prototype.calculateMoveTop = function(x, y){
    var local = {x : 0, y : 0},
        moveStatus = false;
    for(var y = 0; y < this.master.config.tilePoint.y; y++){
        for(var x = 0; x < this.master.config.tilePoint.x; x++){
            local.x = x;
            local.y = y;
            if(this.master.area[local.x][local.y] < 1){
                continue;
            }
            tempStatus = this._calculateMoveTop(local.x, local.y);
            if(tempStatus === true){
                moveStatus = true;
            }
        }
    }
    return moveStatus;
}

TileMove.prototype._calculateMoveTop = function(x, y){
    var local = {x : x, y : y};
    var moveRecord = {x : x, y : y};
    var moveAction, cloneRecord;
    if(!this.checkLocalMove(local, x, 0)){
        return false;
    }
    for(var i = x; i > 0; i--){
        cloneRecord = {
            local : {
                x: moveRecord.x, 
                y: moveRecord.y
            }
        };
        moveAction = this.doMoveAction(local, {x:i-1, y:y}, moveRecord);
        if(moveAction !== this.moveDefine.space){
            break;
        }
        this.saveMoveLogs(cloneRecord, moveRecord, x, y);
    }
    return this.merge(local, moveRecord);
}


TileMove.prototype.calculateMoveBottom = function(x, y){
    var local = {x : 0, y : 0},
        moveStatus = false;
    for(var y = 0; y < this.master.config.tilePoint.y; y++){
        for(var x = 0; x < this.master.config.tilePoint.x; x++){
            local.x = this.master.config.tilePoint.x - x - 1;
            local.y = this.master.config.tilePoint.y - y - 1;
            if(this.master.area[local.x][local.y] < 1){
                continue;
            }
            tempStatus = this._calculateMoveBottom(local.x, local.y);
            if(tempStatus === true){
                moveStatus = true;
            }
        }
    }
    return moveStatus;
}

TileMove.prototype._calculateMoveBottom = function(x, y){
    var local = {x : x, y : y};
    var moveRecord = {x : x, y : y};
    var moveAction, cloneRecord;
    if(!this.checkLocalMove(local, x, this.master.config.tilePoint.x-1)){
        return false;
    }
    for(var i = x; i < this.master.config.tilePoint.x; i++){
        cloneRecord = {
            local : {
                x: moveRecord.x, 
                y: moveRecord.y
            }
        };
        if(i == this.master.config.tilePoint.x-1){
            break;
        }
        moveAction = this.doMoveAction(local, {x:i+1, y:y}, moveRecord);
        if(moveAction !== this.moveDefine.space){
            break;
        }
        this.saveMoveLogs(cloneRecord, moveRecord, x, y);
    }
    return this.merge(local, moveRecord);
}

// Render the move animation
TileMove.prototype.renderAnimation = function(flashBackground){
    var area;
    var context = this.master.node[0].getContext('2d');
    if(flashBackground === true){
        this.drawAllBackground(context);
    }
    var hasMove = false;
    for(var i in this.master.moveLogs){
        this.master.moveLogs[i];
        if(!this.master.moveLogs[i]){
            continue;
        }
        for(var j in this.master.moveLogs[i]){
            if(this.master.moveLogs[i][j] && this.master.moveLogs[i][j].length > 0)
            {
                area = this.master.moveLogs[i][j].shift();
                this.drawBackground(context, area.local.x, area.local.y);
                this.drawTile(context, {x:area.x, y:area.y, value: area.value});
                hasMove = true;
            }
        }
    }
    if(hasMove === true){
        setTimeout('tile.moveClass.renderAnimation(false)', 50);
    }else{
        this.master.render();
    }
}

// Draw the tile
TileMove.prototype.drawTile = function(context, local)
{
    if(local.value > 0){
        // Draw graph number point
        if(this.master.config.numberColorList[local.value]){
            context.fillStyle = this.master.config.numberColorList[local.value];
        }else{
            context.fillStyle = this.master.config.valueBgColor;
        }
        context.fillRect(
            local.y * this.master.line.x - this.master.config.LineWeight,
            local.x * this.master.line.y - this.master.config.LineWeight,
            this.master.line.x - this.master.config.LineWeight,
            this.master.line.y - this.master.config.LineWeight
        );
        context.fillStyle = this.master.config.textColor;
        var stringLen = (local.value+'').length;
        if(this.master.config.textFontList[stringLen]){
            context.font = this.master.config.textFontList[stringLen];
        }else{
            context.font = this.master.config.textFont;
        }
        if(this.master.config.textLocalPowerList[stringLen]){
            context.fillText(
                local.value,
                ( local.y + this.master.config.textLocalPowerList[stringLen].x ) * this.master.line.x,
                ( local.x + this.master.config.textLocalPowerList[stringLen].y ) * this.master.line.y
            );
        }else{
            context.fillText(
                local.value,
                ( local.y + this.master.config.textLocalPower.x ) * this.master.line.x,
                ( local.x + this.master.config.textLocalPower.y ) * this.master.line.y
            );
        }
    }else{
        // Draw graph empty point
        context.fillStyle = this.master.config.bgColor;
        context.fillRect(
            local.y * this.master.line.x - this.master.config.LineWeight,
            local.x * this.master.line.y - this.master.config.LineWeight,
            this.master.line.x - this.master.config.LineWeight,
            this.master.line.y - this.master.config.LineWeight
        );
    }
}

// Draw area the background
TileMove.prototype.drawBackground = function(context, x, y)
{
    // Draw graph border
    context.fillStyle = this.master.config.LineColor;
    context.fillRect(
        y * this.master.line.x,
        x * this.master.line.y,
        this.master.line.x,
        this.master.line.y
    );
    this.drawTile(context, { x: x, y: y, value: 0 });
}

// Draw all the background
TileMove.prototype.drawAllBackground = function(context)
{
    context.fillStyle = this.master.config.LineColor;
    context.fillRect(
        0,
        0,
        this.master.config.width,
        this.master.config.height
    );
    for(var x = 0; x < this.master.config.tilePoint.x; x++){
        for(var y = 0; y < this.master.config.tilePoint.y; y++){
            this.drawTile(context, { x: x, y: y, value: 0 });
        }
    }
}

// Save local move to target recodrs.
TileMove.prototype.saveMoveLogs = function(cloneRecord, moveRecord, x, y){
    cloneRecord.x = moveRecord.x;
    cloneRecord.y = moveRecord.y;
    cloneRecord.value = this.master.area[x][y];
    if(!this.master.moveLogs[x]){
        this.master.moveLogs[x] = [];
    }
    if(!this.master.moveLogs[x][y]){
        this.master.moveLogs[x][y] = [];
    }
    this.master.moveLogs[x][y].push(cloneRecord);
}