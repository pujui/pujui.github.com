
function GmailAuth(config){
    this.config = config;
    this.handleCallBack = null;
}

GmailAuth.prototype.handle = function (event){
    gapi.auth.authorize(
        {client_id: this.config.CLIENT_ID, scope: this.config.SCOPES, immediate: false}, 
        this.handleAuthResult
    );
    return false;
}

GmailAuth.prototype.handleAuthResult = function(authResult){
    // success
    if(authResult && !authResult.error){
        gapi.client.load('gmail', 'v1', GmailAuth.prototype.testCallback);
    // failed
    }else{
        alert('failed');
    }
}

GmailAuth.prototype.testCallback = function(){
    // do something
}
