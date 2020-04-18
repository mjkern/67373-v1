////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////

// for sending messages to the awesome table
var domain = 'https://view-awesome-table.com';

////////////////////////////////////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////////////////////////////////////

// will store the edit access information
accessInfo = null;

// true once the awesome table confirms that it recieved the access info
var gotResponse = false;

////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////////////////////////////////////

// listen for web socket messages
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

////////////////////////////////////////////////////////////////////////////////
// State checking boolean functions
////////////////////////////////////////////////////////////////////////////////

// true once the awesome table exists in the DOM
function awesomeTableExists() {
    return document.querySelectorAll('iframe[data-type="AwesomeTableView"]').length > 0;
}

// true once the access info has been received from the google sheet
function accessInfoRecieved() {
    return accessInfo !== null;
}

// true once the awesome table confirms receipt of the init message
function awesomeTableConfirmed() {
    return gotResponse;
}

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////

// get the access information for editing lesson plans from the google sheet
function getAccessInfo() {
    console.log("getting access info");
    google.script.run
        .withSuccessHandler(function(accessInfoResult) {
            console.log("got access info");
            accessInfo = accessInfoResult;
        })
        .withFailureHandler(function(error) {
            console.log(error);
            doSlightlyLater(getAccessInfo);
        })
        .accessibleEditLinks();
}

// sends an init message to the given iframe
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

// send the init message to the awesome table until it confirms that it is received
function sendDataToAwesomeTable() {
    iframe = document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0].contentWindow;
    doUntil(function() { sendInitialMessage(iframe); }, awesomeTableConfirmed);
    
}

////////////////////////////////////////////////////////////////////////////////
// Actually do stuff
////////////////////////////////////////////////////////////////////////////////

getAccessInfo();
doWhenBoth(awesomeTableExists, accessInfoRecieved, sendDataToAwesomeTable);