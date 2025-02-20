# Disaster Alert System API Reference

## Authentication

All API endpoints require authentication using a JWT token. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

```http
POST /auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "access_token": "your_jwt_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## Alerts

### List Alerts

```http
GET /api/alerts
```

Query Parameters:
- `priority`: Filter by priority (low, medium, high)
- `zone_id`: Filter by zone
- `status`: Filter by status (active, scheduled, completed)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Alert Title",
      "content": "Alert Content",
      "priority": "high",
      "zone_id": "zone_uuid",
      "created_at": "2024-03-20T12:00:00Z",
      "status": "active"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### Create Alert

```http
POST /api/alerts
Content-Type: application/json

{
  "title": "Alert Title",
  "content": "Alert Content",
  "priority": "high",
  "zone_id": "zone_uuid"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "Alert Title",
  "content": "Alert Content",
  "priority": "high",
  "zone_id": "zone_uuid",
  "created_at": "2024-03-20T12:00:00Z",
  "status": "active"
}
```

### Schedule Alert

```http
POST /api/alerts/schedule
Content-Type: application/json

{
  "title": "Scheduled Alert",
  "content": "Alert Content",
  "priority": "medium",
  "zone_id": "zone_uuid",
  "schedule_date": "2024-03-21T15:00:00Z",
  "recurring": true,
  "frequency": "daily"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "Scheduled Alert",
  "schedule_date": "2024-03-21T15:00:00Z",
  "status": "scheduled"
}
```

### Update Alert

```http
PUT /api/alerts/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated Content",
  "priority": "high"
}
```

### Delete Alert

```http
DELETE /api/alerts/:id
```

## Zones

### List Zones

```http
GET /api/zones
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Zone Name",
      "description": "Zone Description",
      "coordinates": [
        [longitude, latitude],
        [longitude, latitude]
      ],
      "created_at": "2024-03-20T12:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

### Create Zone

```http
POST /api/zones
Content-Type: application/json

{
  "name": "Zone Name",
  "description": "Zone Description",
  "coordinates": [
    [longitude, latitude],
    [longitude, latitude]
  ]
}
```

### Update Zone

```http
PUT /api/zones/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated Description",
  "coordinates": [
    [longitude, latitude],
    [longitude, latitude]
  ]
}
```

### Delete Zone

```http
DELETE /api/zones/:id
```

## Analytics

### Get Alert Statistics

```http
GET /api/analytics/alerts
```

Query Parameters:
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `zone_id`: Filter by zone

Response:
```json
{
  "total_alerts": 100,
  "by_priority": {
    "high": 20,
    "medium": 50,
    "low": 30
  },
  "by_zone": [
    {
      "zone_id": "uuid",
      "zone_name": "Zone Name",
      "alert_count": 25
    }
  ],
  "by_month": [
    {
      "month": "2024-03",
      "count": 30
    }
  ]
}
```

### Get System Metrics

```http
GET /api/analytics/system
```

Response:
```json
{
  "uptime": 99.9,
  "total_users": 500,
  "active_zones": 20,
  "alerts_today": 10
}
```

## User Management

### List Users

```http
GET /api/users
```

Query Parameters:
- `role`: Filter by role (admin, operator, viewer)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "operator",
      "created_at": "2024-03-20T12:00:00Z"
    }
  ],
  "meta": {
    "total": 500,
    "page": 1,
    "limit": 10
  }
}
```

### Update User Role

```http
PUT /api/users/:id/role
Content-Type: application/json

{
  "role": "operator"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "validation_error",
  "message": "Invalid input data",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_server_error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621436400
``` 