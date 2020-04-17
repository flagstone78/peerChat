//peerjs library loaded in html

import Room from './Room.mjs'

var allConns = [];
//object representing my connection to peer server
const peer = new Peer(null, {
    host: 'localhost',
    port: 443,
    path: '/myapp'
});

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

peer.on('connection', function(conn) {
    console.log("connection");
    allConns.push(conn);
});

peer.on('disconnected',()=>{
    console.log("keep alive");
    peer.reconnect();
})

function connectTo(id){
    conn = peer.connect(id);
    addConnCallbacks(conn);
}

function addConnCallbacks(c){
    c.on('open', function() {
        console.log("connection opened!");    
    });
    
    // Receive messages
    c.on('data', function(data) {
        console.log('Received', data);
    });
    allConns.push(conn);
}

function startWebCam(){
    let a = document.createElement("video");
    document.body.append(a);
    
    let constraints = { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        /* use the stream */
        a.srcObject = stream;
        a.play();
    })
    .catch(function(err) {
    /* handle the error */
    });
}

window.startWebCam = startWebCam;

Room.start();

 