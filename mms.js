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

// will be the awesome table iframe
var iframe = null;

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
    if(event.origin !== domain) return;
    switch (event.data.type) {
        case initResponseType:
            gotResponse = true;
            break;
        case deleteMessageType:
            google.script.run
                .withSuccessHandler(function(deleted) {
                    if (deleted) {
                        iframe.postMessage({ type: deleteResponseType },domain);
                        gotResponse = false;
                        setTimeout(sendDataToAwesomeTable, 3000);
                    } else {
                        console.log("failed to delete");
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
    google.script.run
        .withSuccessHandler(function(accessInfoResult) {
            accessInfo = accessInfoResult;
        })
        .withFailureHandler(function(error) {
            doSlightlyLater(getAccessInfo);
        })
        .accessInfo();
}

// sends an init message to the given iframe
function sendInitialMessage() {
    var body = 'Hello!  The time is: ' + (new Date().getTime());
    var message = {
        "type": "initMessage",
        "body": body,
        "accessibleLinkData": accessInfo
    };
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