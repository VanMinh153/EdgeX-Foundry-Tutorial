const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy configuration for EdgeX services mapped by port
const edgexServicesPorts = {
  '59880': 'core-data',
  '59881': 'core-metadata', 
  '59882': 'core-command',
  '59860': 'support-notifications',
  '59861': 'support-scheduler',
  '59701': 'app-service-configurable',
  '59900': 'device-virtual'
};

// Generic EdgeX API proxy that handles all /api/{port} requests
app.use('/api/:port/*', createProxyMiddleware({
  target: 'http://localhost',
  changeOrigin: true,
  router: (req) => {
    const port = req.params.port;
    console.log(`Proxying request to port: ${port}, path: ${req.path}`);
    return `http://localhost:${port}`;
  },
  pathRewrite: {
    '^/api/\\d+': '', // Remove /api/{port} from path
  },
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error(`Proxy error for port ${req.params.port}:`, err.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: err.message,
      port: req.params.port 
    });
  }
}));

// Fallback for /api/{port} requests without trailing path
app.use('/api/:port', createProxyMiddleware({
  target: 'http://localhost',
  changeOrigin: true,
  router: (req) => {
    const port = req.params.port;
    console.log(`Proxying request to port: ${port}, path: ${req.path}`);
    return `http://localhost:${port}`;
  },
  pathRewrite: {
    '^/api/\\d+': '', // Remove /api/{port} from path
  },
  logLevel: 'debug'
}));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Swagger UI Proxy Server running on http://localhost:${PORT}`);
  console.log('Available EdgeX service proxies:');
  Object.keys(edgexServicesPorts).forEach(port => {
    console.log(`  - /api/${port}/* -> http://localhost:${port} (${edgexServicesPorts[port]})`);
  });
  console.log('\nExample usage:');
  console.log('  http://localhost:3000/api/59880/api/v3/ping -> http://localhost:59880/api/v3/ping');
});
