const https = require('https'); //for web sever
const fs = require('fs'); // for https keys
const { PeerServer } = require('peer'); // for peer to peer

var express = require('express'); // for serving webpages
var app = express();
app.use(express.static('./html'));

//https keys:
const sslKeys = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};


//peer sever
const peerServer = PeerServer({
  port: 443,
  ssl: sslKeys,
  path:'/myapp',
  allow_discovery:true
});

peerServer.on('connection',(client)=>{
    console.log("Client Connected!");
    console.log(client);
})

peerServer.on('disconnect', (client) => { 
    console.log("Client Disconected!");
    console.log(client);
 });


 //web server
 https.createServer(sslKeys, app).listen(8000);