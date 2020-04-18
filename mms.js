// for sending messages to the awesome table
var domain = 'https://view-awesome-table.com';

function doSlightlyLater(f) {
    setTimeout(f, 1000);
}

function doWhen(f, p) {
    if (p()) {
        f();
    } else {
        doSlightlyLater(function () { doWhen(f, p); });
    }
}

function doUntil(f, p) {
    if (!p()) {
        f();
        doSlightlyLater(function () { doUntil(f, p); });
    }
}

function doWhenBoth(p1, p2, f) {
    if (p1() && p2()) {
        f();
    } else {
        doSlightlyLater(function () { doWhenBoth(p1, p2, f); });
    }
}

//listen to holla back
var gotResponse = false;
window.addEventListener('message',function(event) {
    console.log("got a response before checking origin");
    console.log(event.origin);
    if(event.origin !== domain) return;
    if(event.data.type !== 'initResponse') {
        console.log("bad response");
        return;
    }
    console.log('received response:  ',event.data);
    console.log(event.origin);
    gotResponse=true;
},false);

function awesomeTableExists() {
    return document.querySelectorAll('iframe[data-type="AwesomeTableView"]').length > 0;
}

accessInfo = null;
function getAccessInfo() {
    console.log("getting access info");
    google.script.run
        .withSuccessHandler(function(accessInfoResult) {
            console.log("got access info");
            accessInfo = accessInfoResult;
        })
        .withFailureHandler(function(error) {
            console.log(error);
            doSlighlyLater(getAccessInfo);
        })
        .accessibleEditLinks();
}
function accessInfoRecieved() {
    return accessInfo !== null;
}

function awesomeTableConfirmed() {
    return gotResponse;
}

function sendInitialMessage(iframe) {
    var body = 'Hello!  The time is: ' + (new Date().getTime());
    var message = {
        "type": "initMessage",
        "body": body,
        "accessibleLinkData": accessInfo
    };
    console.log('blog.local:  sending message: ' + message);
    iframe.postMessage(message,domain); //send the message and target URI
}

function sendDataToAwesomeTable() {
    iframe = document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0].contentWindow;
    sendInitialMessage(iframe);
}

getAccessInfo();
doWhenBoth(awesomeTableExists, accessInfoRecieved, function() { 
    doUntil(sendDataToAwesomeTable, awesomeTableConfirmed);
});