
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

    cards = document.querySelectorAll(".custom-card-content");
    console.log(cards);
    for (var i = 0; i < cards.length; i++) {
        const card = cards[i];
        const editButton = document.createElement('button');
        editButton.class = "edit-button";
        const row = card.getAttribute('data-spreadsheet-row');
        editButton.onclick = function () { edit(row, editButton); };
        editButton.appendChild(document.createTextNode("Edit"));
        card.appendChild(editButton);
    }
    var someHtml = '<button onclick="edit({{Row}}, this)" class="edit-button">Edit</button>';
},false);

// for DOM updates in the awesome table cards
// function doSlightlyLater(f) {
//     setTimeout(f, 5000);
// }

// doSlightlyLater(function () {
//     var tableNodes = document.querySelectorAll(".awesomeTable-visualization-cards");
//     console.assert(tableNodes.length == 1);
//     table = tableNodes[0];
//     console.log(table);

//     var observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function (mutation) {
//             mutation.addedNodes.forEach(function (addedNode) {
//                 console.log(addedNode);
//             });
//         });
//     });

//     observer.observe(table, {
//         childList: true,
//         subtree: true
//     });
// });

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