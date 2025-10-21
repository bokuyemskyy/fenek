const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;
const CHATS_SERVICE_URL = process.env.CHATS_SERVICE_URL;

app.use(cors());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 60000, max: 100 }));

app.use('/users', createProxyMiddleware({ target: USERS_SERVICE_URL, changeOrigin: true }));
app.use('/chats', createProxyMiddleware({ target: CHATS_SERVICE_URL, changeOrigin: true }));

app.listen(3000, () => console.log('Gateway listening on port 3000'));
