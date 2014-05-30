/**
 * tileConfig
 * @author Kim's
 */
function tileConfig(config){
	// 遊戲方格比
	this.tilePoint = {x: 5, y: 5};
	// 文字顏色
	this.textColor = "#ccc";
	// 文字位置比重
	this.textLocalPower = {x : 0.3, y : 0.6};
	// 數值背景顏色
	this.valueBgColor = "#FF0000";
	// 背景顏色
	this.bgColor = "#000";
	// 邊框線條顏色
	this.LineColor = "#ccc";
	// 邊框線比重 (先以px設計)
	this.LineWeight = 1;
	// 目標 node
	this.target = config.target;
	// 方塊出線的數值, 2的次方
	this.tileNumbers = [2, 4];
	// 過關數
	if(typeof config.number !== 'undefined'){
		this.number = config.number;
	}else{
		this.number = 2048;
	}
	
	// 遊戲寬度
	if(typeof config.width !== 'undefined'){
		this.width = config.width;
	}else{
		this.width = 400;
	}
	
	// 遊戲高度
	if(typeof config.height !== 'undefined'){
		this.height = config.height;
	}else{
		this.height = 400;
	}
}