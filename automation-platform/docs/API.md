# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Content Management

### Generate Content
**POST** `/content/generate`

Generate AI content for a specific niche and platform.

**Request:**
```json
{
  "niche": "tech",
  "platform": "tiktok",
  "affiliateLinks": ["https://example.com/product1"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Content Title",
  "content": "Full content text",
  "hashtags": ["#tech", "#trending"],
  "callToAction": "Check the link in bio",
  "status": "draft"
}
```

### Generate Batch Content
**POST** `/content/batch`

Generate multiple content pieces at once.

**Request:**
```json
{
  "niche": "finance",
  "count": 5,
  "platforms": ["instagram", "tiktok", "twitter"]
}
```

**Response:**
```json
{
  "contents": [
    { /* content object */ },
    { /* content object */ }
  ],
  "totalGenerated": 5
}
```

### Get Content Library
**GET** `/content/library`

Retrieve all generated content.

**Query Parameters:**
- `niche` (optional): Filter by niche
- `status` (optional): Filter by status (draft, scheduled, published)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "contents": [
    { /* content object */ }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

---

## Social Media Scheduling

### Schedule Post
**POST** `/social/schedule`

Schedule content to be posted to social media platforms.

**Request:**
```json
{
  "contentId": "uuid",
  "platforms": ["instagram", "tiktok", "twitter"],
  "scheduledTime": "2024-05-20T14:30:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "contentId": "uuid",
  "platforms": ["instagram", "tiktok", "twitter"],
  "scheduledTime": "2024-05-20T14:30:00Z",
  "status": "scheduled"
}
```

### Get Scheduled Posts
**GET** `/social/scheduled`

Retrieve all scheduled posts.

**Query Parameters:**
- `status` (optional): Filter by status
- `platform` (optional): Filter by platform
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "posts": [
    { /* post object */ }
  ],
  "total": 50
}
```

### Cancel Scheduled Post
**DELETE** `/social/scheduled/:postId`

Cancel a scheduled post.

**Response:**
```json
{
  "success": true,
  "message": "Post cancelled successfully"
}
```

---

## Affiliate Marketing

### Create Affiliate Link
**POST** `/affiliate/links`

Create a tracked affiliate link.

**Request:**
```json
{
  "originalUrl": "https://amazon.com/product",
  "network": "amazon",
  "productName": "Product Name",
  "commissionRate": 5.5,
  "niche": "tech"
}
```

**Response:**
```json
{
  "id": "uuid",
  "originalUrl": "https://amazon.com/product",
  "shortUrl": "https://yourdomain.com/link/abc123",
  "network": "amazon",
  "productName": "Product Name",
  "commissionRate": 5.5,
  "niche": "tech"
}
```

### Track Link Click
**POST** `/affiliate/links/:linkId/click`

Record a click on an affiliate link.

**Request:**
```json
{
  "platform": "instagram",
  "referrer": "instagram.com/yourprofile",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

**Response:**
```json
{
  "id": "uuid",
  "linkId": "uuid",
  "platform": "instagram",
  "clickedAt": "2024-05-20T10:30:00Z"
}
```

### Record Conversion
**POST** `/affiliate/conversions`

Record a sale/conversion.

**Request:**
```json
{
  "linkId": "uuid",
  "clickId": "uuid",
  "amount": 49.99,
  "network": "amazon"
}
```

**Response:**
```json
{
  "id": "uuid",
  "linkId": "uuid",
  "amount": 49.99,
  "commission": 2.75,
  "status": "pending"
}
```

### Get Link Statistics
**GET** `/affiliate/links/:linkId/stats`

Get performance metrics for a specific link.

**Response:**
```json
{
  "link": { /* link object */ },
  "clicks": 150,
  "conversions": 12,
  "totalCommission": 32.99,
  "conversionRate": 8.0
}
```

### Get Earnings Summary
**GET** `/affiliate/earnings`

Get overall earnings summary.

**Response:**
```json
{
  "totalClicks": 5000,
  "totalConversions": 400,
  "totalEarnings": 1250.50,
  "byNetwork": {
    "amazon": 750.25,
    "cj": 350.00,
    "clickbank": 150.25
  },
  "byNiche": {
    "tech": 600.00,
    "finance": 400.50,
    "lifestyle": 250.00
  }
}
```

### Get Top Performing Links
**GET** `/affiliate/top-links`

Get your best-performing affiliate links.

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "links": [
    {
      "link": { /* link object */ },
      "clicks": 500,
      "conversions": 50,
      "commission": 250.00
    }
  ]
}
```

---

## E-Commerce

### Create Product
**POST** `/ecommerce/products`

Add a new product to your inventory.

**Request:**
```json
{
  "title": "Product Name",
  "description": "Product description",
  "price": 49.99,
  "cost": 20.00,
  "sku": "PROD-001",
  "imageUrls": ["https://example.com/image1.jpg"],
  "inventoryCount": 100
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Product Name",
  "price": 49.99,
  "sku": "PROD-001",
  "inventoryCount": 100,
  "status": "active"
}
```

### List Product on Platform
**POST** `/ecommerce/products/:productId/list`

List a product on a sales platform.

**Request:**
```json
{
  "platform": "shopify",
  "platformProductId": "gid://shopify/Product/123456"
}
```

**Response:**
```json
{
  "id": "uuid",
  "platforms": {
    "shopify": "gid://shopify/Product/123456"
  }
}
```

### Update Inventory
**PATCH** `/ecommerce/products/:productId/inventory`

Update product inventory count.

**Request:**
```json
{
  "quantity": -5
}
```

**Response:**
```json
{
  "id": "uuid",
  "inventoryCount": 95
}
```

### Create Order
**POST** `/ecommerce/orders`

Create a new order.

**Request:**
```json
{
  "productId": "uuid",
  "quantity": 2,
  "platform": "shopify"
}
```

**Response:**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": 2,
  "totalPrice": 99.98,
  "status": "pending"
}
```

