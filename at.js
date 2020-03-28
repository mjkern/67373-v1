function hideShow(button) {
    //retrieving the two elements we want to hide and show on the press of the button
    const seeMoreDiv = button.parentNode.querySelector(".seemore");
    const placeholderDiv = button.parentNode.querySelector(".placeholder");
    //if the element is hidden, display it and update the text in the button
    if(seeMoreDiv.style.display == "none"){
        seeMoreDiv.style.display = "block";
        placeholderDiv.style.display = "none";
        button.innerHTML = "HIDE";
        console.log("showing");
        alert("showing");
    }
    //if the element is visible, hide it and update the text in the button
    else{
        seeMoreDiv.style.display = "none";
        placeholderDiv.style.display = "block";
        button.innerHTML = "MORE";
        console.log("hiding");
        alert("hiding");
    }
    // alert(google.script.run.hannah())
    // parent.postMessage('asdf','jkl;');
}

var editLinkData = [];

function edit(rowNumber) {
    console.log("trying to edit - row number " + rowNumber);
    // alert("trying to edit - row number " + rowNumber);
    link = editLinkData.filter(function (row) {
        return row[1].toString() === rowNumber;
    })[0][2];
    if (link) {
        window.open(link, '_blank');
    } else {
        alert("sorry, no access");
    }
}

window.addEventListener('message',function(event) {
    if(event.origin !== 'https://n-eqadiyagk5beydaifnjqivawwbzm2n5gqy5jccq-0lu-script.googleusercontent.com') return;
    if(event.data.type !== "initMessage") return;
    editLinkData = event.data.accessibleLinkData;
    event.source.postMessage({"type": "initResponse", "heardFromOrigin": event.origin, "gotLinkData": editLinkData},event.origin);
},false);

//////// working on only showing links where appropriate ////////
// Select the node that will be observed for mutations
const targetNode = document.documentElement;

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// taken from
//https://stackoverflow.com/questions/5898656/check-if-an-element-contains-a-class-in-javascript
function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

function updateEditLinks(node) {
    if (hasClass(node, "edit-link")) {
        console.log(node);
    }

    for (var i = 0; i < node.children; i++) {
        updateEditLinks(node.children[i]);
    }
}

// Callback function to execute when mutations are observed
const callback = function(mutationRecords, observer) {
    // Use traditional 'for loops' for IE 11
    // for(let addition of mutationRecord.addedNodes) {
    //     // if (mutation.type === 'childList') {
    //     //     console.log('A child node has been added or removed.');
    //     // }
    //     // else if (mutation.type === 'attributes') {
    //     //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
    //     // }
    // }
    console.log("nodes added:");
    mutationRecords.forEach(function(record) {
        record.addedNodes.forEach(updateEditLinks);
    });
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);