var editLinkData = [];

function edit(rowNumber) {
    console.log("trying to edit - row number " + rowNumber);
    // alert("trying to edit - row number " + rowNumber);
    linkRows = editLinkData.filter(function (row) {
        return row[1].toString() === rowNumber;
    });
    console.log(linkRows);
    console.log(linkRows[0]);
    // window.open(linkRows[0][2], '_blank');
    if (linkRows.length > 0) {
        window.open(linkRows[0][2], '_blank');
    }
    else {
        console.log("no access");
        alert("Sorry, only the creator and Matt's Maker Space facilitators can edit this lesson plan. Please account managment page for more information.");
    }
}

window.addEventListener('message',function(event) {
    if(event.origin !== 'https://n-eqadiyagk5beydaifnjqivawwbzm2n5gqy5jccq-0lu-script.googleusercontent.com') return;
    if(event.data.type !== "initMessage") return;
    editLinkData = event.data.accessibleLinkData;
    event.source.postMessage({"type": "initResponse", "heardFromOrigin": event.origin, "gotLinkData": editLinkData},event.origin);
},false);