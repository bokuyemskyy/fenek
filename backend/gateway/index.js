const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const USERS_URL = process.env.USERS_SERVICE_URL || 'http://localhost:8081';
const CHATS_URL = process.env.CHATS_SERVICE_URL || 'http://localhost:8080';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(rateLimit({ windowMs: 60000, max: 100 }));

app.use('/users', createProxyMiddleware({ target: USERS_URL, changeOrigin: true }));
app.use('/chats', createProxyMiddleware({ target: CHATS_URL, changeOrigin: true }));

const wsProxy = createProxyMiddleware({
    target: `${CHATS_URL}/ws`,
    ws: true,
    changeOrigin: true,
    pathRewrite: { '^/ws': '' },
    onProxyRes(proxyRes) {
        proxyRes.headers['access-control-allow-origin'] = 'http://localhost:5173';
        proxyRes.headers['access-control-allow-credentials'] = 'true';
    }
});
app.use('/ws', wsProxy);

const server = app.listen(3000);
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/ws')) wsProxy.upgrade(req, socket, head);
});
