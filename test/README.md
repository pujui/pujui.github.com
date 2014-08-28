
var synchronous = {
    intVals : [], runInt : 0,
    start : function(intval){
        this.intVals[intval] = false;
    },
    stop : function(intval){
        this.intVals[intval] = true;
    },
    sleep : function(intval){
        var start = new Date().getTime();
        var milliseconds = 1000;
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                if(this.intval[intval] === true){
                    break;
                }else{
                    this.sleep(intval);
                }
            }
        }
    }
};

function run(){
    synchronous.stop(synchronous.intval);
    // do something
}

synchronous.runInt = setTimeout(run, 1000);
synchronous.start(synchronous.runInt);
synchronous.sleep(synchronous.runInt);
// do something