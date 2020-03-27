var domain = 'https://view-awesome-table.com/';

function comsInit() {
    setTimeout(() => {
    
        if (document.querySelectorAll('iframe[data-type="AwesomeTableView"]').length < 1) {
            console.log("too soon");
            comsInit();
            return;
        }
        
        console.log("logging works at least");
        console.log(document.getElementById('sandboxFrame'));
        console.log(document.getElementById('userHtmlFrame'));
        console.log(document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0]);
        console.log(document.getElementById('dashboard'));
        
        iframe = document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0].contentWindow;

        
        //listen to holla back
        var gotResponse = false;
        window.addEventListener('message',function(event) {
            if(event.origin !== 'https://view-awesome-table.com') return;
            console.log('received response:  ',event.data);
            console.log(event.origin);
            gotResponse=true;
        },false);

        function sendInitialMessage(iframe) {
            var message = 'Hello!  The time is: ' + (new Date().getTime());
            console.log('blog.local:  sending message:  ' + message);
            iframe.postMessage(message,domain); //send the message and target URI
            setTimeout(function () {
                if (!gotResponse) {
                    sendInitialMessage(iframe);
                }
            }, 1000);
        }

        // initial message
        sendInitialMessage(iframe);

    }, 10);
    
}
comsInit();