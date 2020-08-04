"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const back = require('androidjs').back;  // This was missing but I think needs to be there

const bodyParser = require("body-parser");
const express = require("express");
const blockchain_1 = require("./blockchain");
const p2p_1 = require("./p2p");
//const httpPort = parseInt(process.env.HTTP_PORT) || 3001;
//const p2pPort = parseInt(process.env.P2P_PORT) || 6001;

back.on('blocks',function(){
    back.send('blocks-info',blockchain_1.getBlockchain());
})

back.on('mineBlock',function(data){
    back.send('mine-block',blockchain_1.generateNextBlock(data));
})

back.on('peers',function(){
    back.send('know-peers',p2p_1.getSockets().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
})

back.on('addPeer',function(peer){
    p2p_1.connectToPeers(peer);
    back.send('add-peers', "Done");
})


//testing
back.on('math',function(x,y){
    back.send('math-result',Math.pow(x, y) + ':' + Math.round(new Date().getTime() / 1000));
})

back.on('test',function(){
    back.send('some-info',"Some Messages Coming");
})


//To Start the P2P server send the port number to this
back.on('init-p2p',function(p2pPortString){
    back.send('debug-info','init-p2p: '+p2pPortString);
	//p2pPort = parseInt(p2pPortString) || 6001;
    //back.send('debug-info','init-p2p: '+p2pPortString+' -> '+p2pPort);
	p2p_1.initP2PServer(6001);
    back.send('debug-info','P2P Initialized');
})

/*const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());
    app.get('/blocks', (req, res) => {
        res.send(blockchain_1.getBlockchain());
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock = blockchain_1.generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send(p2p_1.getSockets().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        p2p_1.connectToPeers(req.body.peer);
        res.send();
    });
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
initHttpServer(httpPort);**/
//p2p_1.initP2PServer(p2pPort);
//# sourceMappingURL=main.js.map