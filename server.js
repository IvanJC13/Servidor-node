const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on('connection', function connection(ws) {
    console.log('Cliente conectado');
    clients.add(ws);

    ws.on('message', function incoming(messageData) {
        const data = JSON.parse(messageData);
        const usuario = data.usuario;
        const mensaje = data.mensaje;

        console.log(`${usuario} mandó un mensaje: ${mensaje}`);

        const messageToSend = {
            usuario,
            mensaje
        };

        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messageToSend));
            }
        });
    });

    ws.on('close', function() {
        console.log('Cliente desconectado');
        clients.delete(ws);
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send('¡Un cliente se ha desconectado del chat!');
            }
        });
    });
});

console.log('Servidor WebSocket iniciado en ws://localhost:8080');