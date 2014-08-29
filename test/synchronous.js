<script type="text/javascript">
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
        console.log('sleep:'+synchronous.runInt);
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                console.log(this.intVals[intval]);
                if(this.intVals[intval] === true){
                    break;
                }
                console.log('sleep run:'+synchronous.runInt);
                start = new Date().getTime();
            }
        }
    }
};
function run(){
    console.log('run:'+synchronous.runInt);
    synchronous.stop(synchronous.runInt);
    // do something
}
console.log('start');
synchronous.runInt = setTimeout(run, 1000);
synchronous.start(synchronous.runInt);
synchronous.sleep(synchronous.runInt);
// do something
console.log('end:'+synchronous.runInt);
</script>