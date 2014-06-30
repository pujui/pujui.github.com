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
    // Move logs
    this.moveLogs = [];
    // Obtain score
    this.score = 0;
    return this;
}

// test for debug
Tile.prototype.isDebug = true;

// Initalize
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

// set difficulty the game
Tile.prototype.setDegreeOfDifficulty = function( action ){
    if(action == '+' && this.config.number*2<=5000000){
        this.config.number *= 2;
    }else if(action == '-' && this.config.number/2>=1){
        this.config.number /= 2;
    }
    this.updatedDifficulty(this.config.number);
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
    // If keydown not 37 to 40 then exit.
    if(!action[e.keyCode]){
        return;
    }
    action[e.keyCode]();
    if(moveStatus == true){
        this.createPoint();
    }
    // Clear the move record
    this.moveClass.clearRecord();
    // Active the move animation
    this.moveClass.renderAnimation();
    // Check mission success
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
    this.moveClass.drawAllBackground(context);
    
    for(var x = 0; x < this.config.tilePoint.x; x++){
        for(var y = 0; y < this.config.tilePoint.y; y++){
            this.moveClass.drawTile(context, {x:x, y:y, value: this.area[x][y]});
        }
    }
}

// Check mission success
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
        if(confirm('Increased difficulties?')){
            // do something
        }
    }
}

// Updated score.
Tile.prototype.updatedScore = function(){
    // do something
}

// Updated Difficulty.
Tile.prototype.updatedDifficulty = function(number){
    // do something
}

// show log
Tile.prototype.log = function(log){
    if(typeof console !== 'undefined' && this.isDebug === true){
        console.log(log);
    }
    return this;
}