window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // EdgeX Foundry API configurations with proxy URLs
  const edgexAPIs = [
    {
      name: "Device Service API",
      url: "./src/Device-Service-API.yaml"
    },
    {
      name: "Application Services API", 
      url: "./src/Application-Services-API.yaml"
    }
  ];

  window.ui = SwaggerUIBundle({
    urls: edgexAPIs,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    requestInterceptor: (request) => {
      // Add proxy prefix to requests if they're going to EdgeX APIs
      if (request.url.startsWith('http://127.0.0.1:') || request.url.startsWith('http://localhost:')) {
        const url = new URL(request.url);
        const port = url.port;
        const path = url.pathname;
        const search = url.search || '';
        // Create proxy URL with simplified pattern: /{port}{path}
        request.url = `http://localhost:3000/${port}${path}${search}`;
      }
      return request;
    }
  });

  //</editor-fold>
};
