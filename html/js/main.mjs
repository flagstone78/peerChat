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
    addConnCallbacks(conn);
});

peer.on('disconnected',()=>{
    console.log("keep alive");
    peer.reconnect();
})

function connectTo(id){
    let conn = peer.connect(id);
    addConnCallbacks(conn);
}

let app = {peers:[]};
window.app = app;
//connect to all
peer.listAllPeers(function(peers){
    console.log("all peers", peers)
    app.peers = peers;
    setTimeout(connectAll,100);
});

function connectAll(){
    for(let i of app.peers){
        console.log('n',i);
        connectTo(i);
    }
}

function addConnCallbacks(c){
    c.on('open', function() {
        console.log("connection opened!");    
    });
    
    // Receive messages
    c.on('data', function(data) {
        console.log('Received', data);
    });
    allConns.push(c);
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
window.peer = peer;
window.allConns = allConns;

Room.start();

 