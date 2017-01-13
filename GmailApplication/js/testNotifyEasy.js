var runInt = null, firstRun = true;
var temp_message_ids = [];


GmailAuth.prototype.testCallback = function(){
    document.getElementById('authorize-button').disabled = true;
    document.getElementById('start-notify-button').disabled = false;
    var request = gapi.client.gmail.users.messages.list({ 'userId': 'me' });
    request.execute(function(resp) {
        var messages = resp.messages;
        if (messages && messages.length > 0) {
            var m_request;
            for (i = 0; i < messages.length; i++) {
                if(temp_message_ids[messages[i].id])
                {
                    continue;
                }
                temp_message_ids[messages[i].id] = messages[i].id;
            }
        }
  });
}

function listMessages() {
    var request = gapi.client.gmail.users.messages.list({ 'userId': 'me' });
    request.execute(function(resp) {
        var messages = resp.messages;
        if (messages && messages.length > 0) {
            var m_request;
            for (i = 0; i < messages.length; i++) {
                if(temp_message_ids[messages[i].id])
                {
                    console.log('r' + Date.now());
                    continue;
                }
                console.log('n' + Date.now());
                temp_message_ids[messages[i].id] = messages[i].id;
                m_request = gapi.client.gmail.users.messages.get({ 'userId': 'me', id : messages[i].id });
                m_request.execute(function(resp) {
                    var content = {
                            snippet : resp.result.snippet,
                            from : '',
                            date : '',
                    };
                    var headers = resp.result.payload.headers;
                    for (j = 0; j < headers.length; j++) {
                        if(headers[j].name == 'From')
                        {
                            content.from = headers[j].value;
                        }
                        else if(headers[j].name == 'Date')
                        {
                            content.date = headers[j].value;
                        }
                    }
                    appendData(content);
                });
            }
        }
  });
}

function appendData(content) {
    var url = 'http://pj-kim.webscript.io/notify_gmail?'
                + 'reply=' + encodeURIComponent(document.getElementById('yourLineId').value)
                + '&from=' + encodeURIComponent(content.from)
                + '&date=' + encodeURIComponent(content.date)
                + '&message=' + encodeURIComponent(content.snippet);
    document.getElementById('output').innerHTML = '<iframe id="sendMessage" src="' + url + '" style="width: 1px; height: 1px;" ></iframe>';
    console.log('send' + Date.now());
    var pre = document.getElementById('outputData');
    var textContent = document.createTextNode(content.snippet + '\n');
    pre.appendChild(textContent);
}

function start_notify()
{
    document.getElementById('start-notify-button').disabled = true;
    document.getElementById('stop-notify-button').disabled = false;
    listMessages();
    runInt = setTimeout(start_notify, 3000);
}

function stop_notify()
{
    document.getElementById('start-notify-button').disabled = false;
    document.getElementById('stop-notify-button').disabled = true;
    if(runInt !== null)
    {
        clearTimeout(setTimeout);
        runInt = null;
    }
}
