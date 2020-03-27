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

window.addEventListener('message',function(event) {
    //if(event.origin !== 'https://neqadiyagk5beydaifnjqivawwbzm2n5gqy5jccq-0lu-script.googleusercontent.com') return;
    // alert('message received:  \n' + event +'\n'+ event.origin +'\n'+JSON.stringify(event.data), event);
    event.source.postMessage('holla back youngin!',event.origin);
},false);