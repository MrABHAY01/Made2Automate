const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});



const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
