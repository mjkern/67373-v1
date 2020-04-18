////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////

// for sending messages to the awesome table
const domain = 'https://view-awesome-table.com';
const initMessageType = 'initMessage';
const initResponseType = 'initResponse';
const deleteMessageType = 'deleteMessage';
const deleteResponseType = 'deleteResponse';

////////////////////////////////////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////////////////////////////////////

// will store the edit access information
var accessInfo = null;

// true once the awesome table confirms that it recieved the access info
var gotResponse = false;

////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////
function doSlightlyLater(f) {
    setTimeout(f, 100);
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
window.addEventListener('message', function(event) {
    console.log("got a message from " + event.origin);
    if(event.origin !== domain) return;
    switch (event.data.type) {
        case initResponseType:
            console.log('received response:  ',event.data);
            console.log(event.origin);
            gotResponse=true;
            break;
        case deleteMessageType:
            console.log('received delete message');
            google.script.run
                .withSuccessHandler(function(deleted) {
                    if (deleted) {
                        console.log("successfully deleted");
                    } else {
                        console.log("no delete permission");
                    }
                })
                .withFailureHandler(function(error) {
                    console.log("failed to delete:");
                    console.log(error);
                })
                .deleteLessonPlan(event.data.rowNumber);
            break;
        default:
            console.log("unknown message type");
    }
    
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