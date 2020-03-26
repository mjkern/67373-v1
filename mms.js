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
    
    var iframe = document.querySelectorAll('iframe[data-type="AwesomeTableView"]')[0].contentWindow;

    //periodical message sender
    setInterval(function(){
    var message = 'Hello!  The time is: ' + (new Date().getTime());
    console.log('blog.local:  sending message:  ' + message);
    iframe.postMessage(message,domain); //send the message and target URI
    },6000);
    
    //listen to holla back
    window.addEventListener('message',function(event) {
    if(event.origin !== 'https://view-awesome-table.com') return;
    console.log('received response:  ',event.data);
    console.log(event.origin);
    },false);
    }, 10);
}
comsInit();