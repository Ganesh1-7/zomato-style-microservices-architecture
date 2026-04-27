# Monitoring Stack Implementation — Prometheus + Grafana + Loki + Node Exporter

## Steps
- [x] 1. Create monitoring directory structure and config files
  - [x] 1a. `monitoring/prometheus/prometheus.yml`
  - [x] 1b. `monitoring/loki/loki.yml`
  - [x] 1c. `monitoring/promtail/promtail.yml`
  - [x] 1d. `monitoring/grafana/provisioning/datasources/datasources.yml`
  - [x] 1e. `monitoring/grafana/provisioning/dashboards/dashboards.yml`
  - [x] 1f. `monitoring/grafana/dashboards/microservices-dashboard.json`
- [x] 2. Add `prom-client` dependency to all 5 service `package.json` files
- [x] 3. Add metrics middleware & `/metrics` endpoint to all 5 `server.js` files
  - [x] 3a. `user-service/server.js`
  - [x] 3b. `order-service/server.js`
  - [x] 3c. `restaurant-service/server.js`
  - [x] 3d. `delivery-service/server.js`
  - [x] 3e. `payment-service/server.js`
- [x] 4. Update root `docker-compose.yml` with monitoring services
- [x] 5. Update `backend/docker-compose.yml` with monitoring services
- [x] 6. Update `backend/gateway/nginx.conf` with structured JSON logging
- [x] 7. Add `node-exporter` for host system metrics (CPU, memory, disk, network)
  - [x] 7a. `docker-compose.yml`
  - [x] 7b. `backend/docker-compose.yml`
  - [x] 7c. `monitoring/prometheus/prometheus.yml`
  - [x] 7d. `monitoring/grafana/dashboards/microservices-dashboard.json`

## Quick Start
```bash
# Rebuild and start everything including monitoring
docker-compose up -d --build

# Access points:
# - App Frontend:    http://localhost:80
# - API Gateway:     http://localhost:8080
# - Grafana:         http://localhost:3000  (admin/admin)
# - Prometheus:      http://localhost:9090
# - Loki:            http://localhost:3100
# - Node Exporter:   http://localhost:9100
```

## Metrics Exposed Per Service
| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total requests by method, route, status |
| `http_request_duration_seconds` | Histogram | Request latency distribution |
| `process_resident_memory_bytes` | Gauge | Node.js memory usage |
| `nodejs_eventloop_lag_seconds` | Gauge | Event loop lag |

## Host System Metrics (Node Exporter)
| Metric | Type | Description |
|--------|------|-------------|
| `node_cpu_seconds_total` | Counter | CPU time per mode |
| `node_memory_MemTotal_bytes` | Gauge | Total system memory |
| `node_memory_MemAvailable_bytes` | Gauge | Available system memory |
| `node_filesystem_size_bytes` | Gauge | Filesystem size |
| `node_filesystem_avail_bytes` | Gauge | Filesystem available |
| `node_network_receive_bytes_total` | Counter | Network bytes received |
| `node_network_transmit_bytes_total` | Counter | Network bytes transmitted |

## Service-Specific Custom Metrics
| Service | Metric | Description |
|---------|--------|-------------|
| order-service | `orders_created_total` | Orders placed |
| order-service | `orders_cancelled_total` | Orders cancelled |
| restaurant-service | `restaurant_searches_total` | Search/filter queries |
| delivery-service | `deliveries_created_total` | Deliveries created |
| delivery-service | `deliveries_completed_total` | Deliveries completed |
| payment-service | `payments_processed_total` | Payments by status/method |
| payment-service | `payments_refunded_total` | Refunds processed |
