var socket = io.connect('http://localhost:3000');

var btn = document.getElementById('send');

// emit events 'work true'
btn.addEventListener('click',()=> { // see if arrow
    socket.emit('chat',{ // send event to server
        msg:'Butiful! Some one add to Cart!'
    })
}); 


// listen for events from server 'not work here'

socket.on('chat',data => {
    output.innerHTML = data.msg;
});