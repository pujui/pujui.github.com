/**
 * tileConfig
 * 
 * @author Kim's
 */
function tileConfig(config){
    // Set area
    this.tilePoint = {x: 5, y: 5};
    // Set text color
    this.textColor = "#ccc";
    // Set number bgcolor list
    this.numberColorList = {
        4        : "#FF00BF",
        8        : "#BF00FF",
        16        : "#0000FF",
        32        : "#0080FF",
        64        : "#00FFFF",
        128        : "#00FF80",
        256        : "#00FF00",
        512        : "#BFFF00",
        1024    : "#FFFF00",
        2048    : "#2A120A"
    };
    // Set text weight
    this.textLocalPower = {x : 0.3, y : 0.6};
    this.textLocalPowerList = {
        4 : {x : 0.1, y : 0.6},
        5 : {x : 0.1, y : 0.6},
        6 : {x : 0.1, y : 0.6}
    };
    this.textFont = '30px Georgia';
    this.textFontList = {
        4 : '25px Georgia',
        5 : '20px Georgia',
        6 : '15px Georgia'
    };
    // Set base background color.
    this.valueBgColor = "#FF0000";
    // Set background color.
    this.bgColor = "#000";
    // Set border color.
    this.LineColor = "#ccc";
    // The border(px)
    this.LineWeight = 1;
    // Init document element.
    this.target = config.target;
    // Set base random numbers.
    this.tileNumbers = [2, 4];
    //Pass the mission success.
    if(typeof config.number !== 'undefined'){
        this.number = config.number;
    }else{
        this.number = 2048;
    }
    // Set width.
    if(typeof config.width !== 'undefined'){
        this.width = config.width;
    }else{
        this.width = 400;
    }
    // Set height.
    if(typeof config.height !== 'undefined'){
        this.height = config.height;
    }else{
        this.height = 400;
    }
}