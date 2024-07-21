const webSocket = require('ws');
const PORT_WS = require('../config/constants').PORT_WS;

const websock = () => {

    const wss = new webSocket.Server({ port: PORT_WS });

    const channels = {};
    let id = 0;

    wss.on("connection", (ws) => {
        console.log("Client connected");
        ws.id = id++;
        let channel;

        if (ws.readyState === webSocket.OPEN) {
            ws.send(JSON.stringify('Client connected'));
        }

        ws.on('message', (message) => {

            const enc = new TextDecoder("utf-8");
            const text = enc.decode(new Uint8Array(message).buffer);
            const jsonobj = JSON.parse(text);

            channel = jsonobj.group;

            if (!channels[channel]) {
                channels[channel] = [];
            }

            const exist = channels[channel].find(wso => wso.id === ws.id);

            if (!exist) {
                channels[channel].push(ws);
            }

            const theMessage = { message: message };

            channels[channel].forEach((client) => {
                client.send(JSON.stringify(theMessage));
            });
        });

        ws.on('error', console.error);

        ws.on('close', () => {
            console.log("Client disconnected");
            if (channel) {
                channels[channel] = channels[channel].filter((client) => client !== ws);
            }
        });

    });
}

module.exports = websock;