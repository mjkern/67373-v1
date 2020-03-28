var domain = 'https://view-awesome-table.com/';

function comsInit() {
    setTimeout(function() {
    
        // make sure the awesome table exists and check back later if needed
        if (document.querySelectorAll('iframe[data-type="AwesomeTableView"]').length < 1) {
            console.log("too soon");
            comsInit();
            return;
        }
        
        iframe = document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0].contentWindow;
        
        //listen to holla back
        var gotResponse = false;
        window.addEventListener('message',function(event) {
            if(event.origin !== 'https://view-awesome-table.com') return;
            if(event.data.type !== 'initResponse') {
                console.log("bad response");
                return;
            }
            console.log('received response:  ',event.data);
            console.log(event.origin);
            gotResponse=true;
        },false);

        
        // initial message
        function sendInitialMessage(iframe) {
            google.script.run // this could all be more efficient
                .withSuccessHandler(function (accessibleLinkData) {
                    console.log(accessibleLinkData);
                    var body = 'Hello!  The time is: ' + (new Date().getTime());
                    var message = {
                        "type": "initMessage",
                        "body": body,
                        "accessibleLinkData": accessibleLinkData
                    };
                    console.log('blog.local:  sending message: ' + 'message');
                    iframe.postMessage(message,domain); //send the message and target URI
                    setTimeout(function () {
                        if (!gotResponse) {
                            sendInitialMessage(iframe);
                        }
                    }, 1000);
                })
                .withFailureHandler(function (error) {
                    console.log(error);
                })
                .accessibleEditLinks();
        }
        sendInitialMessage(iframe);

    }, 10);
    
}
comsInit();