
////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////
domain = 'https://n-r2hhbj5ldn54lekwf4x2jbxvxnmwltraikjhefa-0lu-script.googleusercontent.com';
initMessageType = 'initMessage';
initResponseType = 'initResponse';

////////////////////////////////////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////////////////////////////////////
var editLinkData = [];

////////////////////////////////////////////////////////////////////////////////
// Listeners
////////////////////////////////////////////////////////////////////////////////
window.addEventListener('message',function(event) {
    if(event.origin !== domain) return;
    if(event.data.type !== initMessageType) return;
    editLinkData = event.data.accessibleLinkData;
    event.source.postMessage({"type": initResponseType, "heardFromOrigin": event.origin, "gotLinkData": editLinkData},event.origin);
},false);

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////
function edit(rowNumber, button) {
    console.log("trying to edit - row number " + rowNumber);
    // alert("trying to edit - row number " + rowNumber);
    linkRows = editLinkData.filter(function (row) {
        return row[1] == rowNumber;
    });
    console.log(linkRows);
    console.log(linkRows[0]);
    // window.open(linkRows[0][2], '_blank');
    if (linkRows.length > 0) {
        window.open(linkRows[0][2], '_blank');
    }
    else {
        console.log("no access");
        button.innerText = "No Edit Access";
        // alert("Sorry, only the creator and Matt's Maker Space facilitators can edit this lesson plan. Please account managment page for more information.");
    }
}