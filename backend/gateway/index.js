const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const USERS_URL = process.env.USERS_SERVICE_URL;
const CHATS_URL = process.env.CHATS_SERVICE_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100
}));

app.use('/login/oauth2', createProxyMiddleware({
    target: USERS_URL + '/login/oauth2',
    changeOrigin: true
}));

app.use('/oauth2', createProxyMiddleware({
    target: USERS_URL + '/oauth2',
    changeOrigin: true
}));

app.use('/api/users', createProxyMiddleware({
    target: USERS_URL,
    changeOrigin: true
}));

app.use('/api/chats', createProxyMiddleware({
    target: CHATS_URL,
    changeOrigin: true
}));

const wsProxy = createProxyMiddleware({
    target: CHATS_URL,
    ws: true,
    changeOrigin: true
});

app.use('/ws', wsProxy);

const server = app.listen(8080, () => {
    console.log('Gateway listening on port 8080');
});

server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/ws')) {
        wsProxy.upgrade(req, socket, head);
    }
});