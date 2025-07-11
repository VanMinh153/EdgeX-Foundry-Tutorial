# EdgeX Swagger UI Proxy Server

Proxy server này giúp giải quyết vấn đề CORS khi sử dụng Swagger UI với EdgeX Foundry APIs.

## Cài đặt

1. Cài đặt Node.js dependencies:
```bash
npm install
```

## Chạy Proxy Server

```bash
npm start
```

Hoặc để development với auto-reload:
```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:3000`

## Cách hoạt động

### Proxy Mappings

Proxy server sẽ chuyển tiếp các request từ Swagger UI đến các EdgeX services:

- `/api/core-data/*` → `http://localhost:59880/*`
- `/api/core-metadata/*` → `http://localhost:59881/*`
- `/api/core-command/*` → `http://localhost:59882/*`
- `/api/support-notifications/*` → `http://localhost:59860/*`
- `/api/support-scheduler/*` → `http://localhost:59861/*`
- `/api/app-service-configurable/*` → `http://localhost:59701/*`
- `/api/device-virtual/*` → `http://localhost:59900/*`

### Sử dụng

1. Khởi động EdgeX Foundry stack
2. Chạy proxy server: `npm start`
3. Mở browser và truy cập `http://localhost:3000`
4. Swagger UI sẽ load với các EdgeX APIs đã được cấu hình

### APIs được hỗ trợ

- **Core Data API**: Quản lý dữ liệu sensor
- **Core Metadata API**: Quản lý metadata của devices và services
- **Core Command API**: Gửi commands đến devices
- **Support Notifications API**: Hệ thống thông báo
- **Support Scheduler API**: Lập lịch tasks
- **Application Services API**: APIs cho application services
- **Device Service API**: APIs cho device services

## Troubleshooting

### Lỗi CORS
Nếu vẫn gặp lỗi CORS, hãy kiểm tra:
1. Proxy server có đang chạy không
2. EdgeX services có đang chạy trên đúng ports không
3. Browser có cache cũ không (thử hard refresh Ctrl+F5)

### EdgeX Services không phản hồi
Kiểm tra EdgeX services:
```bash
# Kiểm tra core-data service
curl http://localhost:59880/api/v3/ping

# Kiểm tra core-metadata service  
curl http://localhost:59881/api/v3/ping
```

### Port conflicts
Nếu port 3000 đã được sử dụng, bạn có thể thay đổi trong file `proxy-server.js`:
```javascript
const PORT = 3001; // Thay đổi port khác
```

## Cấu hình nâng cao

### Thêm service mới
Để thêm EdgeX service mới, cập nhật object `edgexServices` trong `proxy-server.js`:

```javascript
const edgexServices = {
  // ...existing services...
  '/your-new-service': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
    logLevel: 'debug'
  }
};
```

### Tùy chỉnh headers
Bạn có thể thêm custom headers trong proxy configuration:

```javascript
'/your-service': {
  target: 'http://localhost:PORT',
  changeOrigin: true,
  headers: {
    'Authorization': 'Bearer your-token'
  }
}
```
