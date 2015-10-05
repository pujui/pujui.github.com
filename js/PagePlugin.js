/*!
 * PagePlugin 1.0 ()
 * Copyright 
 * Licensed under MIT 
 */
if (typeof jQuery === 'undefined') {
    throw new Error('PagePlugin\'s JavaScript requires jQuery')
}

function PagePlugin(){
    if(this.debug !== true){
        this.prototype.log = function(title, message){};
    }
}
PagePlugin.prototype.debug = true;

(function( $ ) {
    
    PagePlugin.prototype.replaceValues = {
        totalNumber   : null,
        pageNumber    : null,
        rangePage     : null,
        prevPage      : null,
        nextPage      : null,
        nowPage       : null,
        params        : null,
        url           : null,
        page          : null,
        rangeNumber   : null
    };
    
    PagePlugin.prototype.genRange = function(){
        var totalPage = ((this.totalNumber%this.pageNumber > 0)? 1: 0) + parseInt(this.totalNumber/this.pageNumber);
        this.log('totalPage:', totalPage);
        
        var maxRangePage = parseInt(this.rangePage/2);
        var minRangePage = this.rangePage%2 > 0? maxRangePage+1: maxRangePage;
        this.log('minRangePage:', minRangePage);
        this.log('maxRangePage:', maxRangePage);
        
        var startRangePage = 1, endRangePage = 0;
        if(this.nowPage-minRangePage < 1){ 
            endRangePage = minRangePage - this.nowPage;
        }else{
            startRangePage = this.nowPage - minRangePage + 1;
        }
        if(this.nowPage+maxRangePage > totalPage){
            endRangePage = totalPage;
            var addRangPage = maxRangePage-(endRangePage-this.nowPage);
            if(addRangPage > 0){
                startRangePage = (startRangePage - addRangPage < 1)? 1: startRangePage - addRangPage;
            }
        }else{
            endRangePage = endRangePage + this.nowPage + maxRangePage;
        }
        this.log('startRangePage:', startRangePage);
        this.log('endRangePage:', endRangePage);
        
        var rangeNumber = [];
        for(var i=startRangePage; i<=endRangePage; i++ ){
            rangeNumber.push(i);
        }
        this.prevPage = (this.nowPage != 1 )? this.nowPage-1: null;
        this.nextPage = (this.nowPage != totalPage)? this.nowPage+1: null;
        return rangeNumber;
    }
    
    PagePlugin.prototype.genView = function(callback){
        this.replaceValues.rangeNumber = this.genRange();
        this.setTemplateValues();
        return callback.apply(this, this.replaceValues);
    }
    
    PagePlugin.prototype.genLoopPage = function(normal, special){
        var loopResult = '';
        for(var i in this.replaceValues.rangeNumber){
            this.replaceValues.page = this.replaceValues.rangeNumber[i];
            if(this.replaceValues.page === this.replaceValues.nowPage){
                loopResult += this.replace(this.replaceValues, special);
            }else{
                loopResult += this.replace(this.replaceValues, normal);
            }
        }
        return loopResult;
    }
    
    PagePlugin.prototype.genPage = function(string){
        return this.replace(this.replaceValues, string);
    }
    
    PagePlugin.prototype.replace = function(replaces, string){
        for(var varaible in replaces){
            string = string.replace(new RegExp('{'+varaible+'}', 'g'), replaces[varaible]);
        }
        return string;
    }
    
    PagePlugin.prototype.setTemplateValues = function(){
        this.replaceValues.prevPage = this.prevPage;
        this.replaceValues.nextPage = this.nextPage;
        this.replaceValues.totalNumber = this.totalNumber;
        this.replaceValues.url = this.url;
        this.replaceValues.params = '';
        if(this.params){
            for(var name in this.params){
                this.replaceValues.params += '&' + name + '=' + encodeURIComponent(this.params[name]);
            }
        }
    }
    
    PagePlugin.prototype.apply = function(config){
        if(config.totalNumber){
            this.totalNumber = parseInt(config.totalNumber);
        }
        if(config.rangePage){
            this.rangePage = parseInt(config.rangePage);
        }
        if(config.pageNumber){
            this.pageNumber = parseInt(config.pageNumber);
        }
        if(config.nowPage){
            this.nowPage = parseInt(config.nowPage);
        }
        if(config.params){
            this.params = config.params;
        }
        if(config.url){
            this.url = config.url;
        }else{
            this.url = location.pathname;
        }
        return this;
    }
    
    PagePlugin.prototype.log = function(title, message)
    {
        console.log(title, message);
    }
    
    PagePlugin.prototype.config = {
        template : PagePlugin.prototype.replaceValues
    };
    
    $.fn.pageConfig = function(alias, config){
        var targetConfig = PagePlugin.prototype.config[alias];
        if(!targetConfig){
            targetConfig = PagePlugin.prototype.config.template;
        }
        if(config.totalNumber){
            targetConfig.totalNumber = parseInt(config.totalNumber);
        }
        if(config.rangePage){
            targetConfig.rangePage = parseInt(config.rangePage);
        }
        if(config.pageNumber){
            targetConfig.pageNumber = parseInt(config.pageNumber);
        }
        if(config.nowPage){
            targetConfig.nowPage = parseInt(config.nowPage);
        }
        if(config.params){
            targetConfig.params = config.params;
        }
        if(config.url){
            targetConfig.url = config.url;
        }else{
            targetConfig.url = location.pathname;
        }
        PagePlugin.prototype.config[alias] = targetConfig;
        return this;
    }
    
    $.fn.pagePlugin = function(callback) {
        
        var pagePlugin = new PagePlugin();
        
        var config = this.attr('config');
        
        var r = pagePlugin.apply(pagePlugin.config[config]).genView(callback);
        
        this.html(r);
        return this;
    };
    
}( jQuery ));
