
////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////
const parentOrigin = 'https://n-r2hhbj5ldn54lekwf4x2jbxvxnmwltraikjhefa-0lu-script.googleusercontent.com';
const initMessageType = 'initMessage';
const initResponseType = 'initResponse';
const deleteMessageType = 'deleteMessage';
const deleteResponseType = 'deleteResponse';

////////////////////////////////////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////////////////////////////////////
var editLinkData = null;
var parentSource = null;
var deleteAccess = null;

////////////////////////////////////////////////////////////////////////////////
// Listeners
////////////////////////////////////////////////////////////////////////////////
function addEditButtonToCard(card) {
    if (card.hasAttribute("data-button-done")){ return; }
    if (editLinkData == null){ return; }
    const row = card.getAttribute('data-spreadsheet-row');
    if (editLinkData[row]) {
        const editButton = document.createElement('button');
        editButton.classList.add("btn");
        editButton.onclick = function () { edit(row, editButton); };
        editButton.appendChild(document.createTextNode("Edit"));
        card.appendChild(editButton);
    }
    if (deleteAccess) {
        const deleteButton = document.createElement('a');
        deleteButton.appendChild(document.createTextNode('Delete'));
        // deleteButton.class = "delete-button";
        // deleteButton.onclick = function() { deleteLessonPlan(row); };
        deleteButton.href="#modal" + row;
        deleteButton.classList.add("btn");
        deleteButton.classList.add("modal-trigger");
        card.appendChild(deleteButton);
    }
    card.setAttribute("data-button-done", "");
}

window.addEventListener('message',function(event) {
    if(event.origin !== parentOrigin) return;
    if(event.data.type !== initMessageType) return;
    editLinkData = event.data.accessibleLinkData.editAccess;
    deleteAccess = event.data.accessibleLinkData.deleteAccess;
    parentSource = event.source;
    event.source.postMessage({"type": initResponseType, "heardFromOrigin": event.origin, "gotLinkData": editLinkData},event.origin);
    cards = document.querySelectorAll(".custom-card-content");
    console.log(cards);
    for (var i = 0; i < cards.length; i++) {
        const card = cards[i];
        addEditButtonToCard(card);
    }
    var elems = document.querySelectorAll('.modal');
    var options = {};
    var instances = M.Modal.init(elems, options);
    console.log(M);
},false);

// for DOM updates in the awesome table cards
var body = document.querySelector("body");

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            cards = document.querySelectorAll(".custom-card-content");
            for (var i = 0; i < cards.length; i++) {
                const card = cards[i];
                addEditButtonToCard(card);
            }
            return;
        }
    });
});

observer.observe(body, {
    childList: true,
    subtree: true
});

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////
function edit(rowNumber, button) {
    console.log("trying to edit - row number " + rowNumber);
    if (editLinkData == null) {
        console.log("no access data yet");
        return;
    }
    link = editLinkData[rowNumber];
    if (link) {
        window.open(link, '_blank');
    }
    else {
        console.log("no access");
        button.innerText = "No Edit Access";
    }
}

function deleteLessonPlan(rowNumber) {
    if (parentSource == null) {
        console.log("no parent source yet");
        return;
    }
    parentSource.postMessage({"type": deleteMessageType, "rowNumber": rowNumber}, parentOrigin);
}

////////////////////////////////////////////////////////////////////////////////
// For Materialize
////////////////////////////////////////////////////////////////////////////////
var script = document.createElement('script');
script.type = 'text/javascript';

script.src = 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js';
document.head.appendChild(script);