### Get Sales Statistics
**GET** `/ecommerce/stats`

Get sales and revenue metrics.

**Response:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 7499.50,
  "totalCost": 3000.00,
  "totalProfit": 4499.50,
  "averageOrderValue": 49.99,
  "byPlatform": {
    "shopify": { "orders": 100, "revenue": 5000.00 },
    "amazon": { "orders": 50, "revenue": 2499.50 }
  }
}
```

---

## Data Insights

### Create Insight
**POST** `/insights/create`

Create a new data insight for sale.

**Request:**
```json
{
  "type": "market_analysis",
  "source": "web_scraping",
  "title": "Tech Market Trends 2024",
  "description": "Comprehensive analysis of tech market trends",
  "data": { /* your data */ },
  "price": 29.99
}
```

**Response:**
```json
{
  "id": "uuid",
  "type": "market_analysis",
  "title": "Tech Market Trends 2024",
  "status": "draft"
}
```

### Publish Insight
**POST** `/insights/:insightId/publish`

Publish an insight for sale.

**Response:**
```json
{
  "id": "uuid",
  "status": "published"
}
```

### Get Market Trends
**GET** `/insights/trends/:niche`

Get trending topics and opportunities in a niche.

**Response:**
```json
{
  "trend": "AI and automation tools",
  "direction": "up",
  "confidence": 0.92,
  "insights": [
    "AI tools seeing 150% YoY growth",
    "Automation platforms gaining adoption"
  ]
}
```

### Get Competitor Analysis
**GET** `/insights/competitors/:niche`

Get competitor intelligence for a niche.

**Response:**
```json
{
  "competitors": [
    {
      "name": "Competitor A",
      "marketShare": 35,
      "strengths": ["Brand recognition"],
      "weaknesses": ["High prices"]
    }
  ],
  "opportunities": [
    "Target underserved segments",
    "Offer better support"
  ]
}
```

### Generate Market Report
**GET** `/insights/report/:niche`

Generate a comprehensive market analysis report.

**Response:**
```json
{
  "niche": "tech",
  "trends": { /* trend data */ },
  "competitors": { /* competitor data */ },
  "demographics": { /* demographic data */ },
  "recommendations": [
    "Focus on trending topics",
    "Differentiate from competitors"
  ]
}
```

---

## Analytics

### Get Dashboard Metrics
**GET** `/analytics/dashboard`

Get real-time dashboard metrics.

**Response:**
```json
{
  "totalEarnings": 5000.00,
  "totalClicks": 10000,
  "totalConversions": 500,
  "conversionRate": 5.0,
  "topPlatform": "instagram",
  "topNiche": "tech",
  "revenueBySource": {
    "affiliate": 3000.00,
    "ecommerce": 2000.00
  }
}
```

### Get Performance Report
**GET** `/analytics/report`

Get detailed performance report.

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `groupBy` (optional): Group by (day, week, month)

**Response:**
```json
{
  "data": [
    {
      "date": "2024-05-20",
      "clicks": 150,
      "conversions": 12,
      "earnings": 60.00
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

---

## Rate Limiting

- **Free tier**: 100 requests per hour
- **Pro tier**: 1000 requests per hour
- **Enterprise**: Unlimited

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1621555200
```

---

## Webhooks

Subscribe to events via webhooks:

### Available Events
- `post.published`
- `conversion.recorded`
- `order.created`
- `inventory.low`

### Register Webhook
**POST** `/webhooks/register`

```json
{
  "url": "https://yourserver.com/webhook",
  "events": ["post.published", "conversion.recorded"]
}
```

---

## Support

For API issues or questions:
- Email: api-support@automationhub.com
- Docs: https://docs.automationhub.com
- Status: https://status.automationhub.com
