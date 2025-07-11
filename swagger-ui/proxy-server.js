const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Generic EdgeX API proxy that handles all /{port} requests
app.use('/:port', (req, res, next) => {
  const port = req.params.port;
  
  // Only proxy if port is a number (EdgeX service port)
  if (/^\d+$/.test(port)) {
    console.log(`Proxying request to port: ${port}, original URL: ${req.originalUrl}`);
    
    const proxyMiddleware = createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${port}`]: '', // Remove /{port} from path
      },
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error(`Proxy error for port ${port}:`, err.message);
        res.status(500).json({ 
          error: 'Proxy error', 
          message: err.message,
          port: port 
        });
      }
    });
    
    return proxyMiddleware(req, res, next);
  }
  
  // If not a port number, continue to next middleware
  next();
});

// Serve static files from dist directory (after proxy check)
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

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Swagger UI Proxy Server running on http://localhost:${PORT}`);
  console.log('Available EdgeX service proxies:');
  Object.keys(edgexServicesPorts).forEach(port => {
    console.log(`  - /${port}/* -> http://localhost:${port} (${edgexServicesPorts[port]})`);
  });
  console.log('\nExample usage:');
  console.log('  http://localhost:3000/59880/api/v3/ping -> http://localhost:59880/api/v3/ping');
});
