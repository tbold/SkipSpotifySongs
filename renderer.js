document.getElementById("closeButton").addEventListener('click', () => {
    // console.log("clicked!")
    window.electron.sendMessage();  
})